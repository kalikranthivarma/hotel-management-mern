import { useEffect, useState } from "react";
import {
  createDiningTable,
  updateDiningTable,
  deleteDiningTable,
  getDiningTables,
} from "../api/diningApi";
import Loader from "../components/Loader";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const statusStyles = {
  Available: "bg-emerald-100 text-emerald-700",
  Reserved: "bg-amber-100 text-amber-700",
  Occupied: "bg-rose-100 text-rose-700",
};

const locationOptions = ["Indoor", "Outdoor", "Rooftop", "Balcony", "Private Room"];

const AdminTableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: 2,
    location: "Indoor",
    status: "Available",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getDiningTables();
      setTables(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setError("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tableNumber: "",
      capacity: 2,
      location: "Indoor",
      status: "Available",
    });
    setEditingTable(null);
    setError("");
  };

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.tableNumber.trim()) {
      setError("Table number is required");
      return;
    }

    if (formData.capacity < 1) {
      setError("Capacity must be at least 1");
      return;
    }

    try {
      setSubmitting(true);

      if (editingTable) {
        await updateDiningTable(editingTable._id, formData);
      } else {
        await createDiningTable(formData);
      }

      await fetchTables();
      closeModal();
    } catch (err) {
      console.error("Failed to save table:", err);
      setError(err.response?.data?.message || "Failed to save table");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDiningTable(tableId);
      await fetchTables();
    } catch (err) {
      console.error("Failed to delete table:", err);
      alert(err.response?.data?.message || "Failed to delete table");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden border-b border-luxe-border bg-luxe-charcoal px-4 py-16 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,176,138,0.28),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            Admin Panel
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
            Table Management
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Manage your restaurant's dining tables - add, edit, or remove tables to optimize seating capacity.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Dining Tables</h2>
            <p className="mt-1 text-luxe-muted">Total tables: {tables.length}</p>
          </div>
          <button
            onClick={() => openModal()}
            className="rounded-full bg-luxe-bronze px-6 py-3 font-semibold text-white transition hover:bg-luxe-charcoal"
          >
            Add New Table
          </button>
        </div>

        {tables.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map((table) => (
              <div
                key={table._id}
                className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl">Table {table.tableNumber}</h3>
                    <p className="mt-1 text-sm text-luxe-muted">{table.location}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[table.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-luxe-muted">
                    Capacity: <span className="font-semibold text-luxe-charcoal">{table.capacity} guests</span>
                  </p>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => openModal(table)}
                    className="flex-1 rounded-xl border border-luxe-border px-4 py-2 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
            <div className="text-6xl">🍽️</div>
            <h3 className="mt-4 font-serif text-2xl">No tables found</h3>
            <p className="mt-2 text-luxe-muted">Add your first dining table to get started</p>
            <button
              onClick={() => openModal()}
              className="mt-6 rounded-full bg-luxe-bronze px-6 py-3 font-semibold text-white transition hover:bg-luxe-charcoal"
            >
              Add First Table
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-[30px] border border-luxe-border bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl">
                  {editingTable ? "Edit Table" : "Add New Table"}
                </h3>
                <button
                  onClick={closeModal}
                  className="rounded-full p-2 text-luxe-muted transition hover:bg-luxe-smoke"
                >
                  ✕
                </button>
              </div>

              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="e.g. T01, 101, A1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Location
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Occupied">Occupied</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-2xl border border-luxe-border px-5 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
                  >
                    {submitting ? "Saving..." : editingTable ? "Update Table" : "Add Table"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTableManagement;