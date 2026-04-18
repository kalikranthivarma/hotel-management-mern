import { useState, useEffect } from "react";
import { getAllRooms } from "../api/roomApi";
import RoomCard from "../components/RoomCard";
import Loader from "../components/Loader";
import "../styles/Rooms.css";

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
      setRooms(data.rooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <div className="rooms-hero__content">
          <p className="eyebrow">✦ Our Collection</p>
          <h1 className="title">Elegant Stays, Timeless Comfort</h1>
          <p className="subtitle">
            Discover our curated selection of premium rooms and suites, designed to provide the
            ultimate experience in luxury hospitality.
          </p>
        </div>
      </section>

      <div className="rooms-container">
        {/* Filters Sidebar */}
        <aside className="rooms-filters">
          <h2 className="filters-title">Filter By</h2>
          
          <div className="filter-group">
            <label htmlFor="type">Room Type</label>
            <select name="type" id="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Room</option>
              <option value="Suite">Presidential Suite</option>
              <option value="Deluxe">Deluxe Room</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (₹)</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button className="clear-filters" onClick={() => setFilters({ type: "", minPrice: "", maxPrice: "" })}>
            Reset Filters
          </button>
        </aside>

        {/* Rooms Grid */}
        <main className="rooms-main">
          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="no-rooms">
              <h3>No rooms found matching your criteria.</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
