import { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";
import "../styles/BookingHistory.css"; // Reuse similar styles

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
      fetchBookings(); // Refresh
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="booking-history-page admin-bookings">
      <div className="history-container">
        <header className="history-header">
          <h1 className="title">Global Booking Management</h1>
          <p className="subtitle">Oversee all reservation requests across KNSU Stays.</p>
        </header>

        {error && <div className="error-box">{error}</div>}

        <div className="bookings-list">
          {bookings.map((booking) => (
            <article key={booking._id} className="booking-item">
              <div className="booking-status-tag" data-status={booking.status}>
                {booking.status}
              </div>
              
              <div className="booking-info-grid">
                <div className="info-section user-details">
                  <span className="label">GUEST</span>
                  <h3>{booking.user?.firstName} {booking.user?.lastName}</h3>
                  <p className="user-email">{booking.user?.email}</p>
                </div>

                <div className="info-section room-details">
                  <span className="label">ROOM</span>
                  <h3>{booking.room?.title}</h3>
                  <p className="room-type">{booking.room?.type}</p>
                </div>

                <div className="info-section dates">
                   <div className="date-block">
                    <span className="label">STAY DATES</span>
                    <span className="val">
                      {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="info-section actions">
                  {booking.status === "Pending" && (
                    <div className="admin-actions-btns">
                      <button 
                        className="confirm-btn" 
                        onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                      >
                        Confirm
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;