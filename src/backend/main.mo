import Map "mo:core/Map";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  ////////////////////
  // Data Types
  ////////////////////

  type BloodType = { #A_Pos; #A_Neg; #B_Pos; #B_Neg; #AB_Pos; #AB_Neg; #O_Pos; #O_Neg };
  type Gender = { #male; #female; #other };
  type DonorType = { #blood; #organ; #both };
  type Organ = { #kidney; #liver; #heart; #lungs; #corneas; #pancreas; #intestines };
  type DonationStatus = { #completed; #scheduled };

  public type UserProfile = {
    name : Text;
    email : Text;
    bloodType : BloodType;
    age : Nat;
    gender : Gender;
    phone : Text;
    address : Text;
    emergencyContactName : Text;
    emergencyContactPhone : Text;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  public type DonorProfile = {
    user : Principal;
    donorType : DonorType;
    bloodType : BloodType;
    organs : [Organ];
    medicalHistoryAcknowledged : Bool;
    registrationDate : Int;
  };

  public type DonationRecord = {
    donor : Principal;
    donationType : DonorType;
    bloodType : ?BloodType;
    organ : ?Organ;
    donationDate : Int;
    center : Text;
    status : DonationStatus;
  };

  public type DonationCenter = {
    id : Nat;
    name : Text;
    address : Text;
    city : Text;
    phone : Text;
    hours : Text;
    donorType : DonorType;
    availableBloodTypes : [BloodType];
  };

  public type DonorPublicInfo = {
    firstName : Text;
    bloodType : BloodType;
    donorType : DonorType;
    lastDonationDate : ?Int;
    center : ?Text;
  };

  public type Stats = {
    totalDonors : Nat;
    totalLivesSaved : Nat;
    totalBloodUnits : Nat;
  };

  ////////////////////
  // Storage
  ////////////////////

  var nextId = 1;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let donorProfiles = Map.empty<Principal, DonorProfile>();
  let donationRecords = Map.empty<Nat, DonationRecord>();
  let donationCenters = Map.empty<Nat, DonationCenter>();

  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  ////////////////////
  // Helper Functions
  ////////////////////

  public shared ({ caller }) func getNextId() : async Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  /////////////
  // Queries
  /////////////

  // Public query - no auth needed
  public query ({ caller }) func getDonationCenters(city : ?Text, donorType : ?DonorType) : async [DonationCenter] {
    let centersIter = donationCenters.values();
    let filtered = centersIter.filter(
      func(center) {
        let cityMatch = switch (city) {
          case (null) { true };
          case (?c) { center.city == c };
        };
        let typeMatch = switch (donorType) {
          case (null) { true };
          case (?t) { center.donorType == t };
        };
        cityMatch and typeMatch;
      }
    );
    filtered.toArray();
  };

  // Public query - no auth needed
  public query ({ caller }) func getDonors() : async [DonorPublicInfo] {
    let donorsIter = donorProfiles.values();
    let publicInfoIter = donorsIter.map(
      func(donor) {
        var lastDonation : ?Int = null;
        var center : ?Text = null;
        for ((_, record) in donationRecords.entries()) {
          if (record.donor == donor.user and record.donationType == donor.donorType) {
            switch (lastDonation) {
              case (null) {
                lastDonation := ?record.donationDate;
                center := ?record.center;
              };
              case (?date) {
                if (record.donationDate > date) {
                  lastDonation := ?record.donationDate;
                  center := ?record.center;
                };
              };
            };
          };
        };
        let firstName = switch (userProfiles.get(donor.user)) {
          case (?profile) {
            let firstNameIter = profile.name.chars().takeWhile(func (char) { char != ' ' });
            Text.fromArray(Array.fromIter(firstNameIter));
          };
          case (null) { "" };
        };
        {
          firstName;
          bloodType = donor.bloodType;
          donorType = donor.donorType;
          lastDonationDate = lastDonation;
          center;
        };
      }
    );
    publicInfoIter.toArray<DonorPublicInfo>();
  };

  // User-only: get own profile and donation history
  public query ({ caller }) func getMyProfile() : async (UserProfile, ?DonorProfile) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    let user = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };
    let donor = donorProfiles.get(caller);
    (user, donor);
  };

  // Public query - no auth needed
  public query ({ caller }) func getStats() : async Stats {
    var totalDonors = 0;
    var totalLivesSaved = 0;
    var totalBloodUnits = 0;
    for ((_, donor) in donorProfiles.entries()) {
      totalDonors += 1;
      for ((_, record) in donationRecords.entries()) {
        if (record.donor == donor.user and record.status == #completed) {
          totalLivesSaved += 1;
          if (donor.donorType == #blood or donor.donorType == #both) {
            totalBloodUnits += 1;
          };
        };
      };
    };
    {
      totalDonors;
      totalLivesSaved;
      totalBloodUnits;
    };
  };

  // User-only: get own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // User can view own profile, admin can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /////////////
  // Updates
  /////////////

  // User-only: save own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User-only: register as donor
  public shared ({ caller }) func registerDonor(donorProfile : DonorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as donors");
    };
    // Ensure the donor profile is for the caller
    if (donorProfile.user != caller) {
      Runtime.trap("Unauthorized: Can only register yourself as a donor");
    };
    donorProfiles.add(caller, donorProfile);
  };

  // User-only: add donation record for themselves
  public shared ({ caller }) func addDonationRecord(record : DonationRecord) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add donation records");
    };
    // Ensure the donation record is for the caller
    if (record.donor != caller) {
      Runtime.trap("Unauthorized: Can only add donation records for yourself");
    };
    let id = await getNextId();
    donationRecords.add(id, record);
    id;
  };

  // Admin-only: add donation center
  public shared ({ caller }) func addDonationCenter(center : DonationCenter) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add donation centers");
    };
    let id = await getNextId();
    donationCenters.add(id, center);
    id;
  };

  // User can update their own donation records, admin can update any
  public shared ({ caller }) func updateDonationRecord(id : Nat, status : DonationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update donation records");
    };
    switch (donationRecords.get(id)) {
      case (null) { Runtime.trap("Donation record not found") };
      case (?record) {
        // Check ownership unless admin
        if (record.donor != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own donation records");
        };
        let updated = {
          record with status;
        };
        donationRecords.add(id, updated);
      };
    };
  };

  /////////////
  // Pre-populate data
  /////////////

  // Admin-only: seed initial data
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };
    // Centers
    let centers : [DonationCenter] = [
      {
        id = 1;
        name = "City Hospital";
        address = "123 Main St";
        city = "New York";
        phone = "123-456-7890";
        hours = "9am - 5pm";
        donorType = #both;
        availableBloodTypes = [#A_Pos, #B_Pos, #O_Pos];
      },
    ];
    for (center in centers.values()) {
      donationCenters.add(center.id, center);
    };

    // Donors
    let donors : [(Principal, DonorProfile)] = [
      (
        Blob.fromArray([1]).fromBlob(),
        {
          user = Blob.fromArray([1]).fromBlob();
          donorType = #blood;
          bloodType = #A_Pos;
          organs = [];
          medicalHistoryAcknowledged = true;
          registrationDate = Time.now();
        },
      ),
    ];
    for ((principal, donor) in donors.values()) {
      donorProfiles.add(principal, donor);
    };

    // Records
    let records : [(Nat, DonationRecord)] = [
      (
        1,
        {
          donor = Blob.fromArray([1]).fromBlob();
          donationType = #blood;
          bloodType = ?#A_Pos;
          organ = null;
          donationDate = Time.now();
          center = "City Hospital";
          status = #completed;
        },
      ),
    ];
    for ((id, record) in records.values()) {
      donationRecords.add(id, record);
    };
  };
};
