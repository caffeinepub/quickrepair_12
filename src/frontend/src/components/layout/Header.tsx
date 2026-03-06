import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      });
    }
  };

  return (
    <header
      className="sticky-header"
      style={{
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.12)"
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Zap size={18} color="white" fill="white" />
            </div>
            <span
              className="font-heading font-extrabold text-2xl leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span style={{ color: "#FFD700" }}>Quick</span>
              <span style={{ color: "#ff8c42" }}>Repair</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              data-ocid="nav.home_link"
              onClick={() => scrollToSection("hero")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-colors rounded-lg hover:bg-orange-50"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.services_link"
              onClick={() => scrollToSection("services")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-colors rounded-lg hover:bg-orange-50"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-colors rounded-lg hover:bg-orange-50"
            >
              About
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollToSection("contact")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-colors rounded-lg hover:bg-orange-50"
            >
              Contact
            </button>
            <Link to="/book">
              <button
                type="button"
                data-ocid="nav.book_button"
                className="btn-orange ml-3 text-sm"
                style={{ padding: "10px 22px" }}
              >
                Book Now
              </button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <button
              type="button"
              data-ocid="nav.home_link"
              onClick={() => scrollToSection("hero")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.services_link"
              onClick={() => scrollToSection("services")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-lg transition-colors"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollToSection("contact")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-lg transition-colors"
            >
              Contact
            </button>
            <div className="px-4 pt-2">
              <Link to="/book" onClick={() => setMenuOpen(false)}>
                <button
                  type="button"
                  data-ocid="nav.book_button"
                  className="btn-orange w-full text-sm"
                  style={{ padding: "10px 22px" }}
                >
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
