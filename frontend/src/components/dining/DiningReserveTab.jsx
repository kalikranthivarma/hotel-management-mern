import { useEffect } from "react";
import { toast } from "react-toastify";

export default function DiningReserveTab({
  availableTables,
  handleReservationInputChange,
  handleReserveTable,
  inputClass,
  isAdmin,
  loadingProtectedData,
  reservationForm,
  reserveMessage,
  setReservationForm,
  setActiveTab,
  submittingReservation,
  user,
}) {
  useEffect(() => {
    if (reserveMessage.type === "success") {
      toast.success("Table Booked Successfully!");
      const timer = setTimeout(() => {
        setActiveTab("orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [reserveMessage, setActiveTab]);

  const handleReset = () => {
    setReservationForm({
      tableNumber: "",
      reservationTime: "",
      guestsCount: 2,
      specialRequests: "",
    });
  };

  const selectedTable = availableTables.find(
    (t) => t.tableNumber.toString() === reservationForm.tableNumber
  );
  const isOverCapacity =
    selectedTable && reservationForm.guestsCount > selectedTable.capacity;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h2 className="font-serif text-2xl">Table Availability</h2>
          <p className="mt-2 text-luxe-muted">
            Choose from our available dining tables
          </p>
        </div>

        {user && !isAdmin ? (
          loadingProtectedData ? (
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              Loading reservation data...
            </div>
          ) : availableTables.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableTables.map((table) => (
                <button
                  key={table._id}
                  type="button"
                  className={`text-left cursor-pointer rounded-[24px] border-2 p-5 transition-all ${reservationForm.tableNumber === table.tableNumber.toString()
                    ? "border-luxe-bronze bg-luxe-bronze/5 shadow-lg"
                    : "border-luxe-border bg-white hover:border-luxe-bronze/50"
                    }`}
                  onClick={() =>
                    setReservationForm((prev) => ({
                      ...prev,
                      tableNumber: table.tableNumber.toString(),
                    }))
                  }
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl">
                      Table {table.tableNumber}
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Available
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-luxe-muted">
                    {table.location}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-luxe-charcoal">
                    Capacity: {table.capacity} guests
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
              <h3 className="font-serif text-2xl">No tables available</h3>
              <p className="mt-2 text-luxe-muted">
                All tables are currently reserved. Please try again later.
              </p>
            </div>
          )
        ) : (
          <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
            {user
              ? "Admin users cannot reserve tables."
              : "Please log in to view table availability."}
          </div>
        )}
      </div>

      <div className="h-fit lg:sticky lg:top-8">
        <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h3 className="font-serif text-xl">Make Reservation</h3>
          <p className="mt-2 text-sm text-luxe-muted">
            Book your table for a special dining experience
          </p>

          {user && !isAdmin ? (
            <form className="mt-6 space-y-4" onSubmit={handleReserveTable}>
              <div>
                <label className="text-sm font-semibold text-luxe-charcoal">
                  Selected Table
                </label>
                <div className="mt-2 rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 text-sm">
                  {reservationForm.tableNumber
                    ? `Table ${reservationForm.tableNumber}`
                    : "Select a table from the list"}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-luxe-charcoal">
                  Reservation Time
                </label>
                <input
                  type="datetime-local"
                  name="reservationTime"
                  min={new Date().toISOString().slice(0, 16)}
                  value={reservationForm.reservationTime}
                  onChange={handleReservationInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-luxe-charcoal">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guestsCount"
                  min="1"
                  max="20"
                  value={reservationForm.guestsCount}
                  onChange={handleReservationInputChange}
                  className={inputClass}
                />
                {isOverCapacity && (
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    Warning: This table only accommodates up to{" "}
                    {selectedTable.capacity} guests.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-luxe-charcoal">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  rows="3"
                  value={reservationForm.specialRequests}
                  onChange={handleReservationInputChange}
                  className={inputClass}
                  placeholder="Window seat, anniversary, dietary requirements..."
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={
                    submittingReservation ||
                    !reservationForm.tableNumber ||
                    !reservationForm.reservationTime ||
                    isOverCapacity
                  }
                  className="flex-1 rounded-2xl bg-luxe-charcoal px-5 py-3 font-semibold text-white transition hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:bg-luxe-muted"
                >
                  {submittingReservation ? "Reserving..." : "Reserve Table"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl border border-luxe-border bg-white px-5 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                >
                  Clear
                </button>
              </div>

              {reserveMessage.text && (
                <div
                  className={`mt-4 rounded-xl p-5 text-sm font-medium ${reserveMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                    }`}
                >
                  <div className="flex flex-col gap-3">
                    <p>{reserveMessage.text}</p>
                    {reserveMessage.type === "success" && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        View My Bookings
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
              {user
                ? "Admin users cannot make reservations."
                : "Please log in to make a reservation."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
