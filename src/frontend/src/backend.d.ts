import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DonationCenter {
    id: bigint;
    hours: string;
    city: string;
    name: string;
    donorType: DonorType;
    address: string;
    availableBloodTypes: Array<BloodType>;
    phone: string;
}
export interface DonationRecord {
    donationType: DonorType;
    center: string;
    status: DonationStatus;
    bloodType?: BloodType;
    organ?: Organ;
    donor: Principal;
    donationDate: bigint;
}
export interface Stats {
    totalLivesSaved: bigint;
    totalBloodUnits: bigint;
    totalDonors: bigint;
}
export interface DonorProfile {
    bloodType: BloodType;
    organs: Array<Organ>;
    user: Principal;
    donorType: DonorType;
    medicalHistoryAcknowledged: boolean;
    registrationDate: bigint;
}
export interface UserProfile {
    age: bigint;
    bloodType: BloodType;
    name: string;
    email: string;
    address: string;
    gender: Gender;
    emergencyContactPhone: string;
    emergencyContactName: string;
    phone: string;
}
export interface DonorPublicInfo {
    center?: string;
    bloodType: BloodType;
    lastDonationDate?: bigint;
    donorType: DonorType;
    firstName: string;
}
export enum BloodType {
    AB_Neg = "AB_Neg",
    AB_Pos = "AB_Pos",
    B_Neg = "B_Neg",
    B_Pos = "B_Pos",
    A_Neg = "A_Neg",
    A_Pos = "A_Pos",
    O_Neg = "O_Neg",
    O_Pos = "O_Pos"
}
export enum DonationStatus {
    scheduled = "scheduled",
    completed = "completed"
}
export enum DonorType {
    organ = "organ",
    both = "both",
    blood = "blood"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum Organ {
    pancreas = "pancreas",
    heart = "heart",
    corneas = "corneas",
    liver = "liver",
    lungs = "lungs",
    kidney = "kidney",
    intestines = "intestines"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDonationCenter(center: DonationCenter): Promise<bigint>;
    addDonationRecord(record: DonationRecord): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDonationCenters(city: string | null, donorType: DonorType | null): Promise<Array<DonationCenter>>;
    getDonors(): Promise<Array<DonorPublicInfo>>;
    getMyProfile(): Promise<[UserProfile, DonorProfile | null]>;
    getNextId(): Promise<bigint>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerDonor(donorProfile: DonorProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<void>;
    updateDonationRecord(id: bigint, status: DonationStatus): Promise<void>;
}
