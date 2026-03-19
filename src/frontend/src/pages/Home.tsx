import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Droplets,
  Heart,
  Hospital,
  MapPin,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useStats } from "../hooks/useQueries";

function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: { label: string; value: string; icon: any; isLoading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl shadow-card p-5 flex flex-col items-center gap-2 min-w-[160px]"
    >
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <p className="text-2xl font-heading font-bold text-foreground">
          {value}
        </p>
      )}
      <p className="text-xs text-muted-foreground text-center">{label}</p>
    </motion.div>
  );
}

const STEPS = [
  {
    n: 1,
    title: "Register",
    desc: "Sign up and fill out your donor profile with your health details.",
  },
  {
    n: 2,
    title: "Get Matched",
    desc: "We connect you with hospitals and patients who need your help.",
  },
  {
    n: 3,
    title: "Donate",
    desc: "Visit a nearby center and complete your life-saving donation.",
  },
  {
    n: 4,
    title: "Save Lives",
    desc: "Your donation can save up to 3 lives. Track your impact.",
  },
];

const BLOOD_FACTS = [
  "Safe and takes only 10 minutes",
  "You can donate every 56 days",
  "Helps accident victims, cancer patients, and surgery patients",
];

const ORGAN_FACTS = [
  "Register takes less than 2 minutes",
  "Organs that can be donated: kidney, liver, heart, lungs",
  "Corneas and tissue donations restore vision and mobility",
];

export default function Home() {
  const { data: stats, isLoading } = useStats();

  const statsData = [
    {
      label: "Registered Donors",
      value: stats ? Number(stats.totalDonors).toLocaleString() : "0",
      icon: Users,
    },
    {
      label: "Blood Units Collected",
      value: stats ? Number(stats.totalBloodUnits).toLocaleString() : "0",
      icon: Droplets,
    },
    {
      label: "Lives Saved",
      value: stats ? Number(stats.totalLivesSaved).toLocaleString() : "0",
      icon: Heart,
    },
    { label: "Partner Hospitals", value: "42", icon: Hospital },
  ];

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-donation.dim_1600x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading font-bold text-white text-5xl md:text-6xl leading-tight mb-4">
              Give the Gift of Life
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Join thousands of donors who are saving lives every day. Register
              as a blood or organ donor and make a lasting impact in your
              community.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                  data-ocid="hero.register.primary_button"
                >
                  Become a Donor
                </Button>
              </Link>
              <Link to="/locations">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white/10 px-8"
                  data-ocid="hero.find_center.secondary_button"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Find a Center
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute -bottom-20 left-0 right-0 z-10">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {statsData.map((s) => (
                <StatCard key={s.label} {...s} isLoading={isLoading} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-28" />

      {/* How It Works */}
      <section
        className="container max-w-7xl mx-auto px-4 py-16"
        id="how-it-works"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to become a life-saving donor and make a
            difference.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl shadow-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold font-heading mx-auto mb-4">
                {step.n}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info Sections */}
      <section className="bg-card border-y border-border py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Blood Donation
              </span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">
                Why Blood Donation Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every two seconds, someone in the world needs blood. A single
                donation can save up to three lives. Blood cannot be
                manufactured — it can only come from generous donors like you.
              </p>
              <ul className="space-y-2">
                {BLOOD_FACTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/locations"
                className="mt-6 inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline"
              >
                Find a blood bank <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Organ Donation
              </span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">
                The Impact of Organ Donation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                More than 100,000 people are on the organ transplant waitlist at
                any given time. One organ donor can save up to 8 lives and
                enhance up to 75 more through tissue donation.
              </p>
              <ul className="space-y-2">
                {ORGAN_FACTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register-donor"
                className="mt-6 inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline"
              >
                Register as an organ donor <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-primary text-primary-foreground text-center p-12"
        >
          <h2 className="font-heading font-bold text-3xl mb-3">
            Ready to Save a Life?
          </h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto mb-6">
            Join our community of donors. It takes less than 5 minutes to
            register and could mean everything to someone in need.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90 px-10 font-semibold"
              data-ocid="cta.register.primary_button"
            >
              Get Started Today
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
