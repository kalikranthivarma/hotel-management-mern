import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/getImageUrl";

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending:   "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
  completed: "bg-blue-100 text-blue-700 border border-blue-200",
};
const STATUS_ICONS = {
  pending:   "⏳",
  confirmed: "✅",
  cancelled: "❌",
  completed: "🏁",
};
const STATUS_FILTERS = [
  { value: "all",       label: "All" },
  { value: "pending",   label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
};

const getDaysRemaining = (checkIn) => {
  if (!checkIn) return null;
  const diff = Math.ceil((new Date(checkIn) - new Date()) / 86400000);
  return diff;
};

// ── Stay Progress Timeline ───────────────────────────────────────────────────
const StayTimeline = ({ checkIn, checkOut, status }) => {
  const now = new Date();
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  let step = 0;
  if (status === "cancelled") { step = -1; }
  else if (now >= outDate) { step = 2; }
  else if (now >= inDate) { step = 1; }

  const stages = ["Booked", "Check-in", "Check-out"];

  if (step === -1) {
    return (
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="text-xs text-rose-500 font-semibold">Booking Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => (
          <div key={stage} className="flex flex-1 flex-col items-center relative">
            <div
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                i <= step
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-luxe-border bg-white text-luxe-muted"
              }`}
            >
              {i <= step ? "✓" : i + 1}
            </div>
            <p className={`mt-1 text-[10px] font-semibold ${i <= step ? "text-emerald-600" : "text-luxe-muted"}`}>
              {stage}
            </p>
            {i < stages.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 h-0.5 w-full -z-10 ${
                  i < step ? "bg-emerald-400" : "bg-luxe-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Booking Passport Modal ───────────────────────────────────────────────────
const BookingModal = ({ booking, onClose }) => {
  const nights = getNights(booking.checkIn, booking.checkOut);
  const copiedRef = useRef(false);
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking._id);
    setCopied(true);
    copiedRef.current = true;
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  // Close on outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-luxe-charcoal/60 px-4 py-8 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white shadow-[0_32px_100px_rgba(28,28,28,0.25)]">
        {/* Room Image Banner */}
        <div className="relative h-52 overflow-hidden rounded-t-[32px]">
          <img
            src={
              booking.room?.images?.[0]
                ? getImageUrl(booking.room.images[0])
                : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"
            }
            alt={booking.room?.title || "Room"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            ✕
          </button>
          <span
            className={`absolute left-5 bottom-4 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] ${
              STATUS_STYLES[booking.status] || "bg-white text-luxe-charcoal"
            }`}
          >
            {STATUS_ICONS[booking.status]} {booking.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-luxe-bronze">
                Booking Passport
              </p>
              <h2 className="mt-1 font-serif text-3xl leading-tight">
                {booking.room?.title || "Unknown Room"}
              </h2>
              <p className="mt-1 text-sm text-luxe-muted">
                {capitalize(booking.room?.type)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-luxe-bronze">
                Rs. {booking.totalPrice?.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-luxe-muted">
                Total for {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stay Timeline */}
          <StayTimeline
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            status={booking.status}
          />

          <div className="my-6 h-px bg-luxe-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Check-in</p>
              <p className="mt-1 font-semibold">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Check-out</p>
              <p className="mt-1 font-semibold">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Duration</p>
              <p className="mt-1 font-semibold">
                🌙 {nights} night{nights !== 1 ? "s" : ""}
              </p>
            </div>
            {booking.guests && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Guests</p>
                <p className="mt-1 font-semibold">👥 {booking.guests}</p>
              </div>
            )}
            {booking.paymentMethod && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Payment</p>
                <p className="mt-1 font-semibold capitalize">{booking.paymentMethod}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Booking ID</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="truncate text-xs font-mono text-luxe-charcoal">
                  {booking._id.slice(-10).toUpperCase()}
                </p>
                <button
                  onClick={handleCopyId}
                  className="shrink-0 rounded-lg border border-luxe-border px-2 py-0.5 text-[10px] font-semibold text-luxe-muted transition hover:border-luxe-bronze hover:text-luxe-bronze"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="my-6 h-px bg-luxe-border" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-full border border-luxe-border px-6 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
            >
              🖨️ Print Receipt
            </button>
            {(booking.status === "completed" || booking.status === "confirmed") &&
              booking.room?._id && (
                <Link
                  to={`/room/${booking.room._id}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-full bg-luxe-bronze px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-luxe-bronze/20 transition hover:bg-luxe-charcoal"
                >
                  🔁 Book This Again
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const BookingHistory = () => {
  const [bookings, setBookings]         = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedBooking ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedBooking]);

  const handleCancel = useCallback(
    async (id, e) => {
      e.stopPropagation();
      if (!window.confirm("Are you sure you want to cancel this booking?")) return;
      try {
        await updateBookingStatus(id, { status: "cancelled" });
        fetchBookings();
      } catch {
        alert("Failed to cancel booking. Please try again.");
      }
    },
    [fetchBookings]
  );

  // Stats
  const stats = useMemo(() => ({
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  // Filtered + sorted bookings
  const filteredBookings = useMemo(() => {
    const searchStr = debouncedSearch.toLowerCase();
    return [...bookings]
      .filter((b) => {
        const matchesSearch =
          (b.room?.title?.toLowerCase() || "").includes(searchStr) ||
          (b.status?.toLowerCase() || "").includes(searchStr) ||
          b._id.toLowerCase().includes(searchStr);
        const matchesStatus =
          statusFilter === "all" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const diff = new Date(b.checkIn) - new Date(a.checkIn);
        if (diff !== 0) return diff;
        return new Date(b.checkOut) - new Date(a.checkOut);
      })
      .slice(0, 10);
  }, [bookings, debouncedSearch, statusFilter]);

  if (loading) return <Loader />;

  return (
    <>
      {/* ── Dark Hero Header ─────────────────────────────────────────────── */}
      <div className="border-b border-white/5 bg-[linear-gradient(135deg,#171412_0%,#1c1c1c_60%,#22211f_100%)] px-4 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.45em] text-luxe-bronze">
            Your Journey
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            My Stays
          </h1>
          <p className="mt-3 text-sm text-white/55">
            Every adventure, preserved. Review and manage your bookings.
          </p>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by room name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/8 py-3 pl-11 pr-4 text-sm text-white placeholder-white/35 outline-none transition focus:border-luxe-bronze focus:bg-white/12 focus:ring-4 focus:ring-luxe-bronze/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition text-lg"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 lg:px-8">

        {/* Stats Cards */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[24px] border border-luxe-border bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-luxe-charcoal">{stats.total}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-luxe-muted">Total</p>
            </div>
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-700">{stats.confirmed}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Confirmed</p>
            </div>
            <div className="rounded-[24px] border border-amber-100 bg-amber-50 px-5 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Pending</p>
            </div>
            <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-rose-700">{stats.cancelled}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Cancelled</p>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
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

        {/* Bookings Grid */}
        {filteredBookings.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => {
              const nights = getNights(booking.checkIn, booking.checkOut);
              const daysLeft = getDaysRemaining(booking.checkIn);

              return (
                <article
                  key={booking._id}
                  onClick={() => setSelectedBooking(booking)}
                  className="group cursor-pointer overflow-hidden rounded-[24px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(28,28,28,0.12)]"
                >
                  {/* Image with gradient overlay */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        booking.room?.images?.[0]
                          ? getImageUrl(booking.room.images[0])
                          : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"
                      }
                      alt={booking.room?.title || "Room"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Status badge */}
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] ${
                        STATUS_STYLES[booking.status] || "bg-white text-luxe-charcoal"
                      }`}
                    >
                      {STATUS_ICONS[booking.status]} {booking.status}
                    </span>

                    {/* Days remaining badge */}
                    {booking.status === "confirmed" && daysLeft !== null && daysLeft > 0 && (
                      <span className="absolute right-4 top-4 rounded-full bg-luxe-charcoal/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                        {daysLeft}d away
                      </span>
                    )}

                    {/* "View Details" hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-luxe-charcoal shadow-lg backdrop-blur-sm">
                        View Details →
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-2xl leading-none">
                          {booking.room?.title || "Unknown Room"}
                        </h3>
                        <p className="mt-1.5 text-sm text-luxe-muted">
                          {capitalize(booking.room?.type)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-luxe-bronze">
                          Rs. {booking.totalPrice?.toLocaleString("en-IN")}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-widest text-luxe-muted">
                          Booking
                        </p>
                      </div>
                    </div>

                    {nights > 0 && (
                      <p className="mt-3 text-sm font-semibold text-luxe-bronze">
                        🌙 {nights} night{nights !== 1 ? "s" : ""}
                      </p>
                    )}

                    {/* Stay Progress Timeline */}
                    <StayTimeline
                      checkIn={booking.checkIn}
                      checkOut={booking.checkOut}
                      status={booking.status}
                    />

                    <div className="my-4 h-px bg-luxe-border" />

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Check-in</p>
                        <p className="mt-1.5 text-sm font-semibold">{formatDate(booking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">Check-out</p>
                        <p className="mt-1.5 text-sm font-semibold">{formatDate(booking.checkOut)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={(e) => handleCancel(booking._id, e)}
                          className="flex-1 rounded-full border border-rose-200 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      )}
                      {(booking.status === "completed" || booking.status === "confirmed") &&
                        booking.room?._id && (
                          <Link
                            to={`/room/${booking.room._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 rounded-full border border-luxe-border py-2.5 text-center text-sm font-semibold text-luxe-charcoal transition hover:border-luxe-bronze hover:text-luxe-bronze"
                          >
                            🔁 Book Again
                          </Link>
                        )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
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

      {/* ── Booking Passport Modal ──────────────────────────────────────── */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
};

export default BookingHistory;