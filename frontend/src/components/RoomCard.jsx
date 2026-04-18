import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  const { _id, title, type, pricePerNight, images, description, amenities, maxGuests } = room;

  // Use the first image or a placeholder
  const displayImage = images && images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80";

  return (
    <article className="room-card">
      <div className="room-card__img-wrap">
        <img src={displayImage} alt={title} className="room-card__img" loading="lazy" />
        <div className="room-card__badge">{type}</div>
      </div>
      <div className="room-card__body">
        <div className="room-card__header">
          <h3 className="room-card__title">{title}</h3>
          <p className="room-card__price">
            <span className="amount">₹{pricePerNight}</span>
            <span className="unit">/ night</span>
          </p>
        </div>
        
        <p className="room-card__desc">
          {description?.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>

        <div className="room-card__amenities">
          {amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">✦ {amenity}</span>
          ))}
          {amenities?.length > 3 && <span className="amenity-more">+{amenities.length - 3} more</span>}
        </div>

        <div className="room-card__footer">
          <div className="room-card__guests">
            <span className="icon">👥</span> Up to {maxGuests} Guests
          </div>
          <Link to={`/room/${_id}`} className="room-card__cta">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;