import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodType, DonorType, Organ } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterDonor } from "../hooks/useQueries";
import { formatBloodType, formatOrgan } from "../lib/helpers";

const ALL_ORGANS = Object.values(Organ);

export default function RegisterDonor() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const registerDonor = useRegisterDonor();

  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [donorType, setDonorType] = useState<DonorType | "">("");
  const [organs, setOrgans] = useState<Organ[]>([]);
  const [medicalAck, setMedicalAck] = useState(false);

  if (!identity) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center" data-ocid="register_donor.error_state">
          <p className="text-muted-foreground">
            Please sign in to register as a donor.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/auth" })}>
            Sign In
          </Button>
        </div>
      </main>
    );
  }

  const toggleOrgan = (o: Organ) => {
    setOrgans((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType || !donorType) {
      toast.error("Please select blood type and donation type.");
      return;
    }
    if (
      (donorType === DonorType.organ || donorType === DonorType.both) &&
      organs.length === 0
    ) {
      toast.error("Please select at least one organ to donate.");
      return;
    }
    if (!medicalAck) {
      toast.error("Please acknowledge the medical history declaration.");
      return;
    }
    try {
      await registerDonor.mutateAsync({
        user: identity.getPrincipal(),
        bloodType: bloodType as BloodType,
        donorType: donorType as DonorType,
        organs: donorType === DonorType.blood ? [] : organs,
        medicalHistoryAcknowledged: medicalAck,
        registrationDate: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("You are now registered as a donor! Thank you.");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <main className="container max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-4">
            <Heart className="w-7 h-7 text-primary fill-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl">
            Donor Registration
          </h1>
          <p className="text-muted-foreground mt-2">
            Register to become a life-saving blood or organ donor
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
            <CardDescription>
              Please provide your donation preferences and health declarations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donation Type */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Donation Type *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(DonorType).map((dt) => (
                    <button
                      key={dt}
                      type="button"
                      onClick={() => setDonorType(dt)}
                      data-ocid={`register.${dt}.toggle`}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        donorType === dt
                          ? "border-primary bg-accent text-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {dt === DonorType.blood
                        ? "Blood Only"
                        : dt === DonorType.organ
                          ? "Organ Only"
                          : "Blood & Organ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Type */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Blood Type *
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(BloodType).map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => setBloodType(bt)}
                      data-ocid="register.blood_type.toggle"
                      className={`p-2 rounded-lg border-2 text-sm font-bold transition-all ${
                        bloodType === bt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {formatBloodType(bt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organs */}
              {(donorType === DonorType.organ ||
                donorType === DonorType.both) && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Organs Willing to Donate *
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_ORGANS.map((o) => (
                      <div key={o} className="flex items-center space-x-2">
                        <Checkbox
                          id={`organ-${o}`}
                          checked={organs.includes(o)}
                          onCheckedChange={() => toggleOrgan(o)}
                          data-ocid={`register.organ_${o}.checkbox`}
                        />
                        <Label
                          htmlFor={`organ-${o}`}
                          className="cursor-pointer"
                        >
                          {formatOrgan(o)}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {organs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {organs.map((o) => (
                        <Badge key={o} variant="secondary" className="text-xs">
                          {formatOrgan(o)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Medical Acknowledgment */}
              <div className="rounded-xl bg-accent p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-1">
                      Medical History Declaration
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      I confirm that I am in good general health, I do not have
                      any infectious diseases, I am not currently on medication
                      that would prevent donation, and I understand that all
                      donations are subject to medical screening before use.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medicalAck"
                        checked={medicalAck}
                        onCheckedChange={(v) => setMedicalAck(!!v)}
                        data-ocid="register.medical_ack.checkbox"
                      />
                      <Label
                        htmlFor="medicalAck"
                        className="text-sm cursor-pointer font-medium"
                      >
                        I acknowledge the above medical history declaration *
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={registerDonor.isPending}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base"
                data-ocid="register.submit_button"
              >
                {registerDonor.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
