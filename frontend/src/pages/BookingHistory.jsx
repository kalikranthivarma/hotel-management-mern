import { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError("Failed to fetch your bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await updateBookingStatus(id, { status: "Cancelled" });
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="rounded-[34px] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
        <h1 className="font-serif text-5xl leading-none">My Booking Journey</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-luxe-muted">
          Track your stays and manage your upcoming visits to KNSU Stays.
        </p>
      </header>

      {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {bookings.length > 0 ? (
        <div className="mt-6 space-y-5">
          {bookings.map((booking) => (
            <article key={booking._id} className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="rounded-full bg-luxe-smoke px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-luxe-charcoal">
                  {booking.status}
                </span>
                <span className="text-sm font-semibold text-luxe-bronze">Rs. {booking.totalPrice}</span>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_220px]">
                <div className="flex gap-4">
                  <img
                    src={booking.room?.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&q=80"}
                    alt=""
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{booking.room?.title || "Unknown Room"}</h3>
                    <p className="mt-1 text-sm text-luxe-muted">{booking.room?.type}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Check-in</span>
                    <p className="mt-2 font-semibold">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Check-out</span>
                    <p className="mt-2 font-semibold">{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  {booking.status === "Pending" && (
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
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
          <h3 className="font-serif text-3xl">No bookings found</h3>
          <p className="mt-3 text-luxe-muted">Your future adventures await. Explore our rooms to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
