import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getRoomById } from "../api/roomApi";
import BookingForm from "../components/BookingForm";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/getImageUrl";

// Suggestion 4 — Amenity icon mapping (consistent with RoomCard)
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

// Suggestion 2 — Capitalize helper
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const RoomDetails = () => {
  const { id } = useParams();
  const role = useSelector((state) => state.auth.user?.role);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  // Suggestion 1 — fade transition state
  const [imgFading, setImgFading] = useState(false);
  // Suggestion 9 — mobile booking drawer state
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // ✅ Memoize images
  const images = useMemo(() => {
    return room?.images && room.images.length > 0
      ? room.images.map(getImageUrl)
      : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"];
  }, [room]);

  // ✅ Memoize role check
  const isAdmin = useMemo(() => {
    return role === "admin" || role === "superAdmin";
  }, [role]);

  // Suggestion 1 — smooth fade on thumbnail click
  const handleImageClick = useCallback(
    (idx) => {
      if (idx === activeImg) return;
      setImgFading(true);
      setTimeout(() => {
        setActiveImg(idx);
        setImgFading(false);
      }, 200);
    },
    [activeImg]
  );

  // ✅ Show only first 8 thumbnails
  const visibleImages = useMemo(() => {
    return images.slice(0, 8);
  }, [images]);

  if (loading) return <Loader />;

  // Suggestion 5 — Better "Not Found" error state
  if (!room)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-5xl">🏨</p>
        <h2 className="mt-4 font-serif text-3xl text-luxe-charcoal">Room Not Found</h2>
        <p className="mt-3 text-luxe-muted">
          This room may have been removed or the link is incorrect.
        </p>
        <Link
          to="/rooms"
          className="mt-6 inline-flex rounded-full bg-luxe-bronze px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
        >
          ← Back to Rooms
        </Link>
      </div>
    );

  return (
    // Extra bottom padding on mobile to clear the sticky booking bar
    <div className="mx-auto max-w-7xl px-4 py-10 pb-28 lg:px-8 xl:pb-14">

      {/* Suggestion 10 — Styled breadcrumb with › separators */}
      <nav
        className="mb-8 flex items-center gap-2 text-sm text-luxe-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition hover:text-luxe-bronze">
          Home
        </Link>
        <span className="text-luxe-border">›</span>
        <Link to="/rooms" className="transition hover:text-luxe-bronze">
          Rooms
        </Link>
        <span className="text-luxe-border">›</span>
        <span className="max-w-[200px] truncate font-medium text-luxe-charcoal">
          {room.title}
        </span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_400px]">
        <main className="space-y-8">

          {/* Title + badges */}
          <div>
            <h1 className="font-serif text-5xl leading-none">{room.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {/* Suggestion 2 — Capitalize type badge */}
              <span className="rounded-full bg-luxe-charcoal px-4 py-2 font-semibold uppercase tracking-[0.2em] text-white">
                {capitalize(room.type)}
              </span>
              <span className="rounded-full border border-luxe-border px-4 py-2 text-luxe-muted">
                👥 Up to {room.maxGuests} guests
              </span>
              <span className="rounded-full border border-luxe-border px-4 py-2 text-luxe-muted">
                🏢 Floor {room.floor}
              </span>
            </div>
          </div>

          {/* Image gallery */}
          <section className="overflow-hidden rounded-[32px] border border-luxe-border bg-white p-4 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            {/* Suggestion 1 — Fade transition on main image swap */}
            <div className="overflow-hidden rounded-[24px]">
              <img
                src={images[activeImg]}
                alt={room.title}
                className={`h-[420px] w-full object-cover transition-opacity duration-300 ${
                  imgFading ? "opacity-0" : "opacity-100"
                }`}
                loading="lazy"
              />
            </div>

            {/* Suggestion 8 — Horizontal scroll on mobile, grid on sm+ */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
              {visibleImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`shrink-0 overflow-hidden rounded-2xl border transition sm:shrink-0 ${
                    idx === activeImg
                      ? "border-luxe-bronze ring-2 ring-luxe-bronze/20"
                      : "border-luxe-border"
                  }`}
                  onClick={() => handleImageClick(idx)}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-24 w-24 object-cover sm:w-full"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Description</h2>
            <p className="mt-4 leading-8 text-luxe-muted">{room.description}</p>
          </section>

          {/* Suggestion 4 — Amenities with icons */}
          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Amenities</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm font-medium text-luxe-charcoal"
                >
                  {getAmenityIcon(item)} {item}
                </div>
              ))}
            </div>
          </section>

          {/* Suggestions 2 + 3 — Room Details with icons and capitalized values */}
          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Room Details</h2>
            <div className="mt-5 divide-y divide-luxe-border">
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">📐 Room Size</span>
                <span className="font-semibold">{room.size} sq. ft.</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">🛏️ Bed Type</span>
                {/* Suggestion 2 — Capitalize bed type */}
                <span className="font-semibold">{capitalize(room.bedType)}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">🌄 View</span>
                {/* Suggestion 2 — Capitalize view */}
                <span className="font-semibold">{capitalize(room.view)}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">🏢 Floor</span>
                <span className="font-semibold">{room.floor}</span>
              </div>
            </div>
          </section>
        </main>

        {/* Desktop sidebar */}
        <aside className="xl:sticky xl:top-28 xl:h-fit">
          {isAdmin ? (
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_20px_60px_rgba(28,28,28,0.08)]">
              <div className="mb-4 rounded-[24px] bg-luxe-charcoal px-5 py-4 text-white">
                <span className="block text-3xl font-semibold">
                  Rs. {room.pricePerNight?.toLocaleString("en-IN")}
                </span>
                <span className="text-sm uppercase tracking-[0.25em] text-white/70">
                  per night
                </span>
              </div>
              <h2 className="font-serif text-3xl">Staff View</h2>
              <p className="mt-4 leading-8 text-luxe-muted">
                Staff accounts can review room details here, but reservations must be made
                from a guest account.
              </p>
              <Link
                to="/admin/manage-rooms"
                className="mt-6 inline-flex rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal"
              >
                Go to Room Management
              </Link>
            </div>
          ) : (
            <BookingForm roomId={room._id} pricePerNight={room.pricePerNight} />
          )}
        </aside>
      </div>

      {/* Suggestion 9 — Mobile sticky bottom bar (hidden on xl+) */}
      {!isAdmin && (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t border-luxe-border bg-white px-5 py-4 shadow-[0_-8px_30px_rgba(28,28,28,0.08)] xl:hidden">
            <div>
              <span className="block text-xl font-bold text-luxe-charcoal">
                Rs. {room.pricePerNight?.toLocaleString("en-IN")}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-luxe-muted">
                per night
              </span>
            </div>
            <button
              onClick={() => setShowMobileBooking(true)}
              className="rounded-full bg-luxe-bronze px-6 py-2.5 font-semibold text-white transition hover:bg-luxe-charcoal"
            >
              Reserve Now
            </button>
          </div>

          {/* Mobile booking bottom drawer */}
          {showMobileBooking && (
            <div className="fixed inset-0 z-[60] flex flex-col justify-end xl:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMobileBooking(false)}
              />
              {/* Drawer panel */}
              <div className="relative max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-[0_-20px_60px_rgba(28,28,28,0.15)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-2xl">Book This Room</h3>
                  <button
                    onClick={() => setShowMobileBooking(false)}
                    className="rounded-full p-1 text-2xl leading-none text-luxe-muted transition hover:text-luxe-charcoal"
                    aria-label="Close booking panel"
                  >
                    ✕
                  </button>
                </div>
                <BookingForm roomId={room._id} pricePerNight={room.pricePerNight} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomDetails;