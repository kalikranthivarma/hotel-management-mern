import { useEffect, useState } from "react";
import { getAllDiningOrders, updateDiningOrderStatus } from "../api/diningApi";
import Loader from "../components/Loader";

const statusOptions = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Served",
  "Completed",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Preparing: "bg-sky-100 text-sky-700",
  "Out for Delivery": "bg-indigo-100 text-indigo-700",
  Served: "bg-emerald-100 text-emerald-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const paymentStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Failed: "bg-rose-100 text-rose-700",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const AdminDiningOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllDiningOrders();
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dining orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateDiningOrderStatus(id, { status });
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update dining order status.");
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="rounded-[34px] bg-luxe-charcoal px-6 py-8 text-white shadow-[0_18px_60px_rgba(28,28,28,0.14)]">
        <h1 className="font-serif text-5xl leading-none">Dining Orders</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
          Review incoming food orders and update kitchen or service status from one place.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {orders.length > 0 ? (
        <div className="mt-6 space-y-5">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[order.status] || "bg-luxe-smoke text-luxe-charcoal"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        paymentStyles[order.paymentStatus] || "bg-luxe-smoke text-luxe-charcoal"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-3xl">
                    {order.orderType} - {formatCurrency(order.totalAmount)}
                  </h2>
                  <p className="mt-2 text-sm text-luxe-muted">
                    {order.user?.firstName} {order.user?.lastName} - {order.user?.email}
                  </p>
                  <p className="mt-1 text-sm text-luxe-muted">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm text-luxe-muted">
                    {order.roomNumber
                      ? `Room ${order.roomNumber}`
                      : order.tableNumber
                        ? `Table ${order.tableNumber}`
                        : "No location attached"}
                  </p>
                </div>

                <div className="w-full max-w-xs">
                  <label className="text-sm font-semibold text-luxe-charcoal">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className="mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10 disabled:cursor-not-allowed"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] bg-luxe-smoke p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-luxe-muted">Items</p>
                <div className="mt-3 space-y-2 text-sm text-luxe-charcoal">
                  {order.items?.map((item, index) => (
                    <p key={`${order._id}-${item.menuItem || index}`}>
                      {item.quantity} x {item.name} - {formatCurrency(item.price * item.quantity)}
                    </p>
                  ))}
                </div>
                {order.specialInstructions ? (
                  <p className="mt-4 text-sm text-luxe-muted">
                    Special instructions: {order.specialInstructions}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
          <h3 className="font-serif text-3xl">No dining orders found</h3>
          <p className="mt-3 text-luxe-muted">New dining requests will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDiningOrders;
