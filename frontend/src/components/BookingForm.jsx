import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";

const BookingForm = ({ roomId, pricePerNight }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [dates, setDates] = useState({
    checkInDate: "",
    checkOutDate: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (dates.checkInDate && dates.checkOutDate) {
      const start = new Date(dates.checkInDate);
      const end = new Date(dates.checkOutDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setTotalPrice(nights * pricePerNight);
        setError("");
      } else {
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
    <div className="booking-card">
      <div className="booking-card__header">
        <span className="price">₹{pricePerNight}</span>
        <span className="unit">/ night</span>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="checkInDate">CHECK-IN</label>
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            required
            min={new Date().toISOString().split("T")[0]}
            value={dates.checkInDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOutDate">CHECK-OUT</label>
          <input
            type="date"
            id="checkOutDate"
            name="checkOutDate"
            required
            min={dates.checkInDate || new Date().toISOString().split("T")[0]}
            value={dates.checkOutDate}
            onChange={handleChange}
          />
        </div>

        {totalPrice > 0 && (
          <div className="booking-summary">
            <div className="summary-row">
              <span>Total Nights</span>
              <span>{totalPrice / pricePerNight}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}

        {error && <p className="booking-error">{error}</p>}
        {success && <p className="booking-success">{success}</p>}

        <button type="submit" className="booking-btn" disabled={loading}>
          {loading ? "Processing..." : user ? "Reserve Now" : "Login to Book"}
        </button>
        
        <p className="booking-note">You won't be charged yet.</p>
      </form>
    </div>
  );
};

export default BookingForm;
