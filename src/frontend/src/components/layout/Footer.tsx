import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <Zap size={18} color="white" fill="white" />
              </div>
              <span
                className="font-heading font-extrabold text-2xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                <span style={{ color: "#FFD700" }}>Quick</span>
                <span style={{ color: "#ff8c42" }}>Repair</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              30-minute electrical service at your doorstep in Mahipalpur,
              Delhi.
            </p>
            <div className="mt-4 text-xs text-white/40">
              <p>Mahipalpur Extension</p>
              <p>New Delhi - 110037</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("hero")}
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("services")}
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <Link
                  to="/book"
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors no-underline"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link
                  to="/mechanic-register"
                  className="text-sm text-brand-orange hover:text-brand-yellow transition-colors no-underline"
                >
                  Are you an electrician? Join us →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-orange shrink-0" />
                <a
                  href="tel:+918004774839"
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors no-underline"
                >
                  +91 8004774839
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-orange shrink-0" />
                <a
                  href="mailto:quickrepairhelp@gmail.com"
                  className="text-sm text-white/75 hover:text-brand-yellow transition-colors no-underline break-all"
                >
                  quickrepairhelp@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  size={14}
                  className="text-brand-orange shrink-0 mt-0.5"
                />
                <span className="text-sm text-white/75">
                  8 AM – 8 PM, All 7 Days
                </span>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
              Service Areas
            </h4>
            <ul className="space-y-1.5">
              {[
                "Mahipalpur Extension",
                "Mahipalpur Village",
                "Aerocity",
                "Vasant Kunj",
                "Rangpuri",
                "Nagal Dewat",
              ].map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                  <span className="text-sm text-white/70">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} QuickRepair Mahipalpur. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 hover:text-white/50 transition-colors no-underline flex items-center gap-1"
          >
            Built with{" "}
            <Heart
              size={10}
              className="text-brand-orange mx-0.5"
              fill="#ff8c42"
            />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
