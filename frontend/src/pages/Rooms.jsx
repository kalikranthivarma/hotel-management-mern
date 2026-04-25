import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllRooms } from "../api/roomApi";
import RoomCard from "../components/RoomCard";
import Loader from "../components/Loader";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none transition focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/10";

// Get today and tomorrow in YYYY-MM-DD format for default/min values
const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const ESTIMATED_CARD_HEIGHT = 520;
const OVERSCAN_ROWS = 1;

// Suggestion 6 — Sort options
const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    minGuests: "", // Suggestion 7 — Guest count filter
  });
  const [sortBy, setSortBy] = useState("featured"); // Suggestion 6
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [datesActive, setDatesActive] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [virtualRange, setVirtualRange] = useState({ startRow: 0, endRow: 0 });
  const listContainerRef = useRef(null);
  const debouncedFilters = useDebouncedValue(filters);
  const debouncedDates = useDebouncedValue(dates);

  const fetchRooms = useCallback(async (params) => {
    try {
      setLoading(true);
      const data = await getAllRooms(params);
      setRooms(Array.isArray(data?.rooms) ? data.rooms : []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestParams = useMemo(() => {
    const params = {
      ...(debouncedFilters.type && { type: debouncedFilters.type }),
      ...(debouncedFilters.minPrice && { minPrice: debouncedFilters.minPrice }),
      ...(debouncedFilters.maxPrice && { maxPrice: debouncedFilters.maxPrice }),
      // Suggestion 7 — send minGuests as maxGuests param (backend filters rooms with capacity >= value)
      ...(debouncedFilters.minGuests && { maxGuests: debouncedFilters.minGuests }),
    };

    // Only send dates if both are set and dates mode is active
    if (datesActive && debouncedDates.checkIn && debouncedDates.checkOut) {
      params.checkIn = debouncedDates.checkIn;
      params.checkOut = debouncedDates.checkOut;
    }

    return params;
  }, [datesActive, debouncedDates, debouncedFilters]);

  useEffect(() => {
    fetchRooms(requestParams);
  }, [fetchRooms, requestParams]);

  // Suggestion 6 — Client-side sort after fetch
  const sortedRooms = useMemo(() => {
    const copy = [...rooms];
    if (sortBy === "price-asc") return copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === "price-desc") return copy.sort((a, b) => b.pricePerNight - a.pricePerNight);
    return copy; // "featured" keeps server order (isFeatured desc, pricePerNight asc)
  }, [rooms, sortBy]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((e) => {
    const { name, value } = e.target;
    setDates((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-enable date filtering as soon as both dates are filled
      if (updated.checkIn && updated.checkOut) {
        setDatesActive(true);
      }
      return updated;
    });
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ type: "", minPrice: "", maxPrice: "", minGuests: "" });
    setDates({ checkIn: "", checkOut: "" });
    setDatesActive(false);
    setSortBy("featured");
  }, []);

  const clearDates = useCallback(() => {
    setDates({ checkIn: "", checkOut: "" });
    setDatesActive(false);
  }, []);

  // Suggestion 5 — Clear a single filter by key
  const clearFilter = useCallback(
    (key) => {
      if (key === "dates") {
        clearDates();
      } else {
        setFilters((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [clearDates]
  );

  // Suggestion 5 — Build active filter chips array
  const activeChips = useMemo(() => {
    const typeLabels = {
      single: "Single",
      double: "Double",
      suite: "Suite",
      deluxe: "Deluxe",
    };
    const chips = [];
    if (filters.type)
      chips.push({ key: "type", label: `Type: ${typeLabels[filters.type] ?? filters.type}` });
    if (filters.minPrice)
      chips.push({
        key: "minPrice",
        label: `Min: Rs.${Number(filters.minPrice).toLocaleString("en-IN")}`,
      });
    if (filters.maxPrice)
      chips.push({
        key: "maxPrice",
        label: `Max: Rs.${Number(filters.maxPrice).toLocaleString("en-IN")}`,
      });
    if (filters.minGuests)
      chips.push({ key: "minGuests", label: `Guests ≥ ${filters.minGuests}` });
    if (datesActive)
      chips.push({ key: "dates", label: `${dates.checkIn} → ${dates.checkOut}` });
    return chips;
  }, [filters, datesActive, dates]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columnCount = useMemo(() => {
    if (viewportWidth >= 1280) return 3;
    if (viewportWidth >= 768) return 2;
    return 1;
  }, [viewportWidth]);

  const availableCount = useMemo(() => {
    if (!datesActive) return null;
    return sortedRooms.filter((room) => !room.isBookedForDates).length;
  }, [datesActive, sortedRooms]);

  const virtualizationEnabled = sortedRooms.length > columnCount * 6;
  const totalRows = useMemo(
    () => Math.ceil(sortedRooms.length / columnCount),
    [columnCount, sortedRooms.length]
  );

  const updateVirtualRange = useCallback(() => {
    if (!virtualizationEnabled || !listContainerRef.current) {
      setVirtualRange({ startRow: 0, endRow: totalRows });
      return;
    }

    const rect = listContainerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    const startRow = Math.max(
      0,
      Math.floor((viewportTop - containerTop) / ESTIMATED_CARD_HEIGHT) - OVERSCAN_ROWS
    );
    const endRow = Math.min(
      totalRows,
      Math.ceil((viewportBottom - containerTop) / ESTIMATED_CARD_HEIGHT) + OVERSCAN_ROWS
    );

    setVirtualRange({
      startRow,
      endRow: Math.max(startRow + 1, endRow),
    });
  }, [totalRows, virtualizationEnabled]);

  useEffect(() => {
    updateVirtualRange();

    if (!virtualizationEnabled) return undefined;

    window.addEventListener("scroll", updateVirtualRange, { passive: true });
    window.addEventListener("resize", updateVirtualRange);

    return () => {
      window.removeEventListener("scroll", updateVirtualRange);
      window.removeEventListener("resize", updateVirtualRange);
    };
  }, [updateVirtualRange, virtualizationEnabled]);

  const visibleRooms = useMemo(() => {
    if (!virtualizationEnabled) return sortedRooms;

    const startIndex = virtualRange.startRow * columnCount;
    const endIndex = virtualRange.endRow * columnCount;
    return sortedRooms.slice(startIndex, endIndex);
  }, [columnCount, sortedRooms, virtualRange.endRow, virtualRange.startRow, virtualizationEnabled]);

  const paddingTop = virtualizationEnabled
    ? virtualRange.startRow * ESTIMATED_CARD_HEIGHT
    : 0;
  const paddingBottom = virtualizationEnabled
    ? Math.max(0, (totalRows - virtualRange.endRow) * ESTIMATED_CARD_HEIGHT)
    : 0;

  const renderedRoomCards = useMemo(
    () =>
      visibleRooms.map((room) => (
        <RoomCard key={room._id} room={room} datesActive={datesActive} />
      )),
    [datesActive, visibleRooms]
  );

  return (
    <div className="pb-14">

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[300px_1fr] lg:items-start lg:px-8">
        {/* ── FILTER SIDEBAR ── */}
        <aside className="sticky top-24 rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h2 className="font-serif text-2xl">Filter By</h2>

          {/* Date availability */}
          <div className="mt-6 rounded-2xl border border-luxe-border bg-luxe-smoke p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-luxe-bronze">
              Check Availability
            </p>
            <p className="mt-1 text-xs text-luxe-muted">
              Select dates to see which rooms are free
            </p>

            <div className="mt-3">
              <label className="text-sm font-semibold text-luxe-charcoal">
                Check-in
              </label>
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
              <label className="text-sm font-semibold text-luxe-charcoal">
                Check-out
              </label>
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
                    {availableCount} room{availableCount !== 1 ? "s" : ""} available for
                    your dates
                  </p>
                )}
                <button
                  type="button"
                  onClick={clearDates}
                  className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-100"
                >
                  Clear Dates
                </button>
              </>
            )}
          </div>

          {/* Room Type */}
          <div className="mt-6">
            <label htmlFor="type" className="text-sm font-semibold text-luxe-charcoal">
              Room Type
            </label>
            <select
              name="type"
              id="type"
              value={filters.type}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">All Types</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="suite">Presidential Suite</option>
              <option value="deluxe">Deluxe Room</option>
            </select>
          </div>

          <button
            className="mt-6 w-full rounded-2xl border border-luxe-border px-4 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main>
          {/* Suggestion 6 + 5 — Sort bar and active filter chips */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {/* Sort dropdown */}
            <div className="flex items-center gap-2 rounded-2xl border border-luxe-border bg-white px-4 py-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-luxe-muted">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent text-sm font-semibold text-luxe-charcoal outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Suggestion 5 — Active filter chips */}
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="flex items-center gap-1.5 rounded-full border border-luxe-bronze/30 bg-luxe-bronze/10 px-3 py-1.5 text-xs font-semibold text-luxe-bronze"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => clearFilter(chip.key)}
                  className="ml-0.5 rounded-full leading-none text-luxe-bronze transition hover:text-luxe-charcoal"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : sortedRooms.length > 0 ? (
            <div ref={listContainerRef}>
              {paddingTop > 0 ? <div style={{ height: paddingTop }} aria-hidden="true" /> : null}
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 max-w-6xl">{renderedRoomCards}</div>
              {paddingBottom > 0 ? (
                <div style={{ height: paddingBottom }} aria-hidden="true" />
              ) : null}
            </div>
          ) : (
            // Suggestion 4 — Fixed empty state (removed duplicate h3, added icon + reset button)
            <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
              <p className="text-4xl">🔍</p>
              <h3 className="mt-4 font-serif text-3xl">No rooms found</h3>
              <p className="mt-3 text-luxe-muted">
                Try adjusting your filters or check back later.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 rounded-full bg-luxe-bronze px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
