import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Heart,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyProfile } from "../hooks/useQueries";
import {
  formatBloodType,
  formatDonorType,
  formatGender,
  formatOrgan,
} from "../lib/helpers";

const PROFILE_SKELETONS = ["ps1", "ps2", "ps3", "ps4", "ps5"];
const DONOR_SKELETONS = ["ds1", "ds2", "ds3", "ds4"];

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useMyProfile();

  if (!identity) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center" data-ocid="dashboard.error_state">
          <p className="text-muted-foreground mb-4">
            Please sign in to view your dashboard.
          </p>
          <Button onClick={() => navigate({ to: "/auth" })}>Sign In</Button>
        </div>
      </main>
    );
  }

  const profile = profileData?.[0] ?? null;
  const donorProfile = profileData?.[1] ?? null;

  const profileRows: [string, string][] = profile
    ? [
        ["Full Name", profile.name],
        ["Email", profile.email],
        ["Age", `${profile.age} years`],
        ["Gender", formatGender(profile.gender)],
        ["Blood Type", formatBloodType(profile.bloodType)],
        ["Phone", profile.phone || "Not provided"],
        ["Address", profile.address || "Not provided"],
        [
          "Emergency Contact",
          profile.emergencyContactName
            ? `${profile.emergencyContactName} (${profile.emergencyContactPhone})`
            : "Not provided",
        ],
      ]
    : [];

  const summaryCards = [
    { label: "Total Donations", value: "0", icon: Heart },
    { label: "Lives Impacted", value: "0", icon: CheckCircle2 },
    {
      label: "Next Appointment",
      value: donorProfile ? "Schedule one" : "N/A",
      icon: Calendar,
    },
    {
      label: "Donor Status",
      value: donorProfile ? "Active" : "Inactive",
      icon: User,
    },
  ];

  return (
    <main className="container max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl">
              Welcome back{profile ? `, ${profile.name.split(" ")[0]}` : ""}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your donor profile and track your impact.
            </p>
          </div>
          {!donorProfile && (
            <Link to="/register-donor">
              <Button
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="dashboard.register_donor.primary_button"
              >
                <Heart className="w-4 h-4 mr-2" /> Become a Donor
              </Button>
            </Link>
          )}
        </div>

        <div
          className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${donorProfile ? "bg-green-50 border border-green-200" : "bg-accent border border-primary/20"}`}
        >
          {donorProfile ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                You are a registered donor! Thank you for your commitment to
                saving lives.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm font-medium">
                You have not registered as a donor yet.{" "}
                <Link to="/register-donor" className="text-primary underline">
                  Register now
                </Link>{" "}
                to start saving lives.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" /> Personal Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3" data-ocid="dashboard.loading_state">
                  {PROFILE_SKELETONS.map((k) => (
                    <Skeleton key={k} className="h-4 w-full" />
                  ))}
                </div>
              ) : profile ? (
                <dl className="space-y-3 text-sm">
                  {profileRows.map(([label, val]) => (
                    <div
                      key={label}
                      className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-right max-w-[60%] truncate">
                        {val}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">No profile found.</p>
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="mt-3">
                      Set Up Profile
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" /> Donor Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {DONOR_SKELETONS.map((k) => (
                    <Skeleton key={k} className="h-4 w-full" />
                  ))}
                </div>
              ) : donorProfile ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Donation Type</dt>
                    <dd className="font-medium">
                      {formatDonorType(donorProfile.donorType)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Blood Type</dt>
                    <dd>
                      <Badge
                        className="bg-red-50 text-red-700 border border-red-200 text-xs"
                        variant="outline"
                      >
                        {formatBloodType(donorProfile.bloodType)}
                      </Badge>
                    </dd>
                  </div>
                  {donorProfile.organs.length > 0 && (
                    <div className="border-b border-border pb-2">
                      <dt className="text-muted-foreground mb-2">Organs</dt>
                      <dd className="flex flex-wrap gap-1">
                        {donorProfile.organs.map((o) => (
                          <Badge
                            key={o}
                            variant="secondary"
                            className="text-xs"
                          >
                            {formatOrgan(o)}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Registered</dt>
                    <dd className="font-medium">
                      {new Date(
                        Number(donorProfile.registrationDate) / 1_000_000,
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Not registered as a donor yet.
                  </p>
                  <Link to="/register-donor">
                    <Button
                      size="sm"
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      data-ocid="dashboard.become_donor.button"
                    >
                      Register as Donor
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="w-5 h-5 text-primary" /> Donation
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryCards.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="text-center p-4 bg-background rounded-xl border border-border"
                  >
                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-heading font-bold text-xl">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
