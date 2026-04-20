import { useEffect, useState } from "react";
import { createRoom, deleteRoom, getAllRooms, updateRoom } from "../api/roomApi";
import Loader from "../components/Loader";

const emptyFormData = {
  roomNumber: "",
  title: "",
  type: "",
  bedType: "",
  view: "garden",
  floor: "",
  size: "",
  pricePerNight: "",
  maxGuests: "",
  description: "",
  imageUrl: "",
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(Array.isArray(data?.rooms) ? data.rooms : []);
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
        fetchRooms();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete room");
      }
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber || "",
        title: room.title || "",
        type: room.type || "",
        bedType: room.bedType || "",
        view: room.view || "garden",
        floor: room.floor ?? "",
        size: room.size ?? "",
        pricePerNight: room.pricePerNight ?? "",
        maxGuests: room.maxGuests ?? "",
        description: room.description || "",
        imageUrl: room.images?.[0] || "",
      });
    } else {
      setEditingRoom(null);
      setFormData(emptyFormData);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      roomNumber: formData.roomNumber.trim(),
      title: formData.title.trim(),
      type: String(formData.type || "").toLowerCase(),
      bedType: formData.bedType,
      view: formData.view,
      floor: Number(formData.floor),
      size: Number(formData.size),
      pricePerNight: Number(formData.pricePerNight),
      maxGuests: Number(formData.maxGuests),
      description: formData.description.trim(),
      images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      amenities: editingRoom?.amenities || [],
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, payload);
      } else {
        await createRoom(payload);
      }

      setShowModal(false);
      setEditingRoom(null);
      setFormData(emptyFormData);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving room");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[34px] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(28,28,28,0.06)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-5xl leading-none text-luxe-charcoal">Property Management</h1>
          <p className="mt-4 text-lg leading-8 text-luxe-muted">Add or modify room listings for KNSU Stays.</p>
        </div>
        <button className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal" onClick={() => handleOpenModal()}>
          + Add New Room
        </button>
      </header>

      <div className="overflow-x-auto rounded-[30px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
        <table className="min-w-full text-left">
          <thead className="border-b border-luxe-border bg-luxe-smoke text-sm uppercase tracking-[0.2em] text-luxe-muted">
            <tr>
              <th className="px-6 py-4 text-center">Room #</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-b border-luxe-border last:border-b-0 hover:bg-luxe-smoke/30 transition">
                <td className="px-6 py-4 text-center font-bold text-luxe-bronze">{room.roomNumber}</td>
                <td className="px-6 py-4">
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50"}
                    alt={room.title}
                    className="h-14 w-14 rounded-2xl object-cover shadow-sm"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-luxe-charcoal">{room.title}</td>
                <td className="px-6 py-4 text-luxe-muted uppercase text-[10px] tracking-widest font-bold">{room.type}</td>
                <td className="px-6 py-4 text-luxe-charcoal font-medium">₹ {room.pricePerNight}</td>
                <td className="px-6 py-4 text-luxe-muted">{room.maxGuests} Guests</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="rounded-full border border-luxe-border px-4 py-2 text-sm font-semibold hover:bg-luxe-charcoal hover:text-white transition" onClick={() => handleOpenModal(room)}>
                      Edit
                    </button>
                    <button className="rounded-full border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition" onClick={() => handleDelete(room._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxe-charcoal/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_30px_100px_rgba(28,28,28,0.2)] sm:p-8">
            <h2 className="font-serif text-4xl text-luxe-charcoal">{editingRoom ? "Edit Room" : "Add New Room"}</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Room Number
                  <input type="text" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Title
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Type
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required className={inputClass}>
                    <option value="">Select Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Bed Type
                  <select value={formData.bedType} onChange={(e) => setFormData({ ...formData, bedType: e.target.value })} required className={inputClass}>
                    <option value="">Select Bed Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="twin">Twin</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  View
                  <select value={formData.view} onChange={(e) => setFormData({ ...formData, view: e.target.value })} className={inputClass}>
                    <option value="garden">Garden</option>
                    <option value="pool">Pool</option>
                    <option value="city">City</option>
                    <option value="mountain">Mountain</option>
                    <option value="sea">Sea</option>
                    <option value="courtyard">Courtyard</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Price per Night
                  <input type="number" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Max Guests
                  <input type="number" value={formData.maxGuests} onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Floor
                  <input type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Size (sq ft)
                  <input type="number" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} required className={inputClass} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal md:col-span-2">
                  Description
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className={`${inputClass} min-h-32 resize-y`} />
                </label>
                <label className="block text-sm font-semibold text-luxe-charcoal md:col-span-2">
                  Image URL
                  <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." className={inputClass} />
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" className="rounded-2xl border border-luxe-border px-5 py-3 font-semibold hover:bg-luxe-smoke transition" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal">
                  {editingRoom ? "Update Room" : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
