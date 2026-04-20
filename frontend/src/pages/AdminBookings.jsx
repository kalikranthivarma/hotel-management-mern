import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError("Failed to fetch all bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      fetchBookings();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="rounded-[34px] bg-luxe-charcoal px-6 py-8 text-white shadow-[0_18px_60px_rgba(28,28,28,0.14)]">
        <h1 className="font-serif text-5xl leading-none">Global Booking Management</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
          Oversee all reservation requests across KNSU Stays.
        </p>
      </header>

      {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-5">
        {bookings.map((booking) => (
          <article key={booking._id} className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] ${
                booking.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" : 
                booking.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-luxe-smoke text-luxe-charcoal"
              }`}>
                {booking.status}
              </span>
              <span className="text-sm font-semibold text-luxe-bronze">Booking #{booking._id.slice(-6)}</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
              <div className="flex gap-5">
                <img 
                  src={booking.room?.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&q=80"} 
                  alt={booking.room?.title} 
                  className="h-20 w-24 rounded-2xl object-cover shadow-sm"
                />
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Room & Guest</span>
                  <h3 className="mt-2 text-xl font-semibold text-luxe-charcoal">{booking.room?.title || "Unknown Room"}</h3>
                  <p className="mt-1 text-sm text-luxe-muted">
                    {booking.room?.type} • <span className="font-semibold text-luxe-charcoal">{booking.user?.firstName} {booking.user?.lastName}</span>
                  </p>
                  <p className="text-xs text-luxe-muted mt-1">{booking.user?.email}</p>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Stay Dates</span>
                <p className="mt-2 font-semibold text-luxe-charcoal">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-luxe-muted">to</p>
                <p className="font-semibold text-luxe-charcoal">
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Total Amount</span>
                <p className="mt-2 text-2xl font-serif text-luxe-charcoal">₹{booking.totalAmount}</p>
              </div>

              <div className="flex items-start justify-end gap-3">
                {booking.status === "Pending" && (
                  <>
                    <button
                      className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-md hover:shadow-lg"
                      onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      className="rounded-2xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
