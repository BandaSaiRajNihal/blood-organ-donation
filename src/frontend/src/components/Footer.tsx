import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-lg mb-3">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              LifeGive
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting donors with those who need life-saving blood and
              organs. Every donation counts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/donors"
                  className="hover:text-primary transition-colors"
                >
                  Donor Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/locations"
                  className="hover:text-primary transition-colors"
                >
                  Find Centers
                </Link>
              </li>
              <li>
                <Link
                  to="/register-donor"
                  className="hover:text-primary transition-colors"
                >
                  Register as Donor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  About Blood Donation
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Organ Donation FAQ
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Eligibility Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-default">
                  Emergency Contacts
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1-800-LIFEGIVE</li>
              <li>info@lifegive.org</li>
              <li>24/7 Emergency Line</li>
              <li>1-800-555-0199</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
