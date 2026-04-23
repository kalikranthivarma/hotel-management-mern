import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const BookingForm = ({ roomId, pricePerNight }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";

  const [dates, setDates] = useState({
    checkInDate: "",
    checkOutDate: "",
  });
  // Suggestion 7 — store nights as its own variable
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (dates.checkInDate && dates.checkOutDate) {
      const start = new Date(dates.checkInDate);
      const end = new Date(dates.checkOutDate);
      // Suggestion 7 — clean night count calculation
      const nightCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (nightCount > 0) {
        setNights(nightCount);
        setTotalPrice(nightCount * pricePerNight);
        setError("");
      } else {
        setNights(0);
        setTotalPrice(0);
        setError("Check-out must be after check-in");
      }
    }
  }, [dates, pricePerNight]);

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      setError("Staff accounts cannot create bookings. Please use a guest account to book a room.");
      return;
    }

    if (totalPrice <= 0) {
      setError("Please select valid dates");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createBooking({
        room: roomId,
        ...dates,
      });
      setSuccess("Booking requested successfully!");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_20px_60px_rgba(28,28,28,0.08)]">
      {/* Suggestion 6 — Formatted price with Indian locale */}
      <div className="mb-6 rounded-[24px] bg-luxe-charcoal px-5 py-4 text-white">
        <span className="block text-3xl font-semibold">
          Rs. {pricePerNight?.toLocaleString("en-IN")}
        </span>
        <span className="text-sm uppercase tracking-[0.25em] text-white/70">per night</span>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-luxe-muted">
          Check-in
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            required
            min={new Date().toISOString().split("T")[0]}
            value={dates.checkInDate}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-luxe-muted">
          Check-out
          <input
            type="date"
            id="checkOutDate"
            name="checkOutDate"
            required
            min={dates.checkInDate || new Date().toISOString().split("T")[0]}
            value={dates.checkOutDate}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        {/* Suggestion 7 — Clear breakdown: nights × price = total */}
        {totalPrice > 0 && (
          <div className="rounded-[24px] bg-luxe-smoke p-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-luxe-muted">
              <span>🌙 Nights</span>
              <span className="font-medium text-luxe-charcoal">{nights}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-luxe-muted">
              <span>Price per night</span>
              {/* Suggestion 6 — formatted per-night price */}
              <span>Rs. {pricePerNight?.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between border-t border-luxe-border pt-3 font-semibold text-luxe-charcoal">
              <span>Total amount</span>
              {/* Suggestion 6 — formatted total */}
              <span>Rs. {totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-luxe-bronze px-5 py-3.5 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-wait disabled:opacity-70"
          disabled={loading || isAdmin}
        >
          {loading
            ? "Processing..."
            : isAdmin
            ? "Staff Cannot Book"
            : user
            ? "Reserve Now"
            : "Login to Book"}
        </button>

        <p className="text-center text-sm text-luxe-muted">
          {isAdmin
            ? "Switch to a guest account to make a reservation."
            : "You will not be charged yet."}
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
