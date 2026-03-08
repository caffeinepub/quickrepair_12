import { useSearch } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Lock,
  LogIn,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function playSuccessSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Compressor for loudness boost without clipping
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -6;
    compressor.knee.value = 3;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.001;
    compressor.release.value = 0.1;
    compressor.connect(ctx.destination);

    const masterGain = ctx.createGain();
    masterGain.connect(compressor);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.005);

    // Note 1: D5 (587Hz) — punchy attack
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.type = "sine";
    osc1.frequency.value = 587;
    gain1.gain.setValueAtTime(1.0, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);

    // Note 1 overtone for body
    const osc1b = ctx.createOscillator();
    const gain1b = ctx.createGain();
    osc1b.connect(gain1b);
    gain1b.connect(masterGain);
    osc1b.type = "triangle";
    osc1b.frequency.value = 587 * 2;
    gain1b.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1b.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1b.start(ctx.currentTime);
    osc1b.stop(ctx.currentTime + 0.18);

    // Note 2: F#5 (740Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.type = "sine";
    osc2.frequency.value = 740;
    gain2.gain.setValueAtTime(1.0, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
    osc2.start(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.38);

    const osc2b = ctx.createOscillator();
    const gain2b = ctx.createGain();
    osc2b.connect(gain2b);
    gain2b.connect(masterGain);
    osc2b.type = "triangle";
    osc2b.frequency.value = 740 * 2;
    gain2b.gain.setValueAtTime(0.35, ctx.currentTime + 0.16);
    gain2b.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);
    osc2b.start(ctx.currentTime + 0.16);
    osc2b.stop(ctx.currentTime + 0.36);

    // Note 3: A5 (880Hz) — loudest, long sustain
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.type = "sine";
    osc3.frequency.value = 880;
    gain3.gain.setValueAtTime(1.0, ctx.currentTime + 0.32);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
    osc3.start(ctx.currentTime + 0.32);
    osc3.stop(ctx.currentTime + 1.1);

    const osc3b = ctx.createOscillator();
    const gain3b = ctx.createGain();
    osc3b.connect(gain3b);
    gain3b.connect(masterGain);
    osc3b.type = "triangle";
    osc3b.frequency.value = 880 * 2;
    gain3b.gain.setValueAtTime(0.4, ctx.currentTime + 0.32);
    gain3b.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
    osc3b.start(ctx.currentTime + 0.32);
    osc3b.stop(ctx.currentTime + 0.85);

    // High shimmer
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.connect(gain4);
    gain4.connect(masterGain);
    osc4.type = "sine";
    osc4.frequency.value = 1760;
    gain4.gain.setValueAtTime(0.45, ctx.currentTime + 0.32);
    gain4.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc4.start(ctx.currentTime + 0.32);
    osc4.stop(ctx.currentTime + 0.8);

    masterGain.gain.setValueAtTime(1.0, ctx.currentTime + 0.65);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  } catch {
    // Audio not supported
  }
}

// Map service card names to option values in the select
const SERVICE_VALUE_MAP: Record<string, string> = {
  "Basic Electrician": "Basic Electrician - ₹299",
  "Electrical Appliances": "Electrical Appliances - ₹349",
  "Electrical Maintenance": "Electrical Maintenance - ₹399",
  "AC & Cooling Services": "AC & Cooling Services - ₹499",
  "Electrical Mechanic": "Electrical Mechanic - ₹299",
};

