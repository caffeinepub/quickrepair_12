import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Cog,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  ThermometerSun,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const SERVICES = [
  {
    icon: Wrench,
    name: "Basic Electrician",
    price: "₹299",
    description:
      "House wiring, switchboard repair, MCB fix, fan regulator repair, socket/switch installation.",
    color: "#ff8c42",
  },
  {
    icon: Zap,
    name: "Electrical Appliances",
    price: "₹349",
    description:
      "Geyser wiring, inverter connection, stabilizer repair, exhaust fan fitting, water pump wiring.",
    color: "#FFD700",
  },
  {
    icon: Settings,
    name: "Electrical Maintenance",
    price: "₹399",
    description:
      "Periodic electrical checkup, voltage stabilization, old wiring upgrade, meter box repair.",
    color: "#ff8c42",
  },
  {
    icon: ThermometerSun,
    name: "AC & Cooling Services",
    price: "₹499",
    description:
      "AC wiring, dedicated power supply connection, stabilizer setup, voltage check, split AC installation support.",
    color: "#FFD700",
  },
  {
    icon: Cog,
    name: "Electrical Mechanic",
    price: "₹299",
    description:
      "Motor rewinding, generator repair, power tools fixing, industrial wiring, panel board repair.",
    color: "#ff8c42",
  },
];

const FAQ_ITEMS = [
  {
    q: "How fast will the electrician arrive?",
    a: "Our electricians typically arrive within 30 minutes of booking confirmation.",
  },
  {
    q: "Which areas do you serve?",
    a: "We serve Mahipalpur Extension, Mahipalpur Village, Aerocity, Vasant Kunj, Rangpuri, and Nagal Dewat.",
  },
  {
    q: "What are your service charges?",
    a: "Our charges start from ₹299 for Basic Electrician services, up to ₹499 for AC & Cooling Services. No hidden fees.",
  },
  {
    q: "What are your working hours?",
    a: "We are available 7 days a week, from 8 AM to 8 PM.",
  },
  {
    q: "Is it safe to book online?",
    a: "Yes, your data is secure. We use FormSubmit for encrypted form submissions.",
  },
  {
    q: "Do I need to be home during the service?",
    a: "Yes, an adult must be present at the service location during the visit.",
  },
];

