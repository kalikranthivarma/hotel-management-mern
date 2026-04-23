import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

// Suggestion 3 — Amenity icon mapping
const amenityIcons = {
  wifi: "📶",
  "wi-fi": "📶",
  internet: "📶",
  ac: "❄️",
  "air conditioning": "❄️",
  "air-conditioning": "❄️",
  tv: "📺",
  television: "📺",
  pool: "🏊",
  "swimming pool": "🏊",
  gym: "🏋️",
  fitness: "🏋️",
  spa: "💆",
  parking: "🚗",
  breakfast: "🍳",
  minibar: "🍷",
  bar: "🍷",
  balcony: "🌅",
  jacuzzi: "🛁",
  bathtub: "🛁",
  safe: "🔒",
  locker: "🔒",
  laundry: "👕",
};

const getAmenityIcon = (amenity) => {
  const key = amenity.toLowerCase();
  for (const [keyword, icon] of Object.entries(amenityIcons)) {
    if (key.includes(keyword)) return icon;
  }
  return "✦";
};

const RoomCard = ({ room, datesActive }) => {
  const { _id, title, type, pricePerNight, images, description, amenities, maxGuests, isBookedForDates } = room;

  const displayImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80";

  const isBooked = datesActive && isBookedForDates;
  const isAvailable = datesActive && !isBookedForDates;

  // Suggestion 1 — Capitalize room type badge
  const capitalizedType = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : type;

  // Suggestion 2 — Indian locale price formatting (e.g. Rs. 5,000)
  const formattedPrice = pricePerNight?.toLocaleString("en-IN");

  // Suggestion 8 — Smart button label based on date state
  const buttonLabel = isAvailable ? "Book Now →" : "Explore Room";

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(28,28,28,0.12)] ${
        isBooked
          ? "border-rose-200 opacity-75"
          : "border-luxe-border"
      }`}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Suggestion 1 — Capitalized room type badge */}
        <div className="absolute left-4 top-4 rounded-full bg-luxe-charcoal/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
          {capitalizedType}
        </div>

        {/* Availability badge — only shown when dates are selected */}
        {datesActive && (
          <div
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
              isBooked
                ? "bg-rose-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {isBooked ? "Booked" : "Available"}
          </div>
        )}

        {/* Overlay for booked rooms */}
        {isBooked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-rose-600">
              Not available for selected dates
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-luxe-charcoal">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-luxe-muted">
              {description?.length > 100 ? `${description.substring(0, 100)}...` : description}
            </p>
          </div>

          {/* Suggestion 2 — Formatted price with Indian locale */}
          <p className="shrink-0 text-right">
            <span className="block text-xl font-semibold text-luxe-bronze">
              Rs. {formattedPrice}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-luxe-muted">per night</span>
          </p>
        </div>

        {/* Suggestion 3 — Amenity icons in pills */}
        <div className="flex flex-wrap gap-2">
          {amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="rounded-full border border-luxe-border bg-luxe-smoke px-3 py-1 text-xs font-medium text-luxe-charcoal"
            >
              {getAmenityIcon(amenity)} {amenity}
            </span>
          ))}
          {amenities?.length > 3 && (
            <span className="rounded-full border border-luxe-border px-3 py-1 text-xs font-medium text-luxe-muted">
              +{amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-luxe-border pt-5">
          <p className="text-sm font-medium text-luxe-muted">Up to {maxGuests} guests</p>

          {/* Suggestion 8 — Smart button label */}
          {isBooked ? (
            <span className="cursor-not-allowed rounded-full bg-luxe-muted/30 px-5 py-2.5 text-sm font-semibold text-luxe-muted">
              Unavailable
            </span>
          ) : (
            <Link
              to={`/room/${_id}`}
              className="rounded-full bg-luxe-bronze px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;


