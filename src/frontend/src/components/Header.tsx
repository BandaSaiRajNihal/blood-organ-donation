import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Heart, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
      router.navigate({ to: "/" });
    } else {
      router.navigate({ to: "/auth" });
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/locations", label: "Locations" },
    { to: "/donors", label: "Donor Directory" },
    ...(isAuthenticated ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading font-bold text-xl text-foreground"
        >
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span>LifeGive</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-primary font-semibold" }}
              data-ocid={`nav.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && (
            <Link to="/register-donor">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-accent"
                data-ocid="nav.register_donor.button"
              >
                Become a Donor
              </Button>
            </Link>
          )}
          <Button
            onClick={handleAuth}
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5"
            disabled={loginStatus === "logging-in"}
            data-ocid="nav.auth.button"
          >
            {loginStatus === "logging-in" ? (
              "..."
            ) : isAuthenticated ? (
              <>
                <User className="w-4 h-4 mr-1" />
                Logout
              </>
            ) : (
              "Login / Register"
            )}
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            onClick={() => {
              handleAuth();
              setMobileOpen(false);
            }}
            size="sm"
            className="rounded-full bg-primary text-primary-foreground mt-2"
            data-ocid="nav.mobile.auth.button"
          >
            {isAuthenticated ? "Logout" : "Login / Register"}
          </Button>
        </div>
      )}
    </header>
  );
}