const SERVICE_AREAS = [
  "Mahipalpur Extension",
  "Mahipalpur Village",
  "Aerocity",
  "Vasant Kunj",
  "Rangpuri",
  "Nagal Dewat",
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("card-hidden");
            el.classList.add("card-visible");
          }, index * 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      data-ocid={`services.card.${index + 1}`}
      className="card-hidden service-card bg-white rounded-2xl p-6 border border-gray-200 flex flex-col gap-4"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${service.color}18` }}
        >
          <Icon size={22} style={{ color: service.color }} />
        </div>
        <span
          className="font-heading font-bold text-xl"
          style={{ color: "#ff8c42" }}
        >
          {service.price}
        </span>
      </div>

      <div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="mt-auto">
        <Link to="/book" search={{ service: service.name }}>
          <button
            type="button"
            data-ocid={`services.book_button.${index + 1}`}
            className="btn-orange w-full text-sm"
            style={{ padding: "10px 20px" }}
          >
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div
      className="page-enter min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section
          id="hero"
          className="hero-mesh relative overflow-hidden"
          style={{ minHeight: "88vh" }}
        >
          {/* ── Storm Electric Background Elements ── */}

          {/* Electric grid overlay - blue tint */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,160,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 1,
            }}
          />

          {/* Lightning bolt SVGs */}
          <div
            className="hero-bolt absolute pointer-events-none select-none"
            style={{
              top: "8%",
              left: "5%",
              animationDelay: "0s",
              color: "#4a9eff",
              opacity: 0.09,
              transform: "rotate(-15deg)",
            }}
          >
            <Zap size={160} strokeWidth={1.5} />
          </div>
          <div
            className="hero-bolt absolute pointer-events-none select-none"
            style={{
              top: "15%",
              right: "7%",
              animationDelay: "2.5s",
              color: "#FFD700",
              opacity: 0.07,
              transform: "rotate(20deg)",
            }}
          >
            <Zap size={120} strokeWidth={1.5} />
          </div>
          <div
            className="hero-bolt absolute pointer-events-none select-none"
            style={{
              bottom: "20%",
              left: "8%",
              animationDelay: "4s",
              color: "#4a9eff",
              opacity: 0.06,
              transform: "rotate(10deg)",
            }}
          >
            <Zap size={200} strokeWidth={1.2} />
          </div>
          <div
            className="hero-bolt absolute pointer-events-none select-none"
            style={{
              bottom: "25%",
              right: "5%",
              animationDelay: "1.5s",
              color: "#FFD700",
              opacity: 0.08,
              transform: "rotate(-25deg)",
            }}
          >
            <Zap size={90} strokeWidth={1.8} />
          </div>

          {/* Electric arc lines */}
          <div
            className="hero-arc absolute pointer-events-none"
            style={
              {
                top: "22%",
                left: "18%",
                width: "2px",
                height: "140px",
                background:
                  "linear-gradient(transparent, rgba(100,160,255,0.65), transparent)",
                "--arc-rotation": "35deg",
              } as React.CSSProperties
            }
          />
          <div
            className="hero-arc absolute pointer-events-none"
            style={
              {
                top: "35%",
                right: "20%",
                width: "1px",
                height: "110px",
                background:
                  "linear-gradient(transparent, rgba(100,200,255,0.5), transparent)",
                "--arc-rotation": "-48deg",
                animationDelay: "0.8s",
              } as React.CSSProperties
            }
          />
          <div
            className="hero-arc absolute pointer-events-none"
            style={
              {
                bottom: "30%",
                left: "30%",
                width: "1px",
                height: "90px",
                background:
                  "linear-gradient(transparent, rgba(74,158,255,0.6), transparent)",
                "--arc-rotation": "22deg",
                animationDelay: "1.4s",
              } as React.CSSProperties
            }
          />
          <div
            className="hero-arc absolute pointer-events-none"
            style={
              {
                top: "60%",
                right: "35%",
                width: "2px",
                height: "160px",
                background:
                  "linear-gradient(transparent, rgba(160,100,255,0.45), transparent)",
                "--arc-rotation": "-30deg",
                animationDelay: "0.3s",
              } as React.CSSProperties
            }
          />

          {/* Spark dots */}
          {[
            {
              top: "12%",
              left: "25%",
              size: 5,
              color: "rgba(100,200,255,0.55)",
              delay: "0s",
            },
            {
              top: "28%",
              left: "12%",
              size: 4,
              color: "rgba(255,215,0,0.45)",
              delay: "0.3s",
            },
            {
              top: "45%",
              left: "40%",
              size: 6,
              color: "rgba(100,200,255,0.5)",
              delay: "0.6s",
            },
            {
              top: "18%",
              right: "30%",
              size: 4,
              color: "rgba(255,140,66,0.45)",
              delay: "0.9s",
            },
            {
              top: "65%",
              left: "20%",
              size: 5,
              color: "rgba(100,200,255,0.4)",
              delay: "1.2s",
            },
            {
              top: "72%",
              right: "25%",
              size: 7,
              color: "rgba(255,215,0,0.5)",
              delay: "0.15s",
            },
            {
              top: "38%",
              right: "12%",
              size: 4,
              color: "rgba(100,200,255,0.55)",
              delay: "0.45s",
            },
            {
              top: "55%",
              left: "55%",
              size: 5,
              color: "rgba(255,140,66,0.4)",
              delay: "0.75s",
            },
            {
              top: "82%",
              left: "45%",
              size: 4,
              color: "rgba(100,200,255,0.45)",
              delay: "1.05s",
            },
            {
              top: "8%",
              right: "45%",
              size: 6,
              color: "rgba(255,215,0,0.4)",
              delay: "1.35s",
            },
          ].map((spark) => (
            <div
              key={`${spark.top}-${spark.delay}`}
              className="hero-spark absolute pointer-events-none rounded-full"
              style={{
                top: spark.top,
                left: "left" in spark ? spark.left : undefined,
                right: "right" in spark ? spark.right : undefined,
                width: spark.size,
                height: spark.size,
                background: spark.color,
                animationDelay: spark.delay,
                boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
              }}
            />
          ))}

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-24 md:py-32">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
              style={{
                background: "rgba(0,212,170,0.15)",
                border: "1px solid rgba(0,212,170,0.4)",
                color: "#00d4aa",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block"
                style={{ background: "#00d4aa" }}
              />
              Available Now · Mahipalpur, Delhi
            </div>

            <h1
              className="hero-brand-pulse font-heading font-extrabold text-white mb-4"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              🔧 <span style={{ color: "#FFD700" }}>Quick</span>
              <span style={{ color: "#ff8c42" }}>Repair</span>
              <br />
              <span className="text-white/90" style={{ fontSize: "0.8em" }}>
                Mahipalpur
              </span>
            </h1>

            <p
              className="font-heading font-semibold mb-6"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                color: "#ff8c42",
              }}
            >
              30 Minute Electrical Service at Your Doorstep
            </p>

            <span className="hours-badge mb-8">7 Days | 8 AM – 8 PM</span>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link to="/book">
                <button
                  type="button"
                  data-ocid="hero.book_button"
                  className="btn-orange text-base"
                  style={{ padding: "16px 36px", fontSize: "1.05rem" }}
                >
                  📅 Book Online Now
                </button>
              </Link>
              <a
                href="tel:+918004774839"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium no-underline px-6 py-3 rounded-lg border border-white/20 hover:border-white/40"
              >
                <Phone size={16} />
                +91 8004774839
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-12">
              {[
                { value: "30 Min", label: "Response Time", color: "#00d4aa" },
                { value: "6+", label: "Service Areas", color: "#FFD700" },
                { value: "₹299", label: "Starting Price", color: "#ff8c42" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-heading font-extrabold text-2xl sm:text-3xl"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs sm:text-sm mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ display: "block" }}
              role="presentation"
              aria-hidden="true"
            >
              <path
                d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
                fill="#F8F9FA"
              />
            </svg>
          </div>
        </section>

        {/* ── Services ── */}
        <section
          id="services"
          className="py-16 md:py-20"
          style={{ backgroundColor: "#F8F9FA" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
                style={{
                  color: "#ff8c42",
                  background: "rgba(255,140,66,0.1)",
                  border: "1px solid rgba(255,140,66,0.2)",
                }}
              >
                What We Offer
              </span>
              <h2
                className="font-heading font-extrabold text-foreground"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Our Services
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
                Fast, reliable, and affordable electrical solutions — certified
                electricians at your door in 30 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((service, i) => (
                <ServiceCard key={service.name} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section
          id="about"
          className="py-16 md:py-20"
          style={{ backgroundColor: "#1a1a2e" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
                  style={{
                    color: "#FFD700",
                    background: "rgba(255,215,0,0.12)",
                    border: "1px solid rgba(255,215,0,0.25)",
                  }}
                >
                  About Us
                </span>
                <h2
                  className="font-heading font-extrabold text-white mb-5"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  About <span style={{ color: "#FFD700" }}>Quick</span>
                  <span style={{ color: "#ff8c42" }}>Repair</span>
                </h2>
                <p className="text-white/70 mb-4 leading-relaxed">
                  QuickRepair is Mahipalpur's most trusted electrical service
                  provider. We specialize in fast, reliable, and affordable
                  electrical solutions delivered right to your doorstep — in 30
                  minutes or less.
                </p>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Founded with a mission to eliminate the long wait times and
                  high costs of traditional electrical services, QuickRepair
                  brings certified electricians to your home within minutes of
                  booking.
                </p>
                <p className="text-white/50 text-sm">
                  Serving Mahipalpur Extension, Mahipalpur Village, Aerocity,
                  Vasant Kunj, Rangpuri, and Nagal Dewat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Zap,
                    label: "30-Min Response",
                    sub: "Guaranteed arrival",
                  },
                  {
                    icon: Shield,
                    label: "Certified Electricians",
                    sub: "Trained & verified",
                  },
                  {
                    icon: DollarSign,
                    label: "Transparent Pricing",
                    sub: "No hidden fees",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="highlight-box">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(255,140,66,0.2)" }}
                    >
                      <Icon size={20} style={{ color: "#ff8c42" }} />
                    </div>
                    <p className="font-heading font-bold text-white text-sm">
                      {label}
                    </p>
                    <p className="text-white/50 text-xs mt-1">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Divider ── */}
        <div className="section-divider" />

        {/* ── FAQ ── */}
        <section
          id="faq"
          className="py-16 md:py-20 faq-section"
          style={{ backgroundColor: "#F8F9FA" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
                style={{
                  color: "#ff8c42",
                  background: "rgba(255,140,66,0.1)",
                  border: "1px solid rgba(255,140,66,0.2)",
                }}
              >
                FAQ
              </span>
              <h2
                className="font-heading font-extrabold text-foreground"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${i}`}
                    data-ocid={`faq.item.${i + 1}`}
                    className="px-6 border-gray-100"
                  >
                    <AccordionTrigger className="font-heading font-semibold text-sm hover:no-underline hover:text-brand-orange py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="py-16 md:py-20"
          style={{ backgroundColor: "white" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
                style={{
                  color: "#ff8c42",
                  background: "rgba(255,140,66,0.1)",
                  border: "1px solid rgba(255,140,66,0.2)",
                }}
              >
                Reach Us
              </span>
              <h2
                className="font-heading font-extrabold text-foreground"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Contact Us
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div
                className="rounded-2xl p-8 border border-gray-200"
                style={{ background: "#F8F9FA" }}
              >
                <h3 className="font-heading font-bold text-xl mb-6 text-foreground">
                  Get in Touch
                </h3>

                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(255,140,66,0.12)" }}
                    >
                      <Phone size={18} style={{ color: "#ff8c42" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                        Phone
                      </p>
                      <a
                        href="tel:+918004774839"
                        data-ocid="contact.phone_link"
                        className="font-heading font-bold text-lg text-foreground hover:text-brand-orange transition-colors no-underline"
                      >
                        +91 8004774839
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(255,140,66,0.12)" }}
                    >
                      <Mail size={18} style={{ color: "#ff8c42" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                        Email
                      </p>
                      <a
                        href="mailto:pandeyxkanha@gmail.com"
                        data-ocid="contact.email_link"
                        className="font-medium text-foreground hover:text-brand-orange transition-colors no-underline break-all"
                      >
                        pandeyxkanha@gmail.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(0,212,170,0.12)" }}
                    >
                      <Mail size={18} style={{ color: "#00d4aa" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                        Support Email
                      </p>
                      <a
                        href="mailto:quickrepairhelp@gmail.com"
                        data-ocid="contact.support_email_link"
                        className="font-medium text-foreground hover:text-brand-orange transition-colors no-underline break-all"
                      >
                        quickrepairhelp@gmail.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(255,140,66,0.12)" }}
                    >
                      <Clock size={18} style={{ color: "#ff8c42" }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                        Hours
                      </p>
                      <p className="font-heading font-bold text-foreground">
                        8 AM to 8 PM, All 7 Days
                      </p>
                    </div>
                  </li>
                </ul>

                <Link to="/book" className="block mt-8">
                  <button type="button" className="btn-orange w-full">
                    Book a Service Now
                  </button>
                </Link>
              </div>

              {/* Service Areas */}
              <div className="rounded-2xl p-8 border border-gray-200 bg-white">
                <h3 className="font-heading font-bold text-xl mb-6 text-foreground">
                  Service Areas
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  We currently serve the following locations in Delhi:
                </p>
                <ul className="space-y-3">
                  {SERVICE_AREAS.map((area) => (
                    <li key={area} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,140,66,0.1)" }}
                      >
                        <MapPin size={14} style={{ color: "#ff8c42" }} />
                      </div>
                      <span className="font-medium text-sm text-foreground">
                        {area}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-6 rounded-xl p-4 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(255,140,66,0.08) 100%)",
                    border: "1px solid rgba(255,140,66,0.2)",
                  }}
                >
                  <p className="text-sm font-medium text-foreground">
                    Don't see your area?{" "}
                    <a
                      href="tel:+918004774839"
                      className="text-brand-orange font-semibold no-underline hover:underline"
                    >
                      Call us
                    </a>{" "}
                    and we'll check availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
