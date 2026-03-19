import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodType, Gender } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile } from "../hooks/useQueries";
import { formatBloodType } from "../lib/helpers";

export default function Auth() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const saveProfile = useSaveUserProfile();
  const isAuthenticated = !!identity;

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    bloodType: "" as BloodType | "",
    gender: "" as Gender | "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Logged in successfully!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      try {
        await login();
      } catch {
        toast.error("Authentication failed.");
        return;
      }
    }
    if (
      !form.name ||
      !form.email ||
      !form.age ||
      !form.bloodType ||
      !form.gender
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: form.name,
        email: form.email,
        age: BigInt(Number.parseInt(form.age)),
        phone: form.phone,
        address: form.address,
        bloodType: form.bloodType as BloodType,
        gender: form.gender as Gender,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
      });
      toast.success("Profile created! Welcome to LifeGive.");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-4">
            <Heart className="w-7 h-7 text-primary fill-primary" />
          </div>
          <h1 className="font-heading font-bold text-2xl">
            Welcome to LifeGive
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in or create an account to start saving lives
          </p>
        </div>

        <Tabs defaultValue="signin" data-ocid="auth.tab">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" data-ocid="auth.signin.tab">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" data-ocid="auth.signup.tab">
              Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Use Internet Identity to securely sign in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleLogin}
                  disabled={loginStatus === "logging-in"}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="auth.signin.submit_button"
                >
                  {loginStatus === "logging-in" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In with Internet Identity"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure, privacy-preserving authentication powered by the
                  Internet Computer.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Register and set up your donor profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                        data-ocid="auth.name.input"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        required
                        data-ocid="auth.email.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="30"
                        min="18"
                        max="70"
                        value={form.age}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, age: e.target.value }))
                        }
                        required
                        data-ocid="auth.age.input"
                      />
                    </div>
                    <div>
                      <Label>Gender *</Label>
                      <Select
                        value={form.gender}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, gender: v as Gender }))
                        }
                      >
                        <SelectTrigger data-ocid="auth.gender.select">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.male}>Male</SelectItem>
                          <SelectItem value={Gender.female}>Female</SelectItem>
                          <SelectItem value={Gender.other}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Blood Type *</Label>
                      <Select
                        value={form.bloodType}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, bloodType: v as BloodType }))
                        }
                      >
                        <SelectTrigger data-ocid="auth.blood_type.select">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BloodType).map((bt) => (
                            <SelectItem key={bt} value={bt}>
                              {formatBloodType(bt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 555-0100"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        data-ocid="auth.phone.input"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St, City"
                        value={form.address}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, address: e.target.value }))
                        }
                        data-ocid="auth.address.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ecName">Emergency Contact</Label>
                      <Input
                        id="ecName"
                        placeholder="Contact name"
                        value={form.emergencyContactName}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            emergencyContactName: e.target.value,
                          }))
                        }
                        data-ocid="auth.emergency_name.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ecPhone">Emergency Phone</Label>
                      <Input
                        id="ecPhone"
                        placeholder="+1 555-0199"
                        value={form.emergencyContactPhone}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            emergencyContactPhone: e.target.value,
                          }))
                        }
                        data-ocid="auth.emergency_phone.input"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      saveProfile.isPending || loginStatus === "logging-in"
                    }
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="auth.signup.submit_button"
                  >
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account & Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