// Trust badges shown below submit button
function TrustBadgesBottom() {
  return (
    <div
      className="mt-4 rounded-3xl border p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(34,197,94,0.04) 0%, rgba(16,185,129,0.06) 100%)",
        borderColor: "rgba(34,197,94,0.2)",
      }}
    >
      <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: "rgba(34,197,94,0.1)",
            color: "#16a34a",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <ShieldCheck size={13} />
          SAFE
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: "rgba(16,185,129,0.1)",
            color: "#059669",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <Lock size={13} />
          SECURE
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: "rgba(34,197,94,0.1)",
            color: "#15803d",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <BadgeCheck size={13} />
          TRUSTED
        </div>
      </div>
      <div
        className="flex items-center justify-center gap-2 text-xs font-medium"
        style={{ color: "#166534" }}
      >
        <Lock size={12} />
        <span>
          Your data is safe with us — we never share your personal information
        </span>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { service: serviceParam } = useSearch({ strict: false }) as {
    service?: string;
  };
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;

  const preSelectedValue = serviceParam
    ? SERVICE_VALUE_MAP[serviceParam]
    : undefined;

  useEffect(() => {
    document.title = "Book a Service | QuickRepair";
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default — we handle submission ourselves via fetch (AJAX)
    e.preventDefault();

    const form = e.currentTarget;

    // Collect data for backend save
    const data = {
      id: Date.now(),
      name:
        (form.querySelector('[name="Full Name"]') as HTMLInputElement)?.value ||
        "",
      phone:
        (form.querySelector('[name="Phone Number"]') as HTMLInputElement)
          ?.value || "",
      email:
        (form.querySelector('[name="Email Address"]') as HTMLInputElement)
          ?.value || "",
      service:
        (form.querySelector('[name="Service"]') as HTMLSelectElement)?.value ||
        preSelectedValue ||
        "",
      address:
        (form.querySelector('[name="Full Address"]') as HTMLTextAreaElement)
          ?.value || "",
      problem:
        (
          form.querySelector(
            '[name="Problem Description"]',
          ) as HTMLTextAreaElement
        )?.value || "",
      time:
        (form.querySelector('[name="Preferred Time"]') as HTMLSelectElement)
          ?.value || "",
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("qr_bookings") || "[]");
      existing.push(data);
      localStorage.setItem("qr_bookings", JSON.stringify(existing));
    } catch {
      // Storage unavailable
    }

    // Save to canister (fire and forget)
    if (actor) {
      actor.saveBooking(JSON.stringify(data)).catch(() => {
        // Canister save failed — localStorage backup already done
      });
    }

    // Send form data to FormSubmit via AJAX (no page redirect)
    try {
      const formData = new FormData(form);
      // Remove _next so FormSubmit doesn't redirect us
      formData.delete("_next");
      await fetch("https://formsubmit.co/ajax/pandeyxkanha@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
    } catch {
      // Email send failed — data already saved locally, don't block user
    }

    // Show tick + play sound — stays on page, no redirect
    setSubmitSuccess(true);
    playSuccessSound();
  };

  return (
    <div
      className="page-enter min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Auth Gate: show sign-in prompt if not logged in */}
          {!isInitializing && !isLoggedIn && (
            <div
              data-ocid="booking.auth_gate"
              className="rounded-[32px] border border-gray-200 bg-white p-8 md:p-12 text-center mb-8"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-5"
                style={{ background: "rgba(255,140,66,0.1)" }}
              >
                <LogIn size={30} style={{ color: "#ff8c42" }} />
              </div>
              <h2
                className="font-heading font-extrabold text-2xl md:text-3xl mb-3"
                style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
              >
                Sign In to Book a Service
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Please sign in to your account to book a service and track your
                booking history.
              </p>
              <button
                type="button"
                data-ocid="booking.signin_button"
                onClick={login}
                disabled={isLoggingIn}
                className="btn-orange inline-flex items-center gap-2"
                style={{ padding: "14px 32px", fontSize: "1rem" }}
              >
                <LogIn size={18} />
                {isLoggingIn ? "Signing in…" : "Sign In to Continue"}
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                New to QuickRepair? Sign up is included — it only takes a
                moment.
              </p>
            </div>
          )}

          {/* Initializing spinner */}
          {isInitializing && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Loading…
            </div>
          )}

          {/* Form content — only shown when logged in */}
          {isLoggedIn && (
            <>
              {/* Full-screen success overlay */}
              {submitSuccess && (
                <div
                  data-ocid="booking.success_state"
                  className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(0,0,0,0.72)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-[2rem] px-10 py-12 mx-4"
                    style={{
                      background: "rgba(255,255,255,0.97)",
                      boxShadow: "0 8px 48px rgba(0,0,0,0.18)",
                      minWidth: "280px",
                      maxWidth: "380px",
                      width: "100%",
                    }}
                  >
                    {/* Animated tick circle */}
                    <div
                      className="flex items-center justify-center rounded-full mb-5"
                      style={{
                        width: 96,
                        height: 96,
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        boxShadow: "0 0 0 12px rgba(34,197,94,0.15)",
                        animation:
                          "successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
                      }}
                    >
                      <CheckCircle2 size={52} color="white" strokeWidth={2.5} />
                    </div>
                    <p
                      className="font-extrabold text-2xl text-center mb-2"
                      style={{ color: "#15803d", letterSpacing: "-0.01em" }}
                    >
                      Booking Confirmed!
                    </p>
                    <p
                      className="text-sm text-center"
                      style={{ color: "#6b7280" }}
                    >
                      We will call you shortly to confirm your appointment.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-3xl mb-4"
                  style={{ background: "rgba(255,140,66,0.12)" }}
                >
                  <Zap size={28} style={{ color: "#ff8c42" }} />
                </div>
                <h1
                  className="font-heading font-extrabold text-3xl md:text-4xl text-foreground"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  Book Your Electrician
                </h1>
                <p className="text-muted-foreground mt-2">
                  Get a certified electrician at your doorstep in 30 minutes
                </p>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                  {[
                    { icon: Clock, text: "30-Min Arrival" },
                    { icon: Shield, text: "Certified Team" },
                    { icon: Zap, text: "No Hidden Fees" },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,140,66,0.1)",
                        color: "#ff8c42",
                        border: "1px solid rgba(255,140,66,0.2)",
                      }}
                    >
                      <Icon size={12} />
                      {text}
                    </span>
                  ))}
                </div>

                {/* Enhanced Trust Section */}
                <div
                  className="mt-5 rounded-3xl border p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.04) 0%, rgba(16,185,129,0.06) 100%)",
                    borderColor: "rgba(34,197,94,0.2)",
                  }}
                >
                  {/* 3 trust badges in a row */}
                  <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                    {/* SAFE */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "#16a34a",
                        border: "1px solid rgba(34,197,94,0.25)",
                      }}
                    >
                      <ShieldCheck size={13} />
                      SAFE
                    </div>
                    {/* SECURE */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        color: "#059669",
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}
                    >
                      <Lock size={13} />
                      SECURE
                    </div>
                    {/* TRUSTED */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "#15803d",
                        border: "1px solid rgba(34,197,94,0.25)",
                      }}
                    >
                      <BadgeCheck size={13} />
                      TRUSTED
                    </div>
                  </div>
                  {/* Data safe banner */}
                  <div
                    className="flex items-center justify-center gap-2 text-xs font-medium"
                    style={{ color: "#166534" }}
                  >
                    <Lock size={12} />
                    <span>
                      Your data is safe with us — we never share your personal
                      information
                    </span>
                  </div>
                </div>
              </div>

              {/* Pre-selected service notice */}
              {preSelectedValue && (
                <div
                  className="rounded-2xl px-4 py-3 mb-5 flex items-start gap-3"
                  style={{
                    background: "rgba(0,212,170,0.07)",
                    border: "1.5px solid rgba(0,212,170,0.3)",
                  }}
                >
                  <Lock
                    size={16}
                    style={{
                      color: "#00d4aa",
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#00a88a" }}
                    >
                      Service pre-selected:{" "}
                      <span style={{ color: "#ff8c42" }}>{serviceParam}</span>
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#00a88a", opacity: 0.85 }}
                    >
                      To select a different service, go back to the Services
                      page.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <div
                className="form-card-accent bg-white rounded-3xl border border-gray-200 p-6 md:p-8"
                style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}
              >
                <form className="space-y-5" onSubmit={handleBookingSubmit}>
                  {/* Hidden Fields */}
                  <input
                    type="hidden"
                    name="_subject"
                    value="New Booking - QuickRepair"
                  />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_honey"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Full Name */}
                  <div>
                    <label htmlFor="booking-name" className="form-label">
                      Full Name <span style={{ color: "#ff8c42" }}>*</span>
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      name="Full Name"
                      required
                      placeholder="Enter your full name"
                      data-ocid="booking.name_input"
                      className="form-input"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="booking-phone" className="form-label">
                      Phone Number <span style={{ color: "#ff8c42" }}>*</span>
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      name="Phone Number"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      pattern="[+]?[0-9\s\-]{10,15}"
                      data-ocid="booking.phone_input"
                      className="form-input"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="booking-email" className="form-label">
                      Email Address
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      name="Email Address"
                      placeholder="you@example.com"
                      data-ocid="booking.email_input"
                      className="form-input"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="booking-service" className="form-label">
                      Select Service <span style={{ color: "#ff8c42" }}>*</span>
                    </label>
                    {preSelectedValue ? (
                      <>
                        {/* Hidden actual field for form submission */}
                        <input
                          type="hidden"
                          name="Service"
                          value={preSelectedValue}
                        />
                        {/* Visual locked display */}
                        <div
                          className="form-input flex items-center justify-between rounded-2xl"
                          style={{
                            background: "rgba(0,212,170,0.04)",
                            borderColor: "rgba(0,212,170,0.35)",
                            cursor: "not-allowed",
                            opacity: 0.9,
                          }}
                        >
                          <span
                            className="font-medium"
                            style={{ color: "#1a1a2e" }}
                          >
                            {preSelectedValue}
                          </span>
                          <Lock
                            size={14}
                            style={{ color: "#00d4aa", flexShrink: 0 }}
                          />
                        </div>
                        {/* Hidden select for required validation fallback */}
                        <select
                          id="booking-service"
                          name="Service-display"
                          data-ocid="booking.service_select"
                          defaultValue={preSelectedValue}
                          disabled
                          style={{ display: "none" }}
                        >
                          <option value={preSelectedValue}>
                            {preSelectedValue}
                          </option>
                        </select>
                      </>
                    ) : (
                      <select
                        id="booking-service"
                        name="Service"
                        required
                        data-ocid="booking.service_select"
                        className="form-input"
                      >
                        <option value="">— Choose a service —</option>
                        <option value="Basic Electrician - ₹299">
                          Basic Electrician – ₹299
                        </option>
                        <option value="Electrical Appliances - ₹349">
                          Electrical Appliances – ₹349
                        </option>
                        <option value="Electrical Maintenance - ₹399">
                          Electrical Maintenance – ₹399
                        </option>
                        <option value="AC & Cooling Services - ₹499">
                          AC &amp; Cooling Services – ₹499
                        </option>
                        <option value="Electrical Mechanic - ₹299">
                          Electrical Mechanic – ₹299
                        </option>
                      </select>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="booking-address" className="form-label">
                      Full Address <span style={{ color: "#ff8c42" }}>*</span>
                    </label>
                    <textarea
                      id="booking-address"
                      name="Full Address"
                      required
                      rows={3}
                      placeholder="House / Flat No., Street, Locality, Delhi"
                      data-ocid="booking.address_textarea"
                      className="form-input"
                      style={{ resize: "vertical", minHeight: "80px" }}
                    />
                  </div>

                  {/* Problem Description */}
                  <div>
                    <label htmlFor="booking-problem" className="form-label">
                      Problem Description
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="booking-problem"
                      name="Problem Description"
                      rows={3}
                      placeholder="Briefly describe the electrical issue..."
                      className="form-input"
                      style={{ resize: "vertical", minHeight: "80px" }}
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label htmlFor="booking-time" className="form-label">
                      Preferred Time <span style={{ color: "#ff8c42" }}>*</span>
                    </label>
                    <select
                      id="booking-time"
                      name="Preferred Time"
                      required
                      data-ocid="booking.time_select"
                      className="form-input"
                    >
                      <option value="">— Select timing —</option>
                      <option value="Within 30 Minutes">
                        Within 30 Minutes
                      </option>
                      <option value="Within 1 Hour">Within 1 Hour</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      data-ocid="booking.submit_button"
                      className="btn-orange w-full text-base"
                      style={{ padding: "15px 28px", fontSize: "1.05rem" }}
                    >
                      Confirm Booking
                    </button>
                  </div>

                  {/* Trust badges below submit */}
                  <TrustBadgesBottom />

                  <p className="text-xs text-center text-muted-foreground pt-1">
                    By booking, you agree to our service terms. We'll call to
                    confirm your booking.
                  </p>
                </form>
              </div>

              {/* Help text */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Need urgent help?{" "}
                <a
                  href="tel:+918004774839"
                  className="text-brand-orange font-semibold no-underline hover:underline"
                >
                  Call +91 8004774839
                </a>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
