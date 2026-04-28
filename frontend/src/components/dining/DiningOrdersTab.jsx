import { memo, useCallback, useMemo } from "react";

const getStatusClass = (status, statusStyles) =>
  statusStyles[status] || "bg-white text-luxe-charcoal";

const OrderCard = memo(function OrderCard({
  canCancelOrder,
  formatCurrency,
  handleCancelOrder,
  order,
  statusStyles,
}) {
  const formattedDate = useMemo(
    () => new Date(order.createdAt).toLocaleDateString(),
    [order.createdAt],
  );

  const orderStatusClass = useMemo(
    () => getStatusClass(order.status, statusStyles),
    [order.status, statusStyles],
  );

  const canCancel = useMemo(() => canCancelOrder(order), [canCancelOrder, order]);

  const onCancel = useCallback(() => {
    handleCancelOrder(order._id);
  }, [handleCancelOrder, order._id]);

  return (
    <div className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-luxe-charcoal">{order.orderType}</p>
          <p className="text-sm text-luxe-muted">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClass}`}
          >
            {order.status}
          </span>
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 text-sm text-luxe-muted">
        {order.items?.length} item
        {order.items?.length > 1 ? "s" : ""} • {formatCurrency(order.totalAmount)}
      </div>
    </div>
  );
});

const ReservationCard = memo(function ReservationCard({
  canCancelReservation,
  handleCancelReservation,
  reservation,
  statusStyles,
}) {
  const formattedDate = useMemo(
    () => new Date(reservation.reservationTime).toLocaleDateString(),
    [reservation.reservationTime],
  );

  const formattedTime = useMemo(
    () => {
      const startTime = new Date(reservation.reservationTime);
      const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
      const startStr = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endStr = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${startStr} - ${endStr} (4h slot)`;
    },
    [reservation.reservationTime],
  );

  const reservationStatusClass = useMemo(
    () => getStatusClass(reservation.status, statusStyles),
    [reservation.status, statusStyles],
  );

  const canCancel = useMemo(
    () => canCancelReservation(reservation),
    [canCancelReservation, reservation],
  );

  const onCancel = useCallback(() => {
    handleCancelReservation(reservation._id);
  }, [handleCancelReservation, reservation._id]);

  return (
    <div className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-luxe-charcoal">
            Table {reservation.tableNumber}
          </p>
          <p className="text-sm text-luxe-muted">{formattedDate}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${reservationStatusClass}`}
          >
            {reservation.status}
          </span>
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 text-sm text-luxe-muted">
        {reservation.guestsCount} guests • {formattedTime}
      </div>
    </div>
  );
});

function DiningOrdersTab({
  canCancelOrder,
  canCancelReservation,
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
  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const sortedReservations = useMemo(
    () =>
      [...reservations].sort(
        (a, b) =>
          new Date(b.createdAt || b.reservationTime) -
          new Date(a.createdAt || a.reservationTime),
      ),
    [reservations],
  );

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
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    canCancelOrder={canCancelOrder}
                    formatCurrency={formatCurrency}
                    handleCancelOrder={handleCancelOrder}
                    order={order}
                    statusStyles={statusStyles}
                  />
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                  No orders yet
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl">Table Reservations</h3>
              {sortedReservations.length > 0 ? (
                sortedReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation._id}
                    canCancelReservation={canCancelReservation}
                    handleCancelReservation={handleCancelReservation}
                    reservation={reservation}
                    statusStyles={statusStyles}
                  />
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

export default memo(DiningOrdersTab);
