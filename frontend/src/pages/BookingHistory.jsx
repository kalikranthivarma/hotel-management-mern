import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/getImageUrl"; // Suggestion 8 — import image util

// Suggestion 1 — Color-coded status badge styles
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
  completed: "bg-blue-100 text-blue-700 border border-blue-200",
};
const STATUS_ICONS = {
  pending: "⏳",
  confirmed: "✅",
  cancelled: "❌",
  completed: "🏁",
};

// Suggestion 6 — Status filter tab options
// Values match backend enum (lowercase); "all" is our frontend-only sentinel
const STATUS_FILTERS = [
  { value: "all",       label: "All" },
  { value: "pending",   label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

// Suggestion 2 — Capitalize helper
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// Suggestion 9 — Formatted date helper (e.g. "22 Apr 2026")
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Suggestion 4 — Night count helper
const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Suggestion 6
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError("Failed to fetch your bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ useCallback for cancel
  const handleCancel = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to cancel this booking?")) return;
      try {
        await updateBookingStatus(id, { status: "cancelled" }); // lowercase matches backend enum
        fetchBookings();
      } catch (err) {
        alert("Failed to cancel booking. Please try again.");
      }
    },
    [fetchBookings]
  );

  // Suggestion 10 — Stats derived from all bookings
  const stats = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  // ✅ Memoized filtering — search + status filter (Suggestion 6)
  const filteredBookings = useMemo(() => {
    const searchStr = debouncedSearch.toLowerCase();
    return (bookings || []).filter((booking) => {
      const roomTitle = booking.room?.title?.toLowerCase() || "";
      const status = booking.status?.toLowerCase() || "";
      const matchesSearch =
        roomTitle.includes(searchStr) || status.includes(searchStr);
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, debouncedSearch, statusFilter]);

  // ✅ Virtualization (render only first 10 items)
  const visibleBookings = useMemo(() => {
    return filteredBookings.slice(0, 10);
  }, [filteredBookings]);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-6 rounded-[34px] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(28,28,28,0.06)] lg:flex-row lg:items-end">
        <div>
          <h1 className="font-serif text-5xl leading-none">My Booking Journey</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-luxe-muted">
            Track your stays and manage your upcoming visits to KNSU Stays.
          </p>
        </div>

        {/* Suggestion 5 — Search box with 🔍 icon actually rendered */}
        <div className="relative w-full lg:max-w-xs">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-luxe-muted">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search my bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke py-3 pl-11 pr-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
          />
        </div>
      </header>

      {/* Suggestion 10 — Stats summary bar */}
      {bookings.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-[24px] border border-luxe-border bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-luxe-charcoal">{stats.total}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-luxe-muted">
              Total
            </p>
          </div>
          <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-700">{stats.confirmed}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Confirmed
            </p>
          </div>
          <div className="rounded-[24px] border border-amber-100 bg-amber-50 px-5 py-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              Pending
            </p>
          </div>
          <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-rose-700">{stats.cancelled}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Cancelled
            </p>
          </div>
        </div>
      )}

      {/* Suggestion 6 — Status filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              statusFilter === value
                ? "bg-luxe-charcoal text-white"
                : "border border-luxe-border bg-white text-luxe-muted hover:border-luxe-bronze hover:text-luxe-bronze"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {filteredBookings.length > 0 ? (
        <div className="mt-6 space-y-5">
          {visibleBookings.map((booking) => {
            const nights = getNights(booking.checkIn, booking.checkOut); // Suggestion 4
            return (
              <article
                key={booking._id}
                className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  {/* Suggestion 1 — Color-coded status badge */}
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] ${
                      STATUS_STYLES[booking.status] ||
                      "bg-luxe-smoke text-luxe-charcoal"
                    }`}
                  >
                    {STATUS_ICONS[booking.status]} {booking.status}
                  </span>

                  {/* Suggestion 3 — Formatted total price */}
                  <span className="text-sm font-semibold text-luxe-bronze">
                    Rs. {booking.totalPrice?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_220px]">
                  {/* Room image + info */}
                  <div className="flex gap-4">
                    {/* Suggestion 8 — Use getImageUrl so GridFS images load correctly */}
                    <img
                      src={
                        booking.room?.images?.[0]
                          ? getImageUrl(booking.room.images[0])
                          : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&q=80"
                      }
                      alt={booking.room?.title || "Room"}
                      className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {booking.room?.title || "Unknown Room"}
                      </h3>
                      {/* Suggestion 2 — Capitalize room type */}
                      <p className="mt-1 text-sm text-luxe-muted">
                        {capitalize(booking.room?.type)}
                      </p>
                      {/* Suggestion 4 — Night count */}
                      {nights > 0 && (
                        <p className="mt-2 text-xs font-semibold text-luxe-bronze">
                          🌙 {nights} night{nights !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div>
                      <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">
                        Check-in
                      </span>
                      {/* Suggestion 9 — Formatted date */}
                      <p className="mt-2 font-semibold">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">
                        Check-out
                      </span>
                      {/* Suggestion 9 — Formatted date */}
                      <p className="mt-2 font-semibold">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                  </div>

                  {/* Cancel button */}
                  <div className="flex items-start justify-end">
                    {booking.status === "pending" && (
                      <button
                        className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        // Suggestion 7 — Empty state with CTA "Explore Rooms" button
        <div className="mt-6 rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
          <p className="text-4xl">🗓️</p>
          <h3 className="mt-4 font-serif text-3xl">No bookings found</h3>
          <p className="mt-3 text-luxe-muted">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Your future adventures await. Explore our rooms to get started."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link
              to="/rooms"
              className="mt-6 inline-flex rounded-full bg-luxe-bronze px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
            >
              Explore Rooms →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;