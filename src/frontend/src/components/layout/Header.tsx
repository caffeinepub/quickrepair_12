import { Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, LogIn, LogOut, Menu, User, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  // Get a short display name from principal
  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 10)}…`
    : "";

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
            <div className="w-8 h-8 bg-brand-orange rounded-2xl flex items-center justify-center">
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
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-all duration-200 rounded-xl hover:bg-orange-50 active:scale-95"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.services_link"
              onClick={() => scrollToSection("services")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-all duration-200 rounded-xl hover:bg-orange-50 active:scale-95"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-all duration-200 rounded-xl hover:bg-orange-50 active:scale-95"
            >
              About
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollToSection("contact")}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-brand-orange transition-all duration-200 rounded-xl hover:bg-orange-50 active:scale-95"
            >
              Contact
            </button>
            <Link to="/mechanic-register">
              <button
                type="button"
                data-ocid="nav.mechanic_link"
                className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-orange-50 active:scale-95"
                style={{ color: "#ff8c42" }}
                onClick={() => setMenuOpen(false)}
              >
                Join as Mechanic
              </button>
            </Link>
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

            {/* Auth controls */}
            {isInitializing ? null : isLoggedIn ? (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground"
                  title={identity?.getPrincipal().toString()}
                >
                  <User size={14} style={{ color: "#ff8c42" }} />
                  <span className="max-w-[90px] truncate">
                    {principalShort}
                  </span>
                </div>
                <Link to="/history" data-ocid="auth.mybookings_link">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95"
                    style={{ color: "#ff8c42" }}
                  >
                    <ClipboardList size={14} />
                    My Bookings
                  </button>
                </Link>
                <button
                  type="button"
                  data-ocid="auth.signout_button"
                  onClick={clear}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl hover:bg-red-50 text-red-500 transition-all duration-200 active:scale-95"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-ocid="auth.signin_button"
                onClick={login}
                disabled={isLoggingIn}
                className="flex items-center gap-1.5 ml-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 active:scale-95"
                style={{
                  borderColor: "#ff8c42",
                  color: "#ff8c42",
                  background: "transparent",
                }}
              >
                <LogIn size={15} />
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </button>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
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
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-xl transition-all duration-200 active:scale-95"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.services_link"
              onClick={() => scrollToSection("services")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-xl transition-all duration-200 active:scale-95"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-xl transition-all duration-200 active:scale-95"
            >
              About
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollToSection("contact")}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-xl transition-all duration-200 active:scale-95"
            >
              Contact
            </button>
            <Link to="/mechanic-register" onClick={() => setMenuOpen(false)}>
              <button
                type="button"
                data-ocid="nav.mechanic_link"
                className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 rounded-xl transition-all duration-200 active:scale-95"
                style={{ color: "#ff8c42" }}
              >
                Join as Mechanic
              </button>
            </Link>
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

            {/* Mobile Auth */}
            {!isInitializing && (
              <div className="px-4 pt-1 border-t border-gray-100 mt-2 space-y-1">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                      <User size={13} style={{ color: "#ff8c42" }} />
                      <span className="truncate">{principalShort}</span>
                    </div>
                    <Link
                      to="/history"
                      onClick={() => setMenuOpen(false)}
                      data-ocid="auth.mybookings_link"
                    >
                      <button
                        type="button"
                        className="w-full text-left flex items-center gap-2 px-2 py-2.5 text-sm font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95"
                        style={{ color: "#ff8c42" }}
                      >
                        <ClipboardList size={15} />
                        My Bookings
                      </button>
                    </Link>
                    <button
                      type="button"
                      data-ocid="auth.signout_button"
                      onClick={() => {
                        clear();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-2 py-2.5 text-sm font-semibold rounded-xl hover:bg-red-50 text-red-500 transition-all duration-200 active:scale-95"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    data-ocid="auth.signin_button"
                    onClick={() => {
                      login();
                      setMenuOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 active:scale-95"
                    style={{ borderColor: "#ff8c42", color: "#ff8c42" }}
                  >
                    <LogIn size={15} />
                    {isLoggingIn ? "Signing in…" : "Sign In"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
