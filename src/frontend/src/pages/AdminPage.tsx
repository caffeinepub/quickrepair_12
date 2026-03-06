import {
  AlertCircle,
  Calendar,
  LogOut,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  address: string;
  problem: string;
  time: string;
  timestamp: string;
}

interface Mechanic {
  id: number;
  name: string;
  dob: string;
  phone: string;
  serviceType: string;
  experience: string;
  address: string;
  timestamp: string;
}

const ADMIN_PASSWORD = "quickrepair@admin2024";
const AUTH_KEY = "qr_admin_auth";
const BOOKINGS_KEY = "qr_bookings";
const MECHANICS_KEY = "qr_mechanics";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 border"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,140,66,0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{ background: "rgba(255,140,66,0.15)" }}
          >
            <ShieldCheck size={28} style={{ color: "#ff8c42" }} />
          </div>
          <h1
            className="font-heading font-extrabold text-2xl text-white"
            style={{ letterSpacing: "-0.025em" }}
          >
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-ocid="admin.login.panel"
        >
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin password"
                data-ocid="admin.login.input"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all pr-12"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: error
                    ? "1.5px solid #ef4444"
                    : "1.5px solid rgba(255,140,66,0.3)",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onFocus={(e) => {
                  if (!error) e.currentTarget.style.borderColor = "#ff8c42";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "rgba(255,140,66,0.3)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-xs"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div
              data-ocid="admin.login.error_state"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            data-ocid="admin.login.submit_button"
            className="btn-orange w-full"
            style={{ padding: "13px 24px", marginTop: "4px" }}
          >
            Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingsTable({
  bookings,
  onDelete,
  onClearAll,
}: {
  bookings: Booking[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-lg text-foreground">
          All Bookings{" "}
          <span
            className="ml-2 text-sm font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: "rgba(255,140,66,0.12)", color: "#ff8c42" }}
            data-ocid="admin.bookings.count_badge"
          >
            {bookings.length}
          </span>
        </h2>
        {bookings.length > 0 && (
          <button
            type="button"
            data-ocid="admin.bookings.delete_button"
            onClick={onClearAll}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div
          data-ocid="admin.bookings.empty_state"
          className="rounded-2xl p-12 text-center"
          style={{ background: "#F8F9FA", border: "1.5px dashed #E0E0E0" }}
        >
          <Calendar
            size={36}
            className="mx-auto mb-3"
            style={{ color: "#ff8c42", opacity: 0.4 }}
          />
          <p className="font-heading font-semibold text-gray-500">
            No bookings yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Customer bookings will appear here after submission
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200">
            <table
              className="w-full text-sm"
              data-ocid="admin.bookings.table"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F8F9FA",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  {[
                    "Name",
                    "Phone",
                    "Service",
                    "Address",
                    "Preferred Time",
                    "Date/Time",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    data-ocid={`admin.bookings.row.${i + 1}`}
                    className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {b.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a
                        href={`tel:${b.phone}`}
                        className="hover:text-brand-orange no-underline"
                      >
                        {b.phone || "—"}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: "rgba(255,140,66,0.1)",
                          color: "#ff8c42",
                        }}
                      >
                        {b.service || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {b.address || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.time || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(b.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-ocid={`admin.bookings.delete_button.${i + 1}`}
                        onClick={() => onDelete(b.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#ef4444" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Delete"
                        aria-label="Delete booking"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {bookings.map((b, i) => (
              <div
                key={b.id}
                data-ocid={`admin.bookings.card.${i + 1}`}
                className="rounded-xl border border-gray-200 bg-white p-4"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-gray-800">
                      {b.name || "—"}
                    </p>
                    <a
                      href={`tel:${b.phone}`}
                      className="text-sm text-brand-orange no-underline font-medium"
                    >
                      {b.phone || "—"}
                    </a>
                  </div>
                  <button
                    type="button"
                    data-ocid={`admin.bookings.delete_button.${i + 1}`}
                    onClick={() => onDelete(b.id)}
                    className="p-2 rounded-lg"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      color: "#ef4444",
                    }}
                    aria-label="Delete booking"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <span
                  className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-2"
                  style={{
                    background: "rgba(255,140,66,0.1)",
                    color: "#ff8c42",
                  }}
                >
                  {b.service || "—"}
                </span>
                <p className="text-sm text-gray-500 mb-1">{b.address || "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{b.time || "—"}</span>
                  <span className="text-xs text-gray-300">
                    {formatDate(b.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MechanicsTable({
  mechanics,
  onDelete,
  onClearAll,
}: {
  mechanics: Mechanic[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-lg text-foreground">
          Mechanic Registrations{" "}
          <span
            className="ml-2 text-sm font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: "rgba(255,215,0,0.15)", color: "#c8a800" }}
            data-ocid="admin.mechanics.count_badge"
          >
            {mechanics.length}
          </span>
        </h2>
        {mechanics.length > 0 && (
          <button
            type="button"
            data-ocid="admin.mechanics.delete_button"
            onClick={onClearAll}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {mechanics.length === 0 ? (
        <div
          data-ocid="admin.mechanics.empty_state"
          className="rounded-2xl p-12 text-center"
          style={{ background: "#F8F9FA", border: "1.5px dashed #E0E0E0" }}
        >
          <Users
            size={36}
            className="mx-auto mb-3"
            style={{ color: "#FFD700", opacity: 0.5 }}
          />
          <p className="font-heading font-semibold text-gray-500">
            No mechanic registrations yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Mechanic sign-ups will appear here after submission
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200">
            <table
              className="w-full text-sm"
              data-ocid="admin.mechanics.table"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F8F9FA",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  {[
                    "Name",
                    "Phone",
                    "Service Type",
                    "Experience",
                    "Address",
                    "Date/Time",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mechanics.map((m, i) => (
                  <tr
                    key={m.id}
                    data-ocid={`admin.mechanics.row.${i + 1}`}
                    className="border-b border-gray-100 hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {m.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a
                        href={`tel:${m.phone}`}
                        className="hover:text-brand-orange no-underline"
                      >
                        {m.phone || "—"}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: "rgba(255,215,0,0.12)",
                          color: "#c8a800",
                        }}
                      >
                        {m.serviceType || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {m.experience || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {m.address || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(m.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-ocid={`admin.mechanics.delete_button.${i + 1}`}
                        onClick={() => onDelete(m.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#ef4444" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Delete"
                        aria-label="Delete mechanic"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {mechanics.map((m, i) => (
              <div
                key={m.id}
                data-ocid={`admin.mechanics.card.${i + 1}`}
                className="rounded-xl border border-gray-200 bg-white p-4"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-gray-800">
                      {m.name || "—"}
                    </p>
                    <a
                      href={`tel:${m.phone}`}
                      className="text-sm text-brand-orange no-underline font-medium"
                    >
                      {m.phone || "—"}
                    </a>
                  </div>
                  <button
                    type="button"
                    data-ocid={`admin.mechanics.delete_button.${i + 1}`}
                    onClick={() => onDelete(m.id)}
                    className="p-2 rounded-lg"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      color: "#ef4444",
                    }}
                    aria-label="Delete mechanic"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <span
                  className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-2"
                  style={{
                    background: "rgba(255,215,0,0.12)",
                    color: "#c8a800",
                  }}
                >
                  {m.serviceType || "—"}
                </span>
                <p className="text-sm text-gray-500">
                  {m.experience || "—"} experience
                </p>
                <p className="text-sm text-gray-400 mt-1 truncate">
                  {m.address || "—"}
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  {formatDate(m.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "mechanics">(
    "bookings",
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    document.title = "Admin Panel | QuickRepair";
    const auth = sessionStorage.getItem(AUTH_KEY);
    if (auth === "1") setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadData = () => {
      try {
        setBookings(JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]"));
        setMechanics(JSON.parse(localStorage.getItem(MECHANICS_KEY) || "[]"));
      } catch {
        setBookings([]);
        setMechanics([]);
      }
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [isLoggedIn]);

  const deleteBooking = (id: number) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  };

  const clearAllBookings = () => {
    setBookings([]);
    localStorage.setItem(BOOKINGS_KEY, "[]");
  };

  const deleteMechanic = (id: number) => {
    const updated = mechanics.filter((m) => m.id !== id);
    setMechanics(updated);
    localStorage.setItem(MECHANICS_KEY, JSON.stringify(updated));
  };

  const clearAllMechanics = () => {
    setMechanics([]);
    localStorage.setItem(MECHANICS_KEY, "[]");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "white",
          borderBottom: "1px solid #E0E0E0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,140,66,0.12)" }}
            >
              <ShieldCheck size={18} style={{ color: "#ff8c42" }} />
            </div>
            <div>
              <h1
                className="font-heading font-extrabold text-base leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                <span style={{ color: "#FFD700" }}>Quick</span>
                <span style={{ color: "#ff8c42" }}>Repair</span>
                <span className="text-gray-400 font-normal text-sm ml-1.5">
                  Admin
                </span>
              </h1>
            </div>
          </div>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              background: "rgba(255,140,66,0.08)",
              color: "#ff8c42",
              border: "1px solid rgba(255,140,66,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,140,66,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,140,66,0.08)";
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div
          className="flex gap-2 mb-8"
          role="tablist"
          aria-label="Admin sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bookings"}
            data-ocid="admin.bookings.tab"
            onClick={() => setActiveTab("bookings")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={
              activeTab === "bookings"
                ? {
                    background: "#ff8c42",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(255,140,66,0.35)",
                  }
                : {
                    background: "white",
                    color: "#666",
                    border: "1px solid #E0E0E0",
                  }
            }
          >
            <Calendar size={15} />
            Bookings
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={
                activeTab === "bookings"
                  ? { background: "rgba(255,255,255,0.25)", color: "white" }
                  : { background: "rgba(255,140,66,0.1)", color: "#ff8c42" }
              }
            >
              {bookings.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "mechanics"}
            data-ocid="admin.mechanics.tab"
            onClick={() => setActiveTab("mechanics")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={
              activeTab === "mechanics"
                ? {
                    background: "#FFD700",
                    color: "#1a1a2e",
                    boxShadow: "0 4px 14px rgba(255,215,0,0.35)",
                  }
                : {
                    background: "white",
                    color: "#666",
                    border: "1px solid #E0E0E0",
                  }
            }
          >
            <Users size={15} />
            Mechanics
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={
                activeTab === "mechanics"
                  ? { background: "rgba(0,0,0,0.12)", color: "#1a1a2e" }
                  : { background: "rgba(255,215,0,0.15)", color: "#c8a800" }
              }
            >
              {mechanics.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}
        >
          {activeTab === "bookings" ? (
            <BookingsTable
              bookings={bookings}
              onDelete={deleteBooking}
              onClearAll={clearAllBookings}
            />
          ) : (
            <MechanicsTable
              mechanics={mechanics}
              onDelete={deleteMechanic}
              onClearAll={clearAllMechanics}
            />
          )}
        </div>
      </main>
    </div>
  );
}
