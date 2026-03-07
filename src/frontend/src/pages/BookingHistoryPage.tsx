import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardList,
  Clock,
  LogIn,
  MapPin,
  Phone,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface BookingData {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  address?: string;
  problem?: string;
  time?: string;
  timestamp?: string;
}

function parseBooking(json: string): BookingData {
  try {
    return JSON.parse(json) as BookingData;
  } catch {
    return {};
  }
}

function formatDate(isoString?: string): string {
  if (!isoString) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export default function BookingHistoryPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const isLoggedIn = !!identity;

  useEffect(() => {
    document.title = "My Bookings | QuickRepair";
  }, []);

  const {
    data: rawBookings,
    isLoading,
    isError,
    refetch,
  } = useQuery<string[]>({
    queryKey: ["myBookings", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
  });

  const bookings = (rawBookings ?? []).map(parseBooking).reverse();

  return (
    <div
      data-ocid="history.page"
      className="page-enter min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,140,66,0.12)" }}
                >
                  <ClipboardList size={24} style={{ color: "#ff8c42" }} />
                </div>
                <div>
                  <h1
                    className="font-heading font-extrabold text-2xl md:text-3xl"
                    style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
                  >
                    My Bookings
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Your complete service booking history
                  </p>
                </div>
              </div>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors hover:bg-orange-50"
                  style={{ borderColor: "#ff8c42", color: "#ff8c42" }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              )}
            </div>
          </div>

          {/* Not logged in */}
          {!isInitializing && !isLoggedIn && (
            <div
              className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 text-center"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.06)" }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{ background: "rgba(255,140,66,0.1)" }}
              >
                <LogIn size={30} style={{ color: "#ff8c42" }} />
              </div>
              <h2
                className="font-heading font-extrabold text-2xl mb-3"
                style={{ color: "#1a1a2e" }}
              >
                Sign In to View Bookings
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Please sign in to your account to view your booking history.
              </p>
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="btn-orange inline-flex items-center gap-2"
                style={{ padding: "14px 32px", fontSize: "1rem" }}
              >
                <LogIn size={18} />
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </button>
            </div>
          )}

          {/* Loading state */}
          {(isInitializing || (isLoggedIn && (isLoading || actorFetching))) && (
            <div data-ocid="history.loading_state" className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isLoggedIn && isError && !isLoading && (
            <div
              data-ocid="history.error_state"
              className="rounded-2xl border p-6 text-center"
              style={{
                background: "rgba(239,68,68,0.04)",
                borderColor: "rgba(239,68,68,0.2)",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>
                Could not load your bookings. Please try again.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 text-sm font-medium underline"
                style={{ color: "#ff8c42" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {isLoggedIn &&
            !isLoading &&
            !actorFetching &&
            !isError &&
            bookings.length === 0 && (
              <div
                data-ocid="history.empty_state"
                className="rounded-3xl border border-gray-200 bg-white p-10 text-center"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                  style={{ background: "rgba(255,140,66,0.08)" }}
                >
                  <Zap size={30} style={{ color: "#ff8c42", opacity: 0.5 }} />
                </div>
                <h3
                  className="font-heading font-bold text-xl mb-2"
                  style={{ color: "#1a1a2e" }}
                >
                  No bookings yet
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Book your first service! Our certified electricians arrive in
                  30 minutes.
                </p>
                <Link to="/book">
                  <button
                    type="button"
                    className="btn-orange inline-flex items-center gap-2"
                    style={{ padding: "12px 28px" }}
                  >
                    <Zap size={16} />
                    Book a Service
                  </button>
                </Link>
              </div>
            )}

          {/* Booking cards */}
          {isLoggedIn &&
            !isLoading &&
            !actorFetching &&
            bookings.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {bookings.length} booking{bookings.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
                {bookings.map((booking, index) => {
                  const cardNum = index + 1;
                  return (
                    <div
                      key={booking.id ?? index}
                      data-ocid={`history.item.${cardNum}`}
                      className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 transition-shadow hover:shadow-md"
                      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "rgba(255,140,66,0.1)" }}
                          >
                            <Zap size={18} style={{ color: "#ff8c42" }} />
                          </div>
                          <div>
                            <h3
                              className="font-heading font-bold text-base"
                              style={{ color: "#1a1a2e" }}
                            >
                              {booking.service || "Service Booking"}
                            </h3>
                            {booking.name && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {booking.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(34,197,94,0.1)",
                            color: "#16a34a",
                            border: "1px solid rgba(34,197,94,0.2)",
                          }}
                        >
                          Confirmed
                        </span>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {booking.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone
                              size={13}
                              style={{ color: "#ff8c42", flexShrink: 0 }}
                            />
                            <span>{booking.phone}</span>
                          </div>
                        )}
                        {booking.time && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock
                              size={13}
                              style={{ color: "#ff8c42", flexShrink: 0 }}
                            />
                            <span>{booking.time}</span>
                          </div>
                        )}
                        {booking.timestamp && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar
                              size={13}
                              style={{ color: "#ff8c42", flexShrink: 0 }}
                            />
                            <span>{formatDate(booking.timestamp)}</span>
                          </div>
                        )}
                        {booking.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                            <MapPin
                              size={13}
                              style={{
                                color: "#ff8c42",
                                flexShrink: 0,
                                marginTop: "2px",
                              }}
                            />
                            <span className="line-clamp-2">
                              {booking.address}
                            </span>
                          </div>
                        )}
                        {booking.problem && (
                          <div className="sm:col-span-2 mt-1 pt-3 border-t border-gray-100">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                Issue:{" "}
                              </span>
                              {booking.problem}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          {/* CTA to book more */}
          {isLoggedIn && !isLoading && bookings.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/book">
                <button
                  type="button"
                  className="btn-orange inline-flex items-center gap-2"
                  style={{ padding: "12px 28px" }}
                >
                  <Zap size={16} />
                  Book Another Service
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
