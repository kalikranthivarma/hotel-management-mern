import React, { useCallback, useEffect, useState } from "react";
import {
  getAllDiningReservations,
  updateDiningReservationStatus,
} from "../api/diningApi";

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Completed"];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
  Completed: "bg-luxe-smoke text-luxe-charcoal",
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white disabled:cursor-not-allowed";

const getStatusClass = (status) =>
  statusStyles[status] || "bg-luxe-smoke text-luxe-charcoal";

const ReservationCard = React.memo(({ reservation, updatingId, onChange }) => {
  const isUpdating = updatingId === reservation._id;

  return (
    <article className="group flex flex-col rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)] transition hover:border-luxe-bronze/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxe-bronze">
            Table {reservation.tableNumber}
          </p>
          <h2 className="mt-1 font-serif text-3xl">
            {reservation.user?.firstName} {reservation.user?.lastName}
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClass(
            reservation.status,
          )}`}
        >
          {reservation.status}
        </span>
      </div>

      <div className="mt-6 space-y-3 border-y border-luxe-border/50 py-5">
        <div className="flex items-center gap-3 text-sm text-luxe-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-luxe-smoke text-luxe-charcoal">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {new Date(reservation.reservationTime).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div className="flex items-center gap-3 text-sm text-luxe-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-luxe-smoke text-luxe-charcoal">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          {reservation.guestsCount} Guests
        </div>
        <div className="flex items-center gap-3 text-sm text-luxe-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-luxe-smoke text-luxe-charcoal">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {reservation.user?.email}
        </div>
      </div>

      {reservation.specialRequests ? (
        <div className="mt-4 rounded-2xl bg-luxe-smoke p-4 text-sm italic text-luxe-muted">
          "{reservation.specialRequests}"
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted">
          Update Status
        </label>
        <select
          value={reservation.status}
          onChange={(event) => onChange(reservation._id, event.target.value)}
          disabled={isUpdating}
          className={inputClass}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
});

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllDiningReservations();
      setReservations(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dining reservations.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = useCallback(async (id, status) => {
    try {
      setUpdatingId(id);
      await updateDiningReservationStatus(id, { status });
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === id ? { ...reservation, status } : reservation,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update reservation status.");
    } finally {
      setUpdatingId("");
    }
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-[30px] bg-luxe-smoke" />
          <div className="h-40 animate-pulse rounded-[30px] bg-luxe-smoke" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="rounded-[34px] bg-black px-6 py-8 text-white">
        <h1 className="text-3xl font-bold leading-none sm:text-4xl lg:text-5xl">
          Table Reservations
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
          Manage guest table bookings, confirm arrivals, or handle cancellations.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              updatingId={updatingId}
              onChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="col-span-full rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
            <h3 className="font-serif text-3xl">No reservations found</h3>
            <p className="mt-3 text-luxe-muted">
              New table bookings will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
