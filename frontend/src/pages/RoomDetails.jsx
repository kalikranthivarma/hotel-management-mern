import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getRoomById } from "../api/roomApi";
import BookingForm from "../components/BookingForm";
import Loader from "../components/Loader";

const RoomDetails = () => {
  const { id } = useParams();
  const role = useSelector((state) => state.auth.user?.role);
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
  if (!room) return <div className="px-4 py-16 text-center text-lg text-red-600">Room not found</div>;

  const images =
    room.images && room.images.length > 0
      ? room.images
      : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"];
  const isAdmin = role === "admin" || role === "superAdmin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav className="mb-8 text-sm text-luxe-muted">
        <Link to="/" className="hover:text-luxe-bronze">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/rooms" className="hover:text-luxe-bronze">
          Rooms
        </Link>{" "}
        / <span className="text-luxe-charcoal">{room.title}</span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_400px]">
        <main className="space-y-8">
          <div>
            <h1 className="font-serif text-5xl leading-none">{room.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-luxe-charcoal px-4 py-2 font-semibold uppercase tracking-[0.2em] text-white">
                {room.type}
              </span>
              <span className="rounded-full border border-luxe-border px-4 py-2 text-luxe-muted">
                Up to {room.maxGuests} guests
              </span>
              <span className="rounded-full border border-luxe-border px-4 py-2 text-luxe-muted">
                Floor {room.floor}
              </span>
            </div>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-luxe-border bg-white p-4 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <div className="overflow-hidden rounded-[24px]">
              <img src={images[activeImg]} alt={room.title} className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`overflow-hidden rounded-2xl border transition ${
                    idx === activeImg ? "border-luxe-bronze ring-2 ring-luxe-bronze/20" : "border-luxe-border"
                  }`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={img} alt="" className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Description</h2>
            <p className="mt-4 leading-8 text-luxe-muted">{room.description}</p>
          </section>

          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Amenities</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm font-medium text-luxe-charcoal">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <h2 className="font-serif text-3xl">Room Details</h2>
            <div className="mt-5 divide-y divide-luxe-border">
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">Room Size</span>
                <span className="font-semibold">{room.size} sq. ft.</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">Bed Type</span>
                <span className="font-semibold">{room.bedType}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-luxe-muted">View</span>
                <span className="font-semibold">{room.view}</span>
              </div>
            </div>
          </section>
        </main>

        <aside className="xl:sticky xl:top-28 xl:h-fit">
          {isAdmin ? (
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_20px_60px_rgba(28,28,28,0.08)]">
              <div className="mb-4 rounded-[24px] bg-luxe-charcoal px-5 py-4 text-white">
                <span className="block text-3xl font-semibold">Rs. {room.pricePerNight}</span>
                <span className="text-sm uppercase tracking-[0.25em] text-white/70">per night</span>
              </div>
              <h2 className="font-serif text-3xl">Staff View</h2>
              <p className="mt-4 leading-8 text-luxe-muted">
                Staff accounts can review room details here, but reservations must be made from a guest account.
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
    </div>
  );
};

export default RoomDetails;
