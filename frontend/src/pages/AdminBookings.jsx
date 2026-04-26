import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredBookings = (bookings || [])
  .filter((booking) => {
    const searchStr = searchTerm.toLowerCase();
    const guestName =
      `${booking.user?.firstName} ${booking.user?.lastName}`.toLowerCase();
    const roomTitle = booking.room?.title?.toLowerCase() || "";
    const status = booking.status.toLowerCase();

    return (
      guestName.includes(searchStr) ||
      roomTitle.includes(searchStr) ||
      status.includes(searchStr) ||
      booking.user?.email?.toLowerCase().includes(searchStr)
    );
  })
  .sort(
    (a, b) =>
      new Date(b.checkIn || 0).getTime() -
      new Date(a.checkIn || 0).getTime()
  );

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="flex flex-col justify-between gap-6 rounded-[34px] bg-luxe-charcoal px-6 py-8 text-white shadow-[0_18px_60px_rgba(28,28,28,0.14)] lg:flex-row lg:items-end">
        <div>
          <h1 className="font-serif text-5xl leading-none">Global Bookings</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
            Oversee all reservation requests across KNSU Stays.
          </p>
        </div>
        <div className="relative w-full lg:max-w-xs">
           <input
             type="text"
             placeholder="Search bookings..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-luxe-bronze focus:bg-white/10 focus:ring-4 focus:ring-luxe-bronze/20"
           />
           <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-5">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <article key={booking._id} className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-luxe-smoke text-luxe-charcoal'}`}>
                  {booking.status}
                </span>
                <span className="text-sm font-semibold text-luxe-bronze">Booking #{booking._id.slice(-6)}</span>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Guest</span>
                  <h3 className="mt-2 text-xl font-semibold">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </h3>
                  <p className="mt-1 break-all text-sm text-luxe-muted">{booking.user?.email}</p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Room</span>
                  <h3 className="mt-2 text-xl font-semibold">{booking.room?.title}</h3>
                  <p className="mt-1 text-sm text-luxe-muted">{booking.room?.type}</p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-luxe-muted">Stay Dates</span>
                  <p className="mt-2 font-semibold">
                    {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'} to{" "}
                    {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div className="flex items-start justify-end gap-3">
                  {booking.status === "pending" && (
                    <>
                      <button
                        className="rounded-2xl bg-luxe-charcoal px-4 py-3 text-sm font-semibold text-white transition hover:bg-luxe-bronze"
                        onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                        onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
            <h3 className="font-serif text-3xl">No bookings found</h3>
            <p className="mt-3 text-luxe-muted">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
