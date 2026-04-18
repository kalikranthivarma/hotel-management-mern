import { useState, useEffect } from "react";
import { getAllRooms, deleteRoom, createRoom, updateRoom } from "../api/roomApi";
import Loader from "../components/Loader";
import "../styles/Admin.css";
import "../styles/Rooms.css";


const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    title: "", type: "", pricePerNight: "", maxPeople: "", desc: "", image: ""
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await getAllRooms();
      setRooms(data.rooms);
    } catch (err) {
      console.error(err);
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
        alert("Failed to delete room");
      }
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        title: room.title,
        type: room.type,
        pricePerNight: room.pricePerNight,
        maxPeople: room.maxPeople,
        desc: room.desc,
        image: room.image || ""
      });
    } else {
      setEditingRoom(null);
      setFormData({ title: "", type: "", pricePerNight: "", maxPeople: "", desc: "", image: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, formData);
      } else {
        await createRoom(formData);
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      alert("Error saving room");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="manage-rooms-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Property Management</h1>
            <p className="admin-subtitle">Add or modify room listings for KNSU Stays.</p>
          </div>
          <button className="add-btn" onClick={() => handleOpenModal()}>+ Add New Room</button>
        </header>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>
                    <img src={room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50"} alt={room.title} className="thumb" />
                  </td>
                  <td><strong>{room.title}</strong></td>
                  <td>{room.type}</td>
                  <td>₹{room.pricePerNight}</td>
                  <td>{room.maxPeople} Guests</td>
                  <td className="actions-cell">
                    <button className="edit-link" onClick={() => handleOpenModal(room)}>Edit</button>
                    <button className="delete-link" onClick={() => handleDelete(room._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingRoom ? "Edit Room" : "Add New Room"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                      <option value="">Select Type</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Suite">Suite</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price per Night</label>
                    <input type="number" value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Max People</label>
                    <input type="number" value={formData.maxPeople} onChange={e => setFormData({...formData, maxPeople: e.target.value})} required />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required />
                  </div>
                  <div className="form-group full">
                    <label>Image URL</label>
                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="save-btn">{editingRoom ? "Update Room" : "Save Room"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;