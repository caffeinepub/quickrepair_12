import { Link, useSearch } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect } from "react";

// Authentic Google Pay style: 3-tone ascending chime D5 → G5 → B5
// Soft attack, warm sine tone, natural ring-out decay
function playGPaySound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Master compressor for clean loudness
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 6;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.connect(compressor);
    master.gain.setValueAtTime(0.9, ctx.currentTime);

    // Helper: create one chime note
    function chimeNote(freq: number, startAt: number, duration: number) {
      // Primary sine
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, startAt);
      g.gain.linearRampToValueAtTime(0.85, startAt + 0.012); // soft attack
      g.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      osc.connect(g);
      g.connect(master);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.05);

      // Harmonic overtone (2nd) for warmth
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, startAt);
      g2.gain.linearRampToValueAtTime(0.22, startAt + 0.012);
      g2.gain.exponentialRampToValueAtTime(0.001, startAt + duration * 0.7);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(startAt);
      osc2.stop(startAt + duration);

      // 3rd harmonic shimmer
      const osc3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.value = freq * 3;
      g3.gain.setValueAtTime(0, startAt);
      g3.gain.linearRampToValueAtTime(0.08, startAt + 0.01);
      g3.gain.exponentialRampToValueAtTime(0.001, startAt + duration * 0.5);
      osc3.connect(g3);
      g3.connect(master);
      osc3.start(startAt);
      osc3.stop(startAt + duration * 0.6);
    }

    const t = ctx.currentTime;

    // GPay 3-note pattern: D5 (587Hz) → G5 (784Hz) → B5 (988Hz)
    // Short gap between notes — quick succession like the real GPay sound
    chimeNote(587, t + 0.0, 0.55); // D5 — first hit
    chimeNote(784, t + 0.18, 0.55); // G5 — second hit
    chimeNote(988, t + 0.36, 0.9); // B5 — final note, longer sustain

    // Fade out master after all notes done
    master.gain.setValueAtTime(0.9, t + 0.8);
    master.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
  } catch {
    // Audio not supported
  }
}

export default function ThankYouPage() {
  const { type } = useSearch({ strict: false }) as { type?: string };
  const isMechanic = type === "mechanic";

  useEffect(() => {
    document.title = isMechanic
      ? "Registration Submitted | QuickRepair"
      : "Booking Confirmed | QuickRepair";
    // Play GPay sound after a brief delay so page is visible first
    const timer = setTimeout(playGPaySound, 200);
    return () => clearTimeout(timer);
  }, [isMechanic]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 page-enter"
      style={{ backgroundColor: "white" }}
    >
      {/* Animated GPay-style checkmark */}
      <div className="relative mb-8" data-ocid="thankyou.success_state">
        {/* Outer pulse ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-16px",
            background: "rgba(34,197,94,0.12)",
            animation: "gpayPulse 1.2s ease-out 0.3s both",
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-8px",
            background: "rgba(34,197,94,0.18)",
            animation: "gpayPulse 1s ease-out 0.15s both",
          }}
        />
        {/* Green circle with animated SVG tick */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 112,
            height: 112,
            background: "linear-gradient(145deg, #22c55e 0%, #15803d 100%)",
            boxShadow:
              "0 0 0 6px rgba(34,197,94,0.2), 0 12px 40px rgba(34,197,94,0.35)",
            animation: "gpayBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Success checkmark"
          >
            <title>Success checkmark</title>
            <path
              d="M12 28 L23 40 L44 16"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: 0,
                animation: "tickDraw 0.45s cubic-bezier(0.4,0,0.2,1) 0.3s both",
              }}
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
          {isMechanic ? "Registration Submitted!" : "Booking Confirmed!"}
        </h1>

        <p className="text-base text-muted-foreground mb-2 leading-relaxed">
          {isMechanic
            ? "Our team will review your application and contact you soon."
            : "Your request has been received. Our team will contact you shortly."}
        </p>

        <p
          className="text-sm font-medium mb-8 flex items-center justify-center gap-2 flex-wrap"
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
        <div className="flex items-center gap-1.5 mb-1 justify-center">
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

      {/* Keyframe animations injected as style tag */}
      <style>{`
        @keyframes gpayBounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes gpayPulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes tickDraw {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
