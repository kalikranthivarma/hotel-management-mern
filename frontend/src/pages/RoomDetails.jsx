import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoomById } from "../api/roomApi";
import BookingForm from "../components/BookingForm";
import Loader from "../components/Loader";
import "../styles/RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(id);
        setRoom(data.room);
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <Loader />;
  if (!room) return <div className="error-page">Room not found</div>;

  const images = room.images && room.images.length > 0 
    ? room.images 
    : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"];

  return (
    <div className="room-details-page">
      <div className="room-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/rooms">Rooms</Link> / <span>{room.title}</span>
        </nav>

        <div className="room-grid">
          {/* Left: Content */}
          <main className="room-content">
            <h1 className="room-title">{room.title}</h1>
            <div className="room-meta-top">
              <span className="room-type">{room.type}</span>
              <span className="room-guests">✦ Up to {room.maxGuests} Guests</span>
              <span className="room-floor">✦ Floor {room.floor}</span>
            </div>

            {/* Gallery */}
            <section className="room-gallery">
              <div className="main-image">
                <img src={images[activeImg]} alt={room.title} />
              </div>
              <div className="thumbnail-strip">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumb ${idx === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="room-section">
              <h2 className="section-title">Description</h2>
              <p className="description-text">{room.description}</p>
            </section>

            {/* Amenities */}
            <section className="room-section">
              <h2 className="section-title">Amenities</h2>
              <div className="amenities-grid">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="amenity-item">
                    <span className="icon">✦</span> {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Details */}
            <section className="room-section">
              <h2 className="section-title">Room Details</h2>
              <div className="details-table">
                <div className="detail-row">
                  <span>Room Size</span>
                  <span>{room.size} sq. ft.</span>
                </div>
                <div className="detail-row">
                  <span>Bed Type</span>
                  <span>{room.bedType}</span>
                </div>
                <div className="detail-row">
                  <span>View</span>
                  <span>{room.view}</span>
                </div>
              </div>
            </section>
          </main>

          {/* Right: Booking Card (Sticky) */}
          <aside className="room-sidebar">
            <BookingForm roomId={room._id} pricePerNight={room.pricePerNight} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
