import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  status?: string;
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

type ActiveView = "dashboard" | "bookings" | "mechanics";

// ─── Constants ───────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = "admin@123";
const AUTH_KEY = "qr_admin_auth";
const BOOKINGS_KEY = "qr_bookings";
const MECHANICS_KEY = "qr_mechanics";

const SERVICE_OPTIONS = [
  "All Services",
  "Basic Electrician - ₹299",
  "Electrical Appliances - ₹349",
  "Electrical Maintenance - ₹399",
  "AC & Cooling Services - ₹499",
  "Electrical Mechanic - ₹299",
];

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Completed"];

const SERVICE_TYPE_OPTIONS = [
  "All Types",
  "Basic Electrician",
  "Electrical Appliances",
  "Electrical Maintenance",
  "AC & Cooling Services",
  "Electrical Mechanic",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function isToday(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  } catch {
    return false;
  }
}

function isThisWeek(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  } catch {
    return false;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":
      return {
        background: "rgba(59,130,246,0.1)",
        color: "#2563eb",
        border: "1px solid rgba(59,130,246,0.25)",
      };
    case "Completed":
      return {
        background: "rgba(34,197,94,0.1)",
        color: "#16a34a",
        border: "1px solid rgba(34,197,94,0.25)",
      };
    default:
      return {
        background: "rgba(234,179,8,0.1)",
        color: "#ca8a04",
        border: "1px solid rgba(234,179,8,0.25)",
      };
  }
}

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csvEscape = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
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
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,140,66,0.05)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(255,215,0,0.04)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        className="relative w-full max-w-md rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,140,66,0.2), rgba(255,215,0,0.1))",
              border: "1px solid rgba(255,140,66,0.3)",
            }}
          >
            <ShieldCheck size={30} style={{ color: "#ff8c42" }} />
          </div>
          <h1
            className="font-heading font-extrabold text-3xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          data-ocid="admin.login.panel"
        >
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Admin Password
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
                placeholder="Enter password"
                data-ocid="admin.login.input"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all pr-14"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: error
                    ? "1.5px solid rgba(239,68,68,0.6)"
                    : "1.5px solid rgba(255,255,255,0.12)",
                  fontFamily: "'Outfit', sans-serif",
                  caretColor: "#ff8c42",
                }}
                onFocus={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor = "rgba(255,140,66,0.5)";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.12)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              data-ocid="admin.login.error_state"
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            data-ocid="admin.login.submit_button"
            className="w-full font-semibold text-sm rounded-xl transition-all"
            style={{
              padding: "14px 24px",
              background: "linear-gradient(135deg, #ff8c42, #ff6b1a)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 16px rgba(255,140,66,0.35)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(255,140,66,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(255,140,66,0.35)";
            }}
          >
            Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex items-start gap-4"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#9ca3af" }}
        >
          {title}
        </p>
        <p
          className="font-heading font-extrabold text-3xl mt-0.5"
          style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardOverview({
  bookings,
  mechanics,
  onNavigate,
}: {
  bookings: Booking[];
  mechanics: Mechanic[];
  onNavigate: (view: ActiveView) => void;
}) {
  const pendingCount = bookings.filter(
    (b) => !b.status || b.status === "Pending",
  ).length;
  const todayCount = bookings.filter((b) => isToday(b.timestamp)).length;
  const completedCount = bookings.filter(
    (b) => b.status === "Completed",
  ).length;
  const recent5 = [...bookings].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome bar */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #ff8c42 0%, #ff6b1a 100%)",
          boxShadow: "0 4px 20px rgba(255,140,66,0.3)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Zap size={24} className="text-white" />
        </div>
        <div>
          <h2
            className="font-heading font-bold text-xl text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Welcome to QuickRepair Admin
          </h2>
          <p className="text-sm text-white/75 mt-0.5">
            Manage all bookings and mechanic registrations from here
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={Calendar}
          color="#ff8c42"
          subtitle="All time"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          color="#ca8a04"
          subtitle="Awaiting action"
        />
        <StatCard
          title="Mechanics"
          value={mechanics.length}
          icon={Users}
          color="#FFD700"
          subtitle="Registered"
        />
        <StatCard
          title="Today's Bookings"
          value={todayCount}
          icon={TrendingUp}
          color="#22c55e"
          subtitle={`${completedCount} completed`}
        />
      </div>

      {/* Recent bookings */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3
            className="font-heading font-bold text-base"
            style={{ color: "#1a1a2e" }}
          >
            Recent Bookings
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("bookings")}
            data-ocid="admin.dashboard.bookings.button"
            className="text-xs font-semibold transition-colors"
            style={{ color: "#ff8c42" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#cc6f2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#ff8c42";
            }}
          >
            View All →
          </button>
        </div>

        {recent5.length === 0 ? (
          <div
            data-ocid="admin.dashboard.bookings.empty_state"
            className="py-12 text-center"
          >
            <Calendar
              size={32}
              className="mx-auto mb-3"
              style={{ color: "#e5e7eb" }}
            />
            <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
              No bookings yet
            </p>
            <p className="text-xs mt-1" style={{ color: "#d1d5db" }}>
              Customer bookings will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent5.map((b, i) => (
              <div
                key={b.id}
                data-ocid={`admin.dashboard.booking.item.${i + 1}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                  style={{
                    background: "rgba(255,140,66,0.1)",
                    color: "#ff8c42",
                  }}
                >
                  {(b.name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: "#1a1a2e" }}
                  >
                    {b.name || "Unknown"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#9ca3af" }}>
                    {b.service || "—"} · {b.phone || "—"}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className="inline-block px-2 py-0.5 rounded-lg text-xs font-semibold"
                    style={getStatusStyle(b.status || "Pending")}
                  >
                    {b.status || "Pending"}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: "#d1d5db" }}>
                    {formatDateShort(b.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mechanics summary */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3
            className="font-heading font-bold text-base"
            style={{ color: "#1a1a2e" }}
          >
            Recent Mechanic Registrations
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("mechanics")}
            data-ocid="admin.dashboard.mechanics.button"
            className="text-xs font-semibold transition-colors"
            style={{ color: "#ca8a04" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#a16207";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#ca8a04";
            }}
          >
            View All →
          </button>
        </div>

        {mechanics.length === 0 ? (
          <div
            data-ocid="admin.dashboard.mechanics.empty_state"
            className="py-12 text-center"
          >
            <Users
              size={32}
              className="mx-auto mb-3"
              style={{ color: "#e5e7eb" }}
            />
            <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
              No mechanic registrations yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...mechanics]
              .reverse()
              .slice(0, 5)
              .map((m, i) => (
                <div
                  key={m.id}
                  data-ocid={`admin.dashboard.mechanic.item.${i + 1}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{
                      background: "rgba(255,215,0,0.12)",
                      color: "#ca8a04",
                    }}
                  >
                    {(m.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: "#1a1a2e" }}
                    >
                      {m.name || "Unknown"}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "#9ca3af" }}
                    >
                      {m.serviceType || "—"} · {m.experience || "—"}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 inline-block px-2 py-0.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: "rgba(255,215,0,0.1)",
                      color: "#ca8a04",
                      border: "1px solid rgba(255,215,0,0.25)",
                    }}
                  >
                    {m.serviceType || "—"}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bookings Page ────────────────────────────────────────────────────────────

function BookingsPage({
  bookings,
  onDelete,
  onClearAll,
  onStatusChange,
}: {
  bookings: Booking[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);
  const statusDropRef = useRef<HTMLDivElement>(null);

  // Close status dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        openStatusId !== null &&
        statusDropRef.current &&
        !statusDropRef.current.contains(e.target as Node)
      ) {
        setOpenStatusId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openStatusId]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (b.name || "").toLowerCase().includes(q) ||
        (b.phone || "").toLowerCase().includes(q) ||
        (b.service || "").toLowerCase().includes(q) ||
        (b.address || "").toLowerCase().includes(q);

      const matchService =
        serviceFilter === "All Services" || b.service === serviceFilter;

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending"
          ? !b.status || b.status === "Pending"
          : b.status === statusFilter);

      const matchDate =
        dateFilter === "All Time" ||
        (dateFilter === "Today" && isToday(b.timestamp)) ||
        (dateFilter === "This Week" && isThisWeek(b.timestamp));

      return matchSearch && matchService && matchStatus && matchDate;
    });
  }, [bookings, search, serviceFilter, statusFilter, dateFilter]);

  const handleExportCSV = () => {
    const headers = [
      "#",
      "Name",
      "Phone",
      "Email",
      "Service",
      "Address",
      "Problem",
      "Preferred Time",
      "Status",
      "Booked On",
    ];
    const rows = filtered.map((b, i) => [
      String(i + 1),
      b.name || "",
      b.phone || "",
      b.email || "",
      b.service || "",
      b.address || "",
      b.problem || "",
      b.time || "",
      b.status || "Pending",
      formatDate(b.timestamp),
    ]);
    downloadCSV(headers, rows, `quickrepair-bookings-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2
            className="font-heading font-bold text-xl"
            style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
          >
            Bookings
          </h2>
          <span
            data-ocid="admin.bookings.count_badge"
            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,140,66,0.1)", color: "#ff8c42" }}
          >
            {filtered.length} / {bookings.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="admin.bookings.export_button"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background:
                filtered.length === 0 ? "#f3f4f6" : "rgba(34,197,94,0.1)",
              color: filtered.length === 0 ? "#9ca3af" : "#16a34a",
              border: `1px solid ${filtered.length === 0 ? "#e5e7eb" : "rgba(34,197,94,0.25)"}`,
              cursor: filtered.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <Download size={14} />
            Export CSV
          </button>

          {bookings.length > 0 && !confirmClearAll && (
            <button
              type="button"
              data-ocid="admin.bookings.delete_button"
              onClick={() => setConfirmClearAll(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(239,68,68,0.07)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.07)";
              }}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}

          {confirmClearAll && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              <span className="text-xs">Confirm delete all?</span>
              <button
                type="button"
                data-ocid="admin.bookings.confirm_button"
                onClick={() => {
                  onClearAll();
                  setConfirmClearAll(false);
                }}
                className="text-xs px-2 py-0.5 rounded-lg font-bold"
                style={{ background: "#ef4444", color: "white" }}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                data-ocid="admin.bookings.cancel_button"
                onClick={() => setConfirmClearAll(false)}
                className="text-xs px-2 py-0.5 rounded-lg font-bold"
                style={{ background: "#e5e7eb", color: "#6b7280" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "#9ca3af" }}
          />
          <input
            type="text"
            placeholder="Search name, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="admin.bookings.search_input"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "white",
              border: "1.5px solid #e5e7eb",
              color: "#1a1a2e",
              fontFamily: "'Outfit', sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#ff8c42";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Service filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          data-ocid="admin.bookings.service_select"
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            color: "#1a1a2e",
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
            minWidth: "160px",
          }}
        >
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-ocid="admin.bookings.status_select"
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            color: "#1a1a2e",
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
            minWidth: "130px",
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Date filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          data-ocid="admin.bookings.date_select"
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            color: "#1a1a2e",
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
            minWidth: "130px",
          }}
        >
          {["All Time", "Today", "This Week"].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div
          data-ocid="admin.bookings.empty_state"
          className="bg-white rounded-2xl py-16 text-center"
          style={{ border: "1.5px dashed #e5e7eb" }}
        >
          <Calendar
            size={36}
            className="mx-auto mb-3"
            style={{ color: "#e5e7eb" }}
          />
          <p className="font-semibold text-sm" style={{ color: "#9ca3af" }}>
            {bookings.length === 0
              ? "No bookings yet"
              : "No results match your filters"}
          </p>
          <p className="text-xs mt-1" style={{ color: "#d1d5db" }}>
            {bookings.length > 0 && "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div
            className="hidden md:block bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="admin.bookings.table"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {[
                      "#",
                      "Name",
                      "Phone",
                      "Service",
                      "Address",
                      "Time",
                      "Status",
                      "Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#6b7280", whiteSpace: "nowrap" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      data-ocid={`admin.bookings.row.${i + 1}`}
                      className="border-b border-gray-50 transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fafafa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        className="px-4 py-3.5 text-xs font-medium"
                        style={{ color: "#9ca3af" }}
                      >
                        {i + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "#1a1a2e" }}
                          >
                            {b.name || "—"}
                          </p>
                          {b.email && (
                            <p
                              className="text-xs mt-0.5 truncate max-w-[140px]"
                              style={{ color: "#9ca3af" }}
                            >
                              {b.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <a
                          href={`tel:${b.phone}`}
                          className="font-medium no-underline transition-colors"
                          style={{ color: "#ff8c42" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#cc6f2e";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#ff8c42";
                          }}
                        >
                          {b.phone || "—"}
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-block px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                          style={{
                            background: "rgba(255,140,66,0.08)",
                            color: "#cc6f2e",
                          }}
                        >
                          {b.service || "—"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3.5 max-w-[140px] truncate text-sm"
                        style={{ color: "#6b7280" }}
                        title={b.address}
                      >
                        {b.address || "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm whitespace-nowrap"
                        style={{ color: "#6b7280" }}
                      >
                        {b.time || "—"}
                      </td>
                      {/* Status with dropdown */}
                      <td className="px-4 py-3.5">
                        <div
                          className="relative"
                          ref={
                            openStatusId === b.id ? statusDropRef : undefined
                          }
                        >
                          <button
                            type="button"
                            data-ocid={`admin.bookings.status.toggle.${i + 1}`}
                            onClick={() =>
                              setOpenStatusId(
                                openStatusId === b.id ? null : b.id,
                              )
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            style={getStatusStyle(b.status || "Pending")}
                          >
                            {b.status || "Pending"}
                            <ChevronDown size={11} />
                          </button>
                          {openStatusId === b.id && (
                            <div
                              className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden"
                              style={{
                                background: "white",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                minWidth: "130px",
                              }}
                              data-ocid="admin.bookings.status.dropdown_menu"
                            >
                              {["Pending", "Confirmed", "Completed"].map(
                                (s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                      onStatusChange(b.id, s);
                                      setOpenStatusId(null);
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-semibold transition-colors flex items-center gap-2"
                                    style={{
                                      color: getStatusStyle(s).color,
                                      background:
                                        (b.status || "Pending") === s
                                          ? getStatusStyle(s).background
                                          : "transparent",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        getStatusStyle(s).background;
                                    }}
                                    onMouseLeave={(e) => {
                                      if ((b.status || "Pending") !== s) {
                                        e.currentTarget.style.background =
                                          "transparent";
                                      }
                                    }}
                                  >
                                    {s === "Completed" && (
                                      <CheckCircle2 size={12} />
                                    )}
                                    {s}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-4 py-3.5 text-xs whitespace-nowrap"
                        style={{ color: "#9ca3af" }}
                      >
                        {formatDateShort(b.timestamp)}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          data-ocid={`admin.bookings.delete_button.${i + 1}`}
                          onClick={() => onDelete(b.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: "#d1d5db" }}
                          title="Delete booking"
                          aria-label="Delete booking"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#d1d5db";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((b, i) => (
              <div
                key={b.id}
                data-ocid={`admin.bookings.card.${i + 1}`}
                className="bg-white rounded-2xl p-4"
                style={{
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#1a1a2e" }}
                    >
                      {b.name || "—"}
                    </p>
                    <a
                      href={`tel:${b.phone}`}
                      className="text-sm font-medium no-underline"
                      style={{ color: "#ff8c42" }}
                    >
                      {b.phone || "—"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                      style={getStatusStyle(b.status || "Pending")}
                    >
                      {b.status || "Pending"}
                    </span>
                    <button
                      type="button"
                      data-ocid={`admin.bookings.delete_button.${i + 1}`}
                      onClick={() => onDelete(b.id)}
                      className="p-1.5 rounded-lg"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                      }}
                      aria-label="Delete booking"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <span
                  className="inline-block px-2 py-1 rounded-lg text-xs font-medium mb-2"
                  style={{
                    background: "rgba(255,140,66,0.08)",
                    color: "#cc6f2e",
                  }}
                >
                  {b.service || "—"}
                </span>
                <p
                  className="text-xs mt-1 truncate"
                  style={{ color: "#9ca3af" }}
                >
                  {b.address || "—"}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    {["Pending", "Confirmed", "Completed"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onStatusChange(b.id, s)}
                        className="text-xs px-2 py-0.5 rounded-lg font-semibold transition-all"
                        style={{
                          ...((b.status || "Pending") === s
                            ? getStatusStyle(s)
                            : { background: "#f3f4f6", color: "#9ca3af" }),
                          border: "none",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "#d1d5db" }}>
                    {formatDateShort(b.timestamp)}
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

// ─── Mechanics Page ───────────────────────────────────────────────────────────

function MechanicsPage({
  mechanics,
  onDelete,
  onClearAll,
}: {
  mechanics: Mechanic[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
}) {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All Types");
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const filtered = useMemo(() => {
    return mechanics.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.phone || "").toLowerCase().includes(q) ||
        (m.serviceType || "").toLowerCase().includes(q) ||
        (m.address || "").toLowerCase().includes(q);

      const matchService =
        serviceFilter === "All Types" || m.serviceType === serviceFilter;

      return matchSearch && matchService;
    });
  }, [mechanics, search, serviceFilter]);

  const handleExportCSV = () => {
    const headers = [
      "#",
      "Name",
      "DOB",
      "Phone",
      "Service Type",
      "Experience",
      "Address",
      "Registered On",
    ];
    const rows = filtered.map((m, i) => [
      String(i + 1),
      m.name || "",
      m.dob || "",
      m.phone || "",
      m.serviceType || "",
      m.experience || "",
      m.address || "",
      formatDate(m.timestamp),
    ]);
    downloadCSV(headers, rows, `quickrepair-mechanics-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2
            className="font-heading font-bold text-xl"
            style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
          >
            Mechanic Registrations
          </h2>
          <span
            data-ocid="admin.mechanics.count_badge"
            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,215,0,0.12)", color: "#ca8a04" }}
          >
            {filtered.length} / {mechanics.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="admin.mechanics.export_button"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background:
                filtered.length === 0 ? "#f3f4f6" : "rgba(34,197,94,0.1)",
              color: filtered.length === 0 ? "#9ca3af" : "#16a34a",
              border: `1px solid ${filtered.length === 0 ? "#e5e7eb" : "rgba(34,197,94,0.25)"}`,
              cursor: filtered.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <Download size={14} />
            Export CSV
          </button>

          {mechanics.length > 0 && !confirmClearAll && (
            <button
              type="button"
              data-ocid="admin.mechanics.delete_button"
              onClick={() => setConfirmClearAll(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(239,68,68,0.07)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.07)";
              }}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}

          {confirmClearAll && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              <span className="text-xs">Confirm delete all?</span>
              <button
                type="button"
                data-ocid="admin.mechanics.confirm_button"
                onClick={() => {
                  onClearAll();
                  setConfirmClearAll(false);
                }}
                className="text-xs px-2 py-0.5 rounded-lg font-bold"
                style={{ background: "#ef4444", color: "white" }}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                data-ocid="admin.mechanics.cancel_button"
                onClick={() => setConfirmClearAll(false)}
                className="text-xs px-2 py-0.5 rounded-lg font-bold"
                style={{ background: "#e5e7eb", color: "#6b7280" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "#9ca3af" }}
          />
          <input
            type="text"
            placeholder="Search name, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="admin.mechanics.search_input"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "white",
              border: "1.5px solid #e5e7eb",
              color: "#1a1a2e",
              fontFamily: "'Outfit', sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#FFD700";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          data-ocid="admin.mechanics.service_select"
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            color: "#1a1a2e",
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
            minWidth: "160px",
          }}
        >
          {SERVICE_TYPE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div
          data-ocid="admin.mechanics.empty_state"
          className="bg-white rounded-2xl py-16 text-center"
          style={{ border: "1.5px dashed #e5e7eb" }}
        >
          <Users
            size={36}
            className="mx-auto mb-3"
            style={{ color: "#e5e7eb" }}
          />
          <p className="font-semibold text-sm" style={{ color: "#9ca3af" }}>
            {mechanics.length === 0
              ? "No mechanic registrations yet"
              : "No results match your filters"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div
            className="hidden md:block bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="admin.mechanics.table"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {[
                      "#",
                      "Name",
                      "DOB",
                      "Phone",
                      "Service Type",
                      "Experience",
                      "Address",
                      "Registered",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#6b7280", whiteSpace: "nowrap" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.id}
                      data-ocid={`admin.mechanics.row.${i + 1}`}
                      className="border-b border-gray-50 transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fafafa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        className="px-4 py-3.5 text-xs font-medium"
                        style={{ color: "#9ca3af" }}
                      >
                        {i + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <p
                          className="font-semibold"
                          style={{ color: "#1a1a2e" }}
                        >
                          {m.name || "—"}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm"
                        style={{ color: "#6b7280" }}
                      >
                        {m.dob || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <a
                          href={`tel:${m.phone}`}
                          className="font-medium no-underline transition-colors"
                          style={{ color: "#ff8c42" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#cc6f2e";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#ff8c42";
                          }}
                        >
                          {m.phone || "—"}
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-block px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                          style={{
                            background: "rgba(255,215,0,0.1)",
                            color: "#ca8a04",
                          }}
                        >
                          {m.serviceType || "—"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm"
                        style={{ color: "#6b7280" }}
                      >
                        {m.experience || "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 max-w-[140px] truncate text-sm"
                        style={{ color: "#6b7280" }}
                        title={m.address}
                      >
                        {m.address || "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-xs whitespace-nowrap"
                        style={{ color: "#9ca3af" }}
                      >
                        {formatDateShort(m.timestamp)}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          data-ocid={`admin.mechanics.delete_button.${i + 1}`}
                          onClick={() => onDelete(m.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: "#d1d5db" }}
                          title="Delete mechanic"
                          aria-label="Delete mechanic"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#d1d5db";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((m, i) => (
              <div
                key={m.id}
                data-ocid={`admin.mechanics.card.${i + 1}`}
                className="bg-white rounded-2xl p-4"
                style={{
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#1a1a2e" }}
                    >
                      {m.name || "—"}
                    </p>
                    <a
                      href={`tel:${m.phone}`}
                      className="text-sm font-medium no-underline"
                      style={{ color: "#ff8c42" }}
                    >
                      {m.phone || "—"}
                    </a>
                  </div>
                  <button
                    type="button"
                    data-ocid={`admin.mechanics.delete_button.${i + 1}`}
                    onClick={() => onDelete(m.id)}
                    className="p-2 rounded-xl"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      color: "#ef4444",
                    }}
                    aria-label="Delete mechanic"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "rgba(255,215,0,0.1)",
                      color: "#ca8a04",
                    }}
                  >
                    {m.serviceType || "—"}
                  </span>
                  <span
                    className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: "#f3f4f6", color: "#6b7280" }}
                  >
                    {m.experience || "—"}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: "#9ca3af" }}>
                  {m.address || "—"}
                </p>
                <p className="text-xs mt-2" style={{ color: "#d1d5db" }}>
                  DOB: {m.dob || "—"} · Joined {formatDateShort(m.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeView,
  onNavigate,
  onLogout,
  bookingCount,
  mechanicCount,
  isMobileOpen,
  onMobileClose,
}: {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
  bookingCount: number;
  mechanicCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const navItems: {
    id: ActiveView;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar, count: bookingCount },
    { id: "mechanics", label: "Mechanics", icon: Users, count: mechanicCount },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col" style={{ background: "white" }}>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid #f3f4f6" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,140,66,0.15), rgba(255,215,0,0.1))",
            border: "1px solid rgba(255,140,66,0.25)",
          }}
        >
          <ShieldCheck size={18} style={{ color: "#ff8c42" }} />
        </div>
        <div>
          <p
            className="font-heading font-extrabold text-base leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            Admin Panel
          </p>
        </div>

        {/* Close button on mobile */}
        <button
          type="button"
          onClick={onMobileClose}
          className="ml-auto md:hidden p-1.5 rounded-lg"
          style={{ color: "#9ca3af" }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, count }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`admin.nav.${id}.button`}
              onClick={() => {
                onNavigate(id);
                onMobileClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(255,140,66,0.12), rgba(255,215,0,0.06))",
                      color: "#ff8c42",
                      border: "1px solid rgba(255,140,66,0.18)",
                    }
                  : {
                      color: "#6b7280",
                      background: "transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.color = "#1a1a2e";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {count !== undefined && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={
                    isActive
                      ? {
                          background: "rgba(255,140,66,0.15)",
                          color: "#ff8c42",
                        }
                      : { background: "#f3f4f6", color: "#9ca3af" }
                  }
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 pb-4"
        style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}
      >
        <button
          type="button"
          data-ocid="admin.logout.button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ color: "#ef4444" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{
          width: "260px",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={onMobileClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") onMobileClose();
            }}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />
          <aside
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col"
            style={{
              boxShadow: "4px 0 30px rgba(0,0,0,0.12)",
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auth check on mount
  useEffect(() => {
    document.title = "Admin Panel | QuickRepair";
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // Load data from localStorage
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

  // ── Booking mutations ──
  const deleteBooking = (id: number) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllBookings = () => {
    setBookings([]);
    localStorage.setItem(BOOKINGS_KEY, "[]");
  };

  const updateBookingStatus = (id: number, status: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status } : b));
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ── Mechanic mutations ──
  const deleteMechanic = (id: number) => {
    setMechanics((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem(MECHANICS_KEY, JSON.stringify(updated));
      return updated;
    });
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
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const viewTitles: Record<ActiveView, string> = {
    dashboard: "Dashboard Overview",
    bookings: "All Bookings",
    mechanics: "Mechanic Registrations",
  };

  const viewIcons: Record<ActiveView, React.ElementType> = {
    dashboard: LayoutDashboard,
    bookings: Calendar,
    mechanics: Users,
  };

  const ViewIcon = viewIcons[activeView];

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#F0F2F5", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
        bookingCount={bookings.length}
        mechanicCount={mechanics.length}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-5 md:px-6"
          style={{
            background: "white",
            borderBottom: "1px solid #f0f0f0",
            height: "60px",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
          }}
        >
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            data-ocid="admin.nav.menu.button"
            className="md:hidden p-2 -ml-1 rounded-xl transition-colors"
            style={{ color: "#6b7280" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.color = "#1a1a2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <ViewIcon size={18} style={{ color: "#ff8c42", flexShrink: 0 }} />
            <h1
              className="font-heading font-bold text-base truncate"
              style={{ color: "#1a1a2e", letterSpacing: "-0.01em" }}
            >
              {viewTitles[activeView]}
            </h1>
          </div>

          {/* Breadcrumb stats */}
          <div className="hidden sm:flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#9ca3af" }}
            >
              <BarChart3 size={13} />
              {bookings.length} bookings · {mechanics.length} mechanics
            </span>
          </div>

          {/* Logout (desktop, also in sidebar) */}
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="admin.header.logout.button"
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
            style={{
              background: "rgba(239,68,68,0.06)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
            }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7 overflow-auto">
          {activeView === "dashboard" && (
            <DashboardOverview
              bookings={bookings}
              mechanics={mechanics}
              onNavigate={setActiveView}
            />
          )}
          {activeView === "bookings" && (
            <BookingsPage
              bookings={bookings}
              onDelete={deleteBooking}
              onClearAll={clearAllBookings}
              onStatusChange={updateBookingStatus}
            />
          )}
          {activeView === "mechanics" && (
            <MechanicsPage
              mechanics={mechanics}
              onDelete={deleteMechanic}
              onClearAll={clearAllMechanics}
            />
          )}
        </main>
      </div>
    </div>
  );
}
