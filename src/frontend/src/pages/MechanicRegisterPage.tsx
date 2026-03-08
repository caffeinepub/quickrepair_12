import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

interface FileError {
  aadhar?: string;
  pan?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

export default function MechanicRegisterPage() {
  const [fileErrors, setFileErrors] = useState<FileError>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    document.title = "Join as Mechanic | QuickRepair";
  }, []);

  const validateFile = (
    file: File | null | undefined,
    fieldName: "aadhar" | "pan",
  ): boolean => {
    if (!file) return true;
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: "File size exceeds 5MB. Please upload a smaller file.",
      }));
      return false;
    }
    setFileErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    return true;
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateFile(e.target.files?.[0], "aadhar");
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateFile(e.target.files?.[0], "pan");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default — we handle submission ourselves via fetch (AJAX)
    e.preventDefault();

    const form = e.currentTarget;

    // Validate files before anything else
    const aadharInput = form.querySelector<HTMLInputElement>(
      '[name="Aadhar Card"]',
    );
    const panInput = form.querySelector<HTMLInputElement>('[name="PAN Card"]');

    const aadharOk = validateFile(aadharInput?.files?.[0], "aadhar");
    const panOk = validateFile(panInput?.files?.[0], "pan");

    if (!aadharOk || !panOk) {
      return;
    }

    // Save mechanic data to localStorage
    const mechanicData = {
      id: Date.now(),
      name:
        (form.querySelector('[name="Full Name"]') as HTMLInputElement)?.value ||
        "",
      dob:
        (form.querySelector('[name="Date of Birth"]') as HTMLInputElement)
          ?.value || "",
      phone:
        (form.querySelector('[name="Phone Number"]') as HTMLInputElement)
          ?.value || "",
      serviceType:
        (form.querySelector('[name="Service Type"]') as HTMLSelectElement)
          ?.value || "",
      experience:
        (form.querySelector('[name="Experience"]') as HTMLSelectElement)
          ?.value || "",
      address:
        (form.querySelector('[name="Full Address"]') as HTMLTextAreaElement)
          ?.value || "",
      timestamp: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("qr_mechanics") || "[]");
      existing.push(mechanicData);
      localStorage.setItem("qr_mechanics", JSON.stringify(existing));
    } catch {
      // Storage unavailable
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
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-3xl mb-4"
              style={{ background: "rgba(255,140,66,0.12)" }}
            >
              <Users size={28} style={{ color: "#ff8c42" }} />
            </div>
            <h1
              className="font-heading font-extrabold text-3xl md:text-4xl text-foreground"
              style={{ letterSpacing: "-0.025em" }}
            >
              Register as a Mechanic
            </h1>
            <p className="text-muted-foreground mt-2">
              Join QuickRepair's growing team of certified electricians
            </p>
          </div>

          {/* Full-screen success overlay */}
          {submitSuccess && (
            <div
              data-ocid="mechanic.success_state"
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
                  Registration Submitted!
                </p>
                <p className="text-sm text-center" style={{ color: "#6b7280" }}>
                  Our team will review your application and contact you soon.
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div
            className="form-card-accent bg-white rounded-3xl border border-gray-200 p-6 md:p-8"
            style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}
          >
            <form
              action="https://formsubmit.co/pandeyxkanha@gmail.com"
              method="POST"
              encType="multipart/form-data"
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              {/* Hidden Fields */}
              <input
                type="hidden"
                name="_subject"
                value="New Mechanic Registration - QuickRepair"
              />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              {/* Honeypot - visually hidden but not aria-hidden to allow form submission */}
              <input
                type="text"
                name="_honey"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Full Name */}
              <div>
                <label htmlFor="mechanic-name" className="form-label">
                  Full Name <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <input
                  id="mechanic-name"
                  type="text"
                  name="Full Name"
                  required
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              {/* DOB */}
              <div>
                <label htmlFor="mechanic-dob" className="form-label">
                  Date of Birth <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <input
                  id="mechanic-dob"
                  type="date"
                  name="Date of Birth"
                  required
                  className="form-input"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="mechanic-phone" className="form-label">
                  Phone Number <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <input
                  id="mechanic-phone"
                  type="tel"
                  name="Phone Number"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  pattern="[+]?[0-9\s\-]{10,15}"
                  className="form-input"
                />
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="mechanic-service" className="form-label">
                  Service Type <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <select
                  id="mechanic-service"
                  name="Service Type"
                  required
                  className="form-input"
                >
                  <option value="">— Choose your specialization —</option>
                  <option value="Basic Electrician">Basic Electrician</option>
                  <option value="Electrical Appliances">
                    Electrical Appliances
                  </option>
                  <option value="Electrical Maintenance">
                    Electrical Maintenance
                  </option>
                  <option value="AC & Cooling Services">
                    AC &amp; Cooling Services
                  </option>
                  <option value="Electrical Mechanic">
                    Electrical Mechanic
                  </option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="mechanic-experience" className="form-label">
                  Experience <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <select
                  id="mechanic-experience"
                  name="Experience"
                  required
                  className="form-input"
                >
                  <option value="">— Select experience —</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="mechanic-address" className="form-label">
                  Full Address <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <textarea
                  id="mechanic-address"
                  name="Full Address"
                  required
                  rows={3}
                  placeholder="House / Flat No., Street, Locality, Delhi"
                  className="form-input"
                  style={{ resize: "vertical", minHeight: "80px" }}
                />
              </div>

              {/* Aadhar Upload */}
              <div>
                <label htmlFor="mechanic-aadhar" className="form-label">
                  Upload Aadhar Card <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <div
                  className="relative rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: fileErrors.aadhar ? "#ef4444" : "#E0E0E0",
                    background: fileErrors.aadhar
                      ? "rgba(239,68,68,0.04)"
                      : "rgba(255,140,66,0.03)",
                  }}
                >
                  <FileText
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: "#ff8c42" }}
                  />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload Aadhar Card
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, PDF · Max 5MB
                  </p>
                  <input
                    id="mechanic-aadhar"
                    type="file"
                    name="Aadhar Card"
                    required
                    accept="image/*,.pdf"
                    onChange={handleAadharChange}
                    data-ocid="mechanic.upload_button"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload Aadhar Card"
                  />
                </div>
                {fileErrors.aadhar && (
                  <p
                    className="mt-1.5 text-xs flex items-center gap-1"
                    style={{ color: "#ef4444" }}
                    data-ocid="mechanic.error_state"
                  >
                    <AlertTriangle size={12} />
                    {fileErrors.aadhar}
                  </p>
                )}
              </div>

              {/* PAN Upload */}
              <div>
                <label htmlFor="mechanic-pan" className="form-label">
                  Upload PAN Card <span style={{ color: "#ff8c42" }}>*</span>
                </label>
                <div
                  className="relative rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: fileErrors.pan ? "#ef4444" : "#E0E0E0",
                    background: fileErrors.pan
                      ? "rgba(239,68,68,0.04)"
                      : "rgba(255,140,66,0.03)",
                  }}
                >
                  <FileText
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: "#ff8c42" }}
                  />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload PAN Card
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, PDF · Max 5MB
                  </p>
                  <input
                    id="mechanic-pan"
                    type="file"
                    name="PAN Card"
                    required
                    accept="image/*,.pdf"
                    onChange={handlePanChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload PAN Card"
                  />
                </div>
                {fileErrors.pan && (
                  <p
                    className="mt-1.5 text-xs flex items-center gap-1"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertTriangle size={12} />
                    {fileErrors.pan}
                  </p>
                )}
              </div>

              {/* Why Join */}
              <div>
                <label htmlFor="mechanic-why" className="form-label">
                  Why do you want to join?
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="mechanic-why"
                  name="Why Join"
                  rows={3}
                  placeholder="Tell us a bit about yourself and why you want to join QuickRepair..."
                  className="form-input"
                  style={{ resize: "vertical", minHeight: "80px" }}
                />
              </div>

              {/* Document Note */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{
                  background: "rgba(255,140,66,0.06)",
                  border: "1px solid rgba(255,140,66,0.2)",
                }}
              >
                <AlertTriangle
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#ff8c42" }}
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> Aadhar
                  and PAN uploads are mandatory. Maximum file size: 5MB each.
                  Accepted formats: JPG, PNG, PDF.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  data-ocid="mechanic.submit_button"
                  className="btn-orange w-full text-base"
                  style={{ padding: "15px 28px", fontSize: "1.05rem" }}
                >
                  Register as Mechanic
                </button>
              </div>

              {/* Trust badges below submit */}
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
                    Your data is safe with us — we never share your personal
                    information
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
