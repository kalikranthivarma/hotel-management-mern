const getStatusClass = (status, statusStyles) =>
  statusStyles[status] || "bg-white text-luxe-charcoal";

export default function DiningOrdersTab({
  canCancelOrder,
  formatCurrency,
  handleCancelOrder,
  handleCancelReservation,
  isAdmin,
  loadingProtectedData,
  orders,
  reservations,
  statusStyles,
  user,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
        <h2 className="font-serif text-2xl">My Dining History</h2>
        <p className="mt-2 text-luxe-muted">
          Track your orders and reservations
        </p>
      </div>

      {user && !isAdmin ? (
        loadingProtectedData ? (
          <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            Loading dining history...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-serif text-xl">Recent Orders</h3>
              {orders.length > 0 ? (
                orders.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-luxe-charcoal">
                          {order.orderType}
                        </p>
                        <p className="text-sm text-luxe-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status,
                            statusStyles,
                          )}`}
                        >
                          {order.status}
                        </span>
                        {canCancelOrder(order) && (
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order._id)}
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-luxe-muted">
                      {order.items?.length} item
                      {order.items?.length > 1 ? "s" : ""} •{" "}
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                  No orders yet
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl">Table Reservations</h3>
              {reservations.length > 0 ? (
                [...reservations]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || b.reservationTime) -
                      new Date(a.createdAt || a.reservationTime),
                  )
                  .map((reservation) => (
                    <div
                      key={reservation._id}
                      className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-luxe-charcoal">
                            Table {reservation.tableNumber}
                          </p>
                          <p className="text-sm text-luxe-muted">
                            {new Date(
                              reservation.reservationTime,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              reservation.status,
                              statusStyles,
                            )}`}
                          >
                            {reservation.status}
                          </span>
                          {(reservation.status === "Pending" ||
                            reservation.status === "Reserved" ||
                            reservation.status === "Confirmed") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelReservation(reservation._id)
                                }
                                className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-luxe-muted">
                        {reservation.guestsCount} guests •{" "}
                        {new Date(reservation.reservationTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                  No reservations yet
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
          {user
            ? "Admin users don't have guest dining history."
            : "Please log in to view your dining history."}
        </div>
      )}
    </div>
  );
}