import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";
import socket from "../socket";
import { toast } from "react-toastify";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

// Helper: check if two date ranges overlap
const datesOverlap = (aIn, aOut, bIn, bOut) => {
  if (!aIn || !aOut || !bIn || !bOut) return false;
  const startA = new Date(aIn);
  const endA = new Date(aOut);
  const startB = new Date(bIn);
  const endB = new Date(bOut);
  return startA < endB && endA > startB;
};

const BookingForm = ({ roomId, pricePerNight }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";

  const [dates, setDates] = useState({
    checkInDate: "",
    checkOutDate: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dateConflictWarning, setDateConflictWarning] = useState("");

  // Refs to store current state for socket listeners to avoid re-registering
  const datesRef = useRef(dates);
  const currentLockRef = useRef(null);

  useEffect(() => {
    datesRef.current = dates;
  }, [dates]);

  // Effect 1: Handle Emitting Locks when dates change
  useEffect(() => {
    if (dates.checkInDate && dates.checkOutDate) {
      const start = new Date(dates.checkInDate);
      const end = new Date(dates.checkOutDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        setTotalPrice(nights * pricePerNight);
        setError("");

        socket.emit("lock_room", {
          roomId,
          checkIn: dates.checkInDate,
          checkOut: dates.checkOutDate,
        });
        currentLockRef.current = { checkIn: dates.checkInDate, checkOut: dates.checkOutDate };
      } else {
        setTotalPrice(0);
        setError("Check-out must be after check-in");
      }
    }
  }, [dates.checkInDate, dates.checkOutDate, pricePerNight, roomId]);

  // Effect 2: Handle Socket Listeners (Register ONCE)
  useEffect(() => {
    const handleRoomLocked = ({ roomId: lockedRoomId, checkIn, checkOut, owner }) => {
      
      // Ignore if it's our own lock or a different room
      if (lockedRoomId !== roomId || owner === socket.id) return;
      
      const myDates = datesRef.current;
      if (myDates.checkInDate && myDates.checkOutDate && datesOverlap(myDates.checkInDate, myDates.checkOutDate, checkIn, checkOut)) {
        setDateConflictWarning(`⚠️ Another guest is selecting these dates (${checkIn} → ${checkOut})`);
        toast.warning("Another guest is selecting these dates!");
      }
    };

    const handleRoomBooked = ({ roomId: bookedRoomId, checkIn, checkOut }) => {
      if (bookedRoomId !== roomId) return;
      const myDates = datesRef.current;
      if (myDates.checkInDate && myDates.checkOutDate && datesOverlap(myDates.checkInDate, myDates.checkOutDate, checkIn, checkOut)) {
        toast.error("This room was just booked for these dates!");
        setError("This room was just booked for these dates. Please select different dates.");
        setDateConflictWarning("");
      }
    };

    const handleCurrentLocks = (locks) => {
      const lock = locks[roomId];
      if (lock) {
        const myDates = datesRef.current;
        if (myDates.checkInDate && myDates.checkOutDate && datesOverlap(myDates.checkInDate, myDates.checkOutDate, lock.checkIn, lock.checkOut)) {
          setDateConflictWarning(`⚠️ Another guest is currently selecting these dates.`);
        }
      }
    };

    const handleSocketError = (msg) => {
      if (msg.includes("Another guest")) {
        toast.error(msg);
        setError(msg);
        setDateConflictWarning("");
      }
    };

    socket.on("room_locked", handleRoomLocked);
    socket.on("room_booked", handleRoomBooked);
    socket.on("current_locks", handleCurrentLocks);
    socket.on("error", handleSocketError);

    socket.emit('get_locks');

    return () => {
      socket.emit("unlock_room", roomId);
      socket.off("room_locked", handleRoomLocked);
      socket.off("room_booked", handleRoomBooked);
      socket.off("current_locks", handleCurrentLocks);
      socket.off("error", handleSocketError);
    };
  }, [roomId]);

  const handleChange = (e) => {
    setError("");
    setDateConflictWarning("");
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      setError("Staff accounts cannot create bookings.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createBooking({ room: roomId, ...dates });
      socket.emit("unlock_room", roomId);
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
      <div className="mb-6 rounded-[24px] bg-luxe-charcoal px-5 py-4 text-white">
        <span className="block text-3xl font-semibold">Rs. {pricePerNight}</span>
        <span className="text-sm uppercase tracking-[0.25em] text-white/70">per night</span>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-luxe-muted">
          Check-in
          <input
            type="date"
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
            name="checkOutDate"
            required
            min={dates.checkInDate || new Date().toISOString().split("T")[0]}
            value={dates.checkOutDate}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        {totalPrice > 0 && (
          <div className="rounded-[24px] bg-luxe-smoke p-4">
            <div className="flex items-center justify-between text-sm text-luxe-muted">
              <span>Total nights</span>
              <span>{Math.round(totalPrice / pricePerNight)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-luxe-border pt-3 font-semibold text-luxe-charcoal">
              <span>Total amount</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>
        )}

        {dateConflictWarning && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {dateConflictWarning}
          </p>
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
          className="w-full rounded-2xl bg-luxe-bronze px-5 py-3.5 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading || isAdmin || (error && error.includes("Another guest"))}
        >
          {loading ? "Processing..." : isAdmin ? "Staff Cannot Book" : (error && error.includes("Another guest")) ? "Dates Locked" : user ? "Reserve Now" : "Login to Book"}
        </button>

        <p className="text-center text-sm text-luxe-muted">
          {isAdmin ? "Switch to a guest account." : "You will not be charged yet."}
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
