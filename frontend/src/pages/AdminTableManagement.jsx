import React, { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import {
  createDiningTable,
  deleteDiningTable,
  getDiningTables,
  updateDiningTable,
} from "../api/diningApi";
import Loader from "../components/Loader";

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const STATUS_CONFIG = {
  Available: {
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    bar:   "bg-emerald-500",
    dot:   "bg-emerald-500",
    ring:  "ring-2 ring-emerald-100",
  },
  Reserved: {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    bar:   "bg-amber-500",
    dot:   "bg-amber-500",
    ring:  "ring-2 ring-amber-100",
  },
  Occupied: {
    badge: "bg-rose-100 text-rose-700 border border-rose-200",
    bar:   "bg-rose-500",
    dot:   "bg-rose-500",
    ring:  "ring-2 ring-rose-100",
  },
};

const LOCATION_ICONS = {
  "Indoor":       "🏠",
  "Outdoor":      "🌿",
  "Rooftop":      "🌆",
  "Balcony":      "🌅",
  "Private Room": "🔒",
};

const LOCATION_OPTIONS      = ["Indoor", "Outdoor", "Rooftop", "Balcony", "Private Room"];
const STATUS_FILTER_OPTIONS = ["All", "Available", "Reserved", "Occupied"];

const emptyFormData = {
  tableNumber: "",
  capacity: 2,
  location: "Indoor",
  status: "Available",
};

// ── TableCard ─────────────────────────────────────────────────────────────────
const TableCard = React.memo(({ table, onEdit, onDelete }) => {
  const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.Available;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[28px] border border-luxe-border bg-white shadow-[0_8px_30px_rgba(28,28,28,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(28,28,28,0.12)] hover:${cfg.ring}`}
    >
      <div className={`h-1 w-full ${cfg.bar}`} />

      <div className="flex flex-1 flex-col p-5">

        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-luxe-border bg-luxe-smoke text-base font-bold text-luxe-charcoal shadow-sm">
            {table.tableNumber}
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${cfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {table.status}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xl">{LOCATION_ICONS[table.location] || "📍"}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-luxe-muted">Location</p>
            <p className="text-sm font-semibold text-luxe-charcoal">{table.location}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-luxe-muted">Capacity</p>
            <p className="text-sm font-semibold text-luxe-charcoal">{table.capacity} guests</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-luxe-smoke">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
              style={{ width: `${Math.min(100, (table.capacity / 20) * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-luxe-muted">
            {table.capacity} / 20
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onEdit(table)}
            className="flex-1 rounded-xl border border-luxe-border bg-white py-2.5 text-sm font-semibold text-luxe-charcoal transition hover:border-luxe-bronze hover:text-luxe-bronze"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(table._id)}
            className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
});

const TableCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-[28px] border border-luxe-border bg-white shadow-sm">
    <div className="h-1 w-full bg-luxe-smoke" />
    <div className="p-5">
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-2xl bg-luxe-smoke" />
        <div className="h-6 w-20 rounded-full bg-luxe-smoke" />
      </div>
      <div className="mt-4 h-10 w-full bg-luxe-smoke rounded" />
      <div className="mt-3 h-10 w-full bg-luxe-smoke rounded" />
      <div className="mt-4 h-1.5 w-full bg-luxe-smoke rounded-full" />
      <div className="mt-5 flex gap-2">
        <div className="h-10 flex-1 bg-luxe-smoke rounded-xl" />
        <div className="h-10 w-16 bg-luxe-smoke rounded-xl" />
      </div>
    </div>
  </div>
);

// ── TableModal ────────────────────────────────────────────────────────────────
const TableModal = ({ editingTable, formData, submitting, error, onClose, onChange, onSubmit }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-luxe-charcoal/60 px-4 pb-0 pt-4 backdrop-blur-sm sm:items-center sm:py-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-t-[32px] bg-white shadow-[0_-20px_80px_rgba(28,28,28,0.25)] sm:rounded-[32px]">

        <div className="flex items-center justify-between border-b border-luxe-border px-7 py-5">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-luxe-bronze">
              {editingTable ? "Edit Table" : "New Table"}
            </p>
            <h3 className="mt-0.5 font-serif text-2xl text-luxe-charcoal">
              {editingTable ? `Table ${editingTable.tableNumber}` : "Add a Dining Table"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-luxe-border text-luxe-muted transition hover:bg-luxe-smoke hover:text-luxe-charcoal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-7 py-6">
          <div className="space-y-5">

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-luxe-muted">
                Table Number *
              </label>
              <input
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={onChange}
                className={inputClass}
                placeholder="e.g. T01, 101, A1"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-luxe-muted">
                Capacity (Guests) *
              </label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onChange({ target: { name: "capacity", value: Math.max(1, formData.capacity - 1) } })
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-luxe-border bg-luxe-smoke text-xl font-bold transition hover:border-luxe-bronze hover:bg-luxe-bronze hover:text-white"
                >
                  −
                </button>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-2.5 text-center text-lg font-bold outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({ target: { name: "capacity", value: Math.min(20, formData.capacity + 1) } })
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-luxe-border bg-luxe-smoke text-xl font-bold transition hover:border-luxe-bronze hover:bg-luxe-bronze hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-luxe-muted">
                Location
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => onChange({ target: { name: "location", value: loc } })}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-xs font-semibold transition ${
                      formData.location === loc
                        ? "border-luxe-bronze bg-luxe-bronze/10 text-luxe-bronze"
                        : "border-luxe-border bg-luxe-smoke text-luxe-muted hover:border-luxe-bronze hover:text-luxe-bronze"
                    }`}
                  >
                    <span className="text-lg">{LOCATION_ICONS[loc]}</span>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-luxe-muted">
                Status
              </label>
              <div className="mt-2 flex gap-2">
                {["Available", "Reserved", "Occupied"].map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChange({ target: { name: "status", value: s } })}
                      className={`flex-1 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition ${
                        formData.status === s
                          ? cfg.badge
                          : "border-luxe-border bg-luxe-smoke text-luxe-muted hover:border-luxe-bronze"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              ⚠️ {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-luxe-border px-5 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-luxe-bronze/20 transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : editingTable ? "Update Table" : "Add Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminTableManagement = () => {
  const [tables, setTables]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData]         = useState(emptyFormData);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm]     = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDiningTables();
      setTables(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  const resetForm = useCallback(() => {
    setFormData(emptyFormData);
    setEditingTable(null);
    setError("");
  }, []);

  const openModal = useCallback((table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        capacity:    table.capacity,
        location:    table.location,
        status:      table.status,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value, 10) || 1 : value,
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!formData.tableNumber.trim()) { setError("Table number is required."); return; }
    if (formData.capacity < 1)        { setError("Capacity must be at least 1."); return; }
    try {
      setSubmitting(true);
      if (editingTable) {
        const res     = await updateDiningTable(editingTable._id, formData);
        const updated = res?.data;
        if (updated?._id) {
          setTables((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        }
      } else {
        const res     = await createDiningTable(formData);
        const created = res?.data;
        if (created?._id) {
          setTables((prev) => [...prev, created]);
        }
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save table:", err);
      setError(err.response?.data?.message || "Failed to save table.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = useCallback(async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table? This action cannot be undone.")) return;
    
    // Optimistic Update
    const previousTables = [...tables];
    setTables((prev) => prev.filter((t) => t._id !== tableId));

    try {
      await deleteDiningTable(tableId);
    } catch (err) {
      // Rollback
      setTables(previousTables);
      alert(err.response?.data?.message || "Failed to delete table.");
    }
  }, [tables]);

  // ✅ stats kept in code for filter counts but NO stat cards rendered
  const filteredTables = useMemo(() =>
    tables.filter((t) => {
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const q = debouncedSearchTerm.toLowerCase();
      const matchSearch = !q ||
        t.tableNumber.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }),
  [tables, statusFilter, debouncedSearchTerm]);


  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 lg:px-8">

        {/* ── Top bar ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl text-luxe-charcoal sm:text-3xl">
              Dining Tables
            </h1>
            <p className="mt-1 text-sm text-luxe-muted">
              Configure seating layout, capacity, and real-time availability.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="shrink-0 self-start rounded-full bg-luxe-bronze px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-luxe-bronze/30 transition hover:bg-luxe-charcoal sm:self-auto"
          >
            + Add New Table
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-6 max-w-sm">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxe-muted"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by table number or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-luxe-border bg-white py-3 pl-11 pr-10 text-sm text-luxe-charcoal placeholder-luxe-muted outline-none transition focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-luxe-muted transition hover:text-luxe-charcoal"
            >
              ×
            </button>
          )}
        </div>

        {/* ── Status filter tabs ── */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTER_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                statusFilter === s
                  ? "bg-luxe-charcoal text-white"
                  : "border border-luxe-border bg-white text-luxe-muted hover:border-luxe-bronze hover:text-luxe-bronze"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 opacity-60">
                  ({tables.filter((t) => t.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Page-level error ── */}
        {error && !showModal && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            ⚠️ {error}
          </div>
        )}

        {/* ── Cards grid ── */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <TableCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : filteredTables.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-16 text-center">
            <div className="text-5xl">🍽️</div>
            <h3 className="mt-4 font-serif text-2xl">
              {searchTerm || statusFilter !== "All"
                ? "No tables match your filters"
                : "No dining tables yet"}
            </h3>
            <p className="mt-2 text-sm text-luxe-muted">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter."
                : "Add your first table to configure your dining layout."}
            </p>
            {!searchTerm && statusFilter === "All" && (
              <button
                onClick={() => openModal()}
                className="mt-6 rounded-full bg-luxe-bronze px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-luxe-bronze/20 transition hover:bg-luxe-charcoal"
              >
                Add First Table
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <TableModal
          editingTable={editingTable}
          formData={formData}
          submitting={submitting}
          error={error}
          onClose={closeModal}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default AdminTableManagement;