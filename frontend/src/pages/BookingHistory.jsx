import { useState, useEffect } from "react";
import { getMyBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/Loader";
import "../styles/BookingHistory.css";

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
      fetchBookings(); // Refresh list
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="booking-history-page">
      <div className="history-container">
        <header className="history-header">
          <h1 className="title">My Booking Journey</h1>
          <p className="subtitle">Track your stays and manage your upcoming visits to KNSU Stays.</p>
        </header>

        {error && <div className="error-box">{error}</div>}

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <article key={booking._id} className="booking-item">
                <div className="booking-status-tag" data-status={booking.status}>
                  {booking.status}
                </div>
                
                <div className="booking-info-grid">
                  <div className="info-section room-details">
                    <img 
                      src={booking.room?.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&q=80"} 
                      alt="" 
                      className="room-thumb"
                    />
                    <div>
                      <h3>{booking.room?.title || "Unknown Room"}</h3>
                      <p className="room-type">{booking.room?.type}</p>
                    </div>
                  </div>

                  <div className="info-section dates">
                    <div className="date-block">
                      <span className="label">CHECK-IN</span>
                      <span className="val">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="date-block">
                      <span className="label">CHECK-OUT</span>
                      <span className="val">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="info-section pricing">
                    <span className="label">TOTAL AMOUNT</span>
                    <span className="amount">₹{booking.totalAmount}</span>
                  </div>

                  <div className="info-section actions">
                    {booking.status === "Pending" && (
                      <button 
                        className="cancel-btn" 
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
          <div className="empty-history">
            <h3>No bookings found.</h3>
            <p>Your future adventures await! Explore our rooms to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;