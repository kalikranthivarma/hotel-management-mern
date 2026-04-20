import { useEffect, useState } from "react";
import { getAllRooms } from "../api/roomApi";
import RoomCard from "../components/RoomCard";
import Loader from "../components/Loader";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none transition focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/10";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms(filters);
      setRooms(Array.isArray(data?.rooms) ? data.rooms : []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden border-b border-luxe-border bg-luxe-charcoal px-4 py-16 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,176,138,0.28),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">Our Collection</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none sm:text-6xl">Elegant stays, timeless comfort</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Discover our curated selection of premium rooms and suites, designed to provide the
            ideal hospitality experience.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="h-fit rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h2 className="font-serif text-2xl">Filter By</h2>

          <div className="mt-6">
            <label htmlFor="type" className="text-sm font-semibold text-luxe-charcoal">
              Room Type
            </label>
            <select name="type" id="type" value={filters.type} onChange={handleFilterChange} className={inputClass}>
              <option value="">All Types</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Room</option>
              <option value="Suite">Presidential Suite</option>
              <option value="Deluxe">Deluxe Room</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-luxe-charcoal">Price Range</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className={inputClass.replace("mt-2 ", "")} />
              <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className={inputClass.replace("mt-2 ", "")} />
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-2xl border border-luxe-border px-4 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
            onClick={() => setFilters({ type: "", minPrice: "", maxPrice: "" })}
          >
            Reset Filters
          </button>
        </aside>

        <main>
          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
              <h3 className="font-serif text-3xl">No rooms found</h3>
              <p className="mt-3 text-luxe-muted">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
