import { useEffect, useState } from "react";
import { getAllRooms } from "../api/roomApi";
import RoomCard from "../components/RoomCard";
import Loader from "../components/Loader";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none transition focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/10";

// Get today and tomorrow in YYYY-MM-DD format for default/min values
const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
  });
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [datesActive, setDatesActive] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [filters, datesActive, dates]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      // Only send dates if both are set and dates mode is active
      if (datesActive && dates.checkIn && dates.checkOut) {
        params.checkIn = dates.checkIn;
        params.checkOut = dates.checkOut;
      }
      const data = await getAllRooms(params);
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-enable date filtering as soon as both dates are filled
      if (updated.checkIn && updated.checkOut) setDatesActive(true);
      return updated;
    });
  };

  const handleReset = () => {
    setFilters({ type: "", minPrice: "", maxPrice: "" });
    setDates({ checkIn: "", checkOut: "" });
    setDatesActive(false);
  };

  const availableCount = datesActive ? rooms.filter((r) => !r.isBookedForDates).length : null;

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden border-b border-luxe-border bg-luxe-charcoal px-4 py-16 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,176,138,0.28),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">Our Collection</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none sm:text-6xl">Elegant stays, timeless comfort</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Discover our curated selection of premium rooms and suites, designed to provide the ideal hospitality experience.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="h-fit rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h2 className="font-serif text-2xl">Filter By</h2>

          {/* ── Availability Date Picker ── */}
          <div className="mt-6 rounded-2xl border border-luxe-border bg-luxe-smoke p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-luxe-bronze">Check Availability</p>
            <p className="mt-1 text-xs text-luxe-muted">Select dates to see which rooms are free</p>

            <div className="mt-3">
              <label className="text-sm font-semibold text-luxe-charcoal">Check-in</label>
              <input
                type="date"
                name="checkIn"
                min={today}
                value={dates.checkIn}
                onChange={handleDateChange}
                className={inputClass}
              />
            </div>

            <div className="mt-3">
              <label className="text-sm font-semibold text-luxe-charcoal">Check-out</label>
              <input
                type="date"
                name="checkOut"
                min={dates.checkIn || tomorrow}
                value={dates.checkOut}
                onChange={handleDateChange}
                className={inputClass}
              />
            </div>

            {datesActive && (
              <>
                {availableCount !== null && (
                  <p className="mt-3 text-center text-sm font-semibold text-emerald-600">
                    {availableCount} room{availableCount !== 1 ? "s" : ""} available for your dates
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => { setDates({ checkIn: "", checkOut: "" }); setDatesActive(false); }}
                  className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-100"
                >
                  ✕ Clear Dates
                </button>
              </>
            )}
          </div>

          {/* ── Room Type ── */}
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

          {/* ── Price Range ── */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-luxe-charcoal">Price Range</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className={inputClass.replace("mt-2 ", "")} />
              <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className={inputClass.replace("mt-2 ", "")} />
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-2xl border border-luxe-border px-4 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
            onClick={handleReset}
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
                <RoomCard key={room._id} room={room} datesActive={datesActive} />
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
