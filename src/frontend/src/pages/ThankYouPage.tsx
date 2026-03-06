import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect } from "react";

function playSuccessSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.01);

    // Note 1: D5 (587Hz) — short pop
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.type = "sine";
    osc1.frequency.value = 587;
    gain1.gain.setValueAtTime(0.8, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.18);

    // Note 2: F#5 (740Hz) — mid
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.type = "sine";
    osc2.frequency.value = 740;
    gain2.gain.setValueAtTime(0.85, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc2.start(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.35);

    // Note 3: A5 (880Hz) — high finish, longer sustain
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.type = "sine";
    osc3.frequency.value = 880;
    gain3.gain.setValueAtTime(0.9, ctx.currentTime + 0.32);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
    osc3.start(ctx.currentTime + 0.32);
    osc3.stop(ctx.currentTime + 0.75);

    // Harmony layer: add subtle overtone on note 3
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.connect(gain4);
    gain4.connect(masterGain);
    osc4.type = "sine";
    osc4.frequency.value = 1320; // octave above A5 softly
    gain4.gain.setValueAtTime(0.25, ctx.currentTime + 0.32);
    gain4.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc4.start(ctx.currentTime + 0.32);
    osc4.stop(ctx.currentTime + 0.65);

    // Fade out master
    masterGain.gain.setValueAtTime(0.55, ctx.currentTime + 0.5);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
  } catch {
    // Audio not supported
  }
}

export default function ThankYouPage() {
  useEffect(() => {
    document.title = "Thank You | QuickRepair";
    const timer = setTimeout(playSuccessSound, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 page-enter"
      style={{ backgroundColor: "white" }}
    >
      {/* Animated checkmark */}
      <div className="relative mb-8">
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-pulse-ring"
          style={{ background: "rgba(34,197,94,0.2)" }}
        />
        {/* Circle */}
        <div
          className="check-circle-bg relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Success checkmark"
          >
            <title>Success checkmark</title>
            <path
              className="check-path"
              d="M10 22 L18 31 L34 14"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-sm">
        <h1
          className="font-heading font-extrabold text-4xl text-foreground mb-3"
          style={{ letterSpacing: "-0.03em" }}
        >
          Thank You!
        </h1>

        <p className="text-base text-muted-foreground mb-2 leading-relaxed">
          Your request has been received. Our team will contact you shortly.
        </p>

        <p
          className="text-sm font-medium mb-8 flex items-center justify-center gap-2"
          style={{ color: "#ff8c42" }}
        >
          <Phone size={14} />
          For urgent help, call us at{" "}
          <a
            href="tel:+918004774839"
            className="font-bold no-underline hover:underline"
            style={{ color: "#ff8c42" }}
          >
            +91 8004774839
          </a>
        </p>

        {/* Hours */}
        <div
          className="rounded-xl p-4 mb-6 text-sm"
          style={{
            background: "rgba(255,140,66,0.06)",
            border: "1px solid rgba(255,140,66,0.2)",
            color: "#ff8c42",
          }}
        >
          Available 7 Days · 8 AM – 8 PM
        </div>

        <Link to="/">
          <button
            type="button"
            data-ocid="thankyou.home_button"
            className="btn-orange"
            style={{ padding: "14px 36px" }}
          >
            ← Back to Home
          </button>
        </Link>
      </div>

      {/* Branding */}
      <div className="mt-12">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-6 h-6 bg-brand-orange rounded-md flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="white"
              role="img"
              aria-label="Lightning bolt icon"
            >
              <title>Lightning bolt icon</title>
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
            </svg>
          </div>
          <span
            className="font-heading font-extrabold text-lg"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          30-Minute Electrical Service · Mahipalpur, Delhi
        </p>
      </div>
    </div>
  );
}
