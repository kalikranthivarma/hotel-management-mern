import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  bookDiningTable,
  createDiningOrder,
  getDiningTables,
  getMenuItems,
  getMyDiningOrders,
} from "../api/diningApi";
import api from "../api/axios";

const categories = [
  "All",
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Chef Specials",
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-white px-4 py-3 outline-none transition focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/10";

const badgeStyles = {
  Veg: "bg-emerald-100 text-emerald-700",
  "Non-Veg": "bg-rose-100 text-rose-700",
  Vegan: "bg-lime-100 text-lime-700",
  "Gluten-Free": "bg-sky-100 text-sky-700",
  Spicy: "bg-amber-100 text-amber-700",
};

const statusStyles = {
  Available: "bg-emerald-100 text-emerald-700",
  Reserved: "bg-amber-100 text-amber-700",
  Occupied: "bg-rose-100 text-rose-700",
  Pending: "bg-amber-100 text-amber-700",
  Preparing: "bg-sky-100 text-sky-700",
  "Out for Delivery": "bg-indigo-100 text-indigo-700",
  Served: "bg-emerald-100 text-emerald-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "";
  return `${baseUrl}${imagePath}`;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function Dining() {
  const { user } = useSelector((state) => state.auth);

  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingProtectedData, setLoadingProtectedData] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("order");
  const [orderForm, setOrderForm] = useState({
    orderType: "Room Service",
    roomNumber: "",
    tableNumber: "",
    paymentMethod: "Cash",
    specialInstructions: "",
  });
  const [reservationForm, setReservationForm] = useState({
    tableNumber: "",
    reservationTime: "",
    guestsCount: 2,
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "Available"),
    [tables],
  );

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoadingMenu(true);
        setMenuError("");

        const response = await getMenuItems(
          selectedCategory === "All" ? {} : { category: selectedCategory },
        );

        setMenuItems(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuError(error.response?.data?.message || "Unable to load the menu right now.");
        setMenuItems([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    loadMenu();
  }, [selectedCategory]);

  useEffect(() => {
    if (!user) {
      setTables([]);
      setOrders([]);
      return;
    }

    const loadProtectedData = async () => {
      try {
        setLoadingProtectedData(true);
        const [tablesResponse, ordersResponse] = await Promise.all([
          getDiningTables(),
          getMyDiningOrders(),
        ]);

        setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
        setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
      } catch (error) {
        console.error("Failed to fetch dining data:", error);
      } finally {
        setLoadingProtectedData(false);
      }
    };

    loadProtectedData();
  }, [user]);

  const updateCart = (menuItem, delta) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === menuItem._id);

      if (!existing && delta > 0) {
        return [...prev, { ...menuItem, quantity: 1 }];
      }

      return prev
        .map((item) =>
          item._id === menuItem._id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    setOrderForm((prev) => ({
      ...prev,
      roomNumber: "",
      tableNumber: "",
      specialInstructions: "",
    }));
  };

  const handleOrderInputChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "orderType" && value === "Room Service" ? { tableNumber: "" } : {}),
      ...(name === "orderType" && value === "In-Restaurant" ? { roomNumber: "" } : {}),
    }));
  };

  const handleReservationInputChange = (event) => {
    const { name, value } = event.target;
    setReservationForm((prev) => ({
      ...prev,
      [name]: name === "guestsCount" ? Number(value) : value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setPageMessage("");

    if (!user) {
      setPageMessage("Please log in to place a dining order.");
      return;
    }

    if (cart.length === 0) {
      setPageMessage("Add at least one menu item before placing an order.");
      return;
    }

    if (orderForm.orderType === "Room Service" && !orderForm.roomNumber.trim()) {
      setPageMessage("Room number is required for room service.");
      return;
    }

    if (orderForm.orderType === "In-Restaurant" && !orderForm.tableNumber.trim()) {
      setPageMessage("Table number is required for in-restaurant orders.");
      return;
    }

    try {
      setSubmittingOrder(true);

      await createDiningOrder({
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        orderType: orderForm.orderType,
        roomNumber: orderForm.orderType === "Room Service" ? orderForm.roomNumber : undefined,
        tableNumber:
          orderForm.orderType === "In-Restaurant" ? orderForm.tableNumber : undefined,
        paymentMethod: orderForm.paymentMethod,
        specialInstructions: orderForm.specialInstructions,
      });

      setPageMessage("Dining order placed successfully.");
      clearCart();

      const ordersResponse = await getMyDiningOrders();
      setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
    } catch (error) {
      console.error("Failed to place dining order:", error);
      setPageMessage(error.response?.data?.message || "Unable to place the order right now.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReserveTable = async (event) => {
    event.preventDefault();
    setPageMessage("");

    if (!user) {
      setPageMessage("Please log in to reserve a table.");
      return;
    }

    try {
      setSubmittingReservation(true);

      await bookDiningTable({
        tableNumber: reservationForm.tableNumber,
        reservationTime: reservationForm.reservationTime,
        guestsCount: reservationForm.guestsCount,
      });

      setPageMessage(`Table ${reservationForm.tableNumber} reserved successfully.`);
      setReservationForm({
        tableNumber: "",
        reservationTime: "",
        guestsCount: 2,
      });

      const tablesResponse = await getDiningTables();
      setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
    } catch (error) {
      console.error("Failed to reserve table:", error);
      setPageMessage(error.response?.data?.message || "Unable to reserve the table right now.");
    } finally {
      setSubmittingReservation(false);
    }
  };

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden border-b border-luxe-border bg-luxe-charcoal px-4 py-14 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,176,138,0.26),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            Dining
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
            Menu, orders, and table reservations
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            This page is built around the current dining backend: menu items, order placement,
            table booking, and your dining history.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {pageMessage ? (
          <div className="mb-6 rounded-2xl border border-luxe-border bg-white px-4 py-3 text-sm shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            {pageMessage}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <section className="rounded-[30px] border border-luxe-border bg-white p-5 shadow-[0_18px_50px_rgba(28,28,28,0.06)] sm:p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">
                    Menu
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-none sm:text-4xl">
                    Browse by category
                  </h2>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        selectedCategory === category
                          ? "bg-luxe-charcoal text-white"
                          : "border border-luxe-border bg-luxe-smoke text-luxe-charcoal"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {loadingMenu ? (
              <Loader />
            ) : menuError ? (
              <div className="mt-6 rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-3xl">Menu unavailable</h3>
                <p className="mt-3 text-luxe-muted">{menuError}</p>
              </div>
            ) : menuItems.length > 0 ? (
              <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {menuItems.map((item) => {
                  const cartItem = cart.find((entry) => entry._id === item._id);

                  return (
                    <article
                      key={item._id}
                      className="overflow-hidden rounded-[28px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)]"
                    >
                      <div className="relative h-52 sm:h-56">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        {item.isSignatureDish ? (
                          <span className="absolute left-3 top-3 rounded-full bg-luxe-charcoal/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            Signature
                          </span>
                        ) : null}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-bronze">
                              {item.category}
                            </p>
                            <h3 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
                              {item.name}
                            </h3>
                          </div>
                          <p className="shrink-0 text-base font-semibold text-luxe-charcoal sm:text-lg">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-luxe-muted sm:min-h-16">
                          {item.description || "Freshly prepared and served with KNSU dining care."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(item.dietaryInfo || []).map((diet) => (
                            <span
                              key={`${item._id}-${diet}`}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                badgeStyles[diet] || "bg-luxe-smoke text-luxe-charcoal"
                              }`}
                            >
                              {diet}
                            </span>
                          ))}
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.isAvailable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center self-start rounded-full border border-luxe-border bg-luxe-smoke p-1">
                            <button
                              type="button"
                              onClick={() => updateCart(item, -1)}
                              className="h-10 w-10 rounded-full text-lg text-luxe-charcoal transition hover:bg-white"
                            >
                              -
                            </button>
                            <span className="min-w-10 text-center text-sm font-semibold">
                              {cartItem?.quantity || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCart(item, 1)}
                              disabled={!item.isAvailable}
                              className="h-10 w-10 rounded-full text-lg text-luxe-charcoal transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateCart(item, 1)}
                            disabled={!item.isAvailable}
                            className="w-full rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted sm:w-auto"
                          >
                            Add to order
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <div className="mt-6 rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-3xl">No dishes found</h3>
                <p className="mt-3 text-luxe-muted">No menu items are available in this category.</p>
              </div>
            )}

            <section className="mt-8 rounded-[30px] border border-luxe-border bg-white p-5 shadow-[0_18px_50px_rgba(28,28,28,0.06)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">
                    Dining Tables
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-none sm:text-4xl">
                    Availability
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-7 text-luxe-muted">
                  This section uses the protected `GET /api/dining/tables` backend endpoint.
                </p>
              </div>

              {user ? (
                loadingProtectedData ? (
                  <Loader />
                ) : tables.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tables.map((table) => (
                      <div
                        key={table._id}
                        className="rounded-[24px] border border-luxe-border bg-luxe-smoke p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-serif text-2xl">Table {table.tableNumber}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[table.status] || "bg-white text-luxe-charcoal"
                            }`}
                          >
                            {table.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-luxe-muted">{table.location}</p>
                        <p className="mt-2 text-sm font-semibold text-luxe-charcoal">
                          Capacity: {table.capacity}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-10 text-center text-luxe-muted">
                    No dining tables found.
                  </div>
                )
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-10 text-center text-luxe-muted">
                  Log in to view table availability and reserve a table.
                </div>
              )}
            </section>

            <section className="mt-8 rounded-[30px] border border-luxe-border bg-white p-5 shadow-[0_18px_50px_rgba(28,28,28,0.06)] sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">
                My Orders
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-none sm:text-4xl">
                Recent dining history
              </h2>

              {user ? (
                loadingProtectedData ? (
                  <Loader />
                ) : orders.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <article
                        key={order._id}
                        className="rounded-[24px] border border-luxe-border bg-luxe-smoke p-4 sm:p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-luxe-charcoal">
                              {order.orderType}
                            </p>
                            <p className="mt-1 text-sm text-luxe-muted">
                              {new Date(order.createdAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[order.status] || "bg-white text-luxe-charcoal"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-luxe-charcoal">
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-luxe-muted">
                          {order.items?.map((item, index) => (
                            <p key={`${order._id}-${item.menuItem || index}`}>
                              {item.quantity} x {item.name} -{" "}
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-luxe-border pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-luxe-muted">
                            {order.roomNumber
                              ? `Room ${order.roomNumber}`
                              : order.tableNumber
                                ? `Table ${order.tableNumber}`
                                : "Dining order"}
                          </p>
                          <p className="font-semibold text-luxe-charcoal">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-10 text-center text-luxe-muted">
                    No dining orders yet.
                  </div>
                )
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-10 text-center text-luxe-muted">
                  Log in to see your dining orders.
                </div>
              )}
            </section>
          </main>

          <aside className="min-w-0 xl:sticky xl:top-28 xl:h-fit">
            <div className="rounded-[30px] border border-luxe-border bg-white p-5 shadow-[0_18px_50px_rgba(28,28,28,0.06)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between xl:flex-col xl:gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">
                    Dining Actions
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-none">Order or reserve</h2>
                </div>
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 sm:text-right xl:text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-luxe-muted">Total</p>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 rounded-full bg-luxe-smoke p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("order")}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "order"
                      ? "bg-white text-luxe-charcoal shadow-sm"
                      : "text-luxe-muted"
                  }`}
                >
                  Order
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("reserve")}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "reserve"
                      ? "bg-white text-luxe-charcoal shadow-sm"
                      : "text-luxe-muted"
                  }`}
                >
                  Reserve
                </button>
              </div>

              {activeTab === "order" ? (
                <form className="mt-6" onSubmit={handlePlaceOrder}>
                  <div className="space-y-3">
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col gap-3 rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-luxe-muted">
                              {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateCart(item, -item.quantity)}
                            className="self-start text-sm font-semibold text-luxe-bronze"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-sm text-luxe-muted">
                        Add menu items to create an order.
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label htmlFor="orderType" className="text-sm font-semibold text-luxe-charcoal">
                      Order Type
                    </label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={orderForm.orderType}
                      onChange={handleOrderInputChange}
                      className={inputClass}
                    >
                      <option value="Room Service">Room Service</option>
                      <option value="In-Restaurant">In-Restaurant</option>
                    </select>
                  </div>

                  {orderForm.orderType === "Room Service" ? (
                    <div className="mt-4">
                      <label htmlFor="roomNumber" className="text-sm font-semibold text-luxe-charcoal">
                        Room Number
                      </label>
                      <input
                        id="roomNumber"
                        name="roomNumber"
                        type="text"
                        value={orderForm.roomNumber}
                        onChange={handleOrderInputChange}
                        className={inputClass}
                        placeholder="Eg. 1204"
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <label htmlFor="tableNumber" className="text-sm font-semibold text-luxe-charcoal">
                        Table Number
                      </label>
                      <select
                        id="tableNumber"
                        name="tableNumber"
                        value={orderForm.tableNumber}
                        onChange={handleOrderInputChange}
                        className={inputClass}
                      >
                        <option value="">Select a table</option>
                        {tables.map((table) => (
                          <option key={table._id} value={table.tableNumber}>
                            Table {table.tableNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-4">
                    <label htmlFor="paymentMethod" className="text-sm font-semibold text-luxe-charcoal">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={orderForm.paymentMethod}
                      onChange={handleOrderInputChange}
                      className={inputClass}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="specialInstructions"
                      className="text-sm font-semibold text-luxe-charcoal"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows="4"
                      value={orderForm.specialInstructions}
                      onChange={handleOrderInputChange}
                      className={inputClass}
                      placeholder="Optional notes for the kitchen or service team"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={submittingOrder}
                      className="flex-1 rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
                    >
                      {submittingOrder ? "Placing order..." : "Place order"}
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-2xl border border-luxe-border px-5 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                    >
                      Clear
                    </button>
                  </div>

                  {!user ? (
                    <p className="mt-4 text-sm text-luxe-muted">
                      <Link to="/login" className="font-semibold text-luxe-bronze">
                        Log in
                      </Link>{" "}
                      to place a dining order.
                    </p>
                  ) : null}
                </form>
              ) : (
                <form className="mt-6" onSubmit={handleReserveTable}>
                  <div>
                    <label
                      htmlFor="reserveTableNumber"
                      className="text-sm font-semibold text-luxe-charcoal"
                    >
                      Table Number
                    </label>
                    <select
                      id="reserveTableNumber"
                      name="tableNumber"
                      value={reservationForm.tableNumber}
                      onChange={handleReservationInputChange}
                      className={inputClass}
                    >
                      <option value="">Choose a table</option>
                      {availableTables.map((table) => (
                        <option key={table._id} value={table.tableNumber}>
                          Table {table.tableNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="reservationTime"
                      className="text-sm font-semibold text-luxe-charcoal"
                    >
                      Reservation Time
                    </label>
                    <input
                      id="reservationTime"
                      name="reservationTime"
                      type="datetime-local"
                      value={reservationForm.reservationTime}
                      onChange={handleReservationInputChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="guestsCount" className="text-sm font-semibold text-luxe-charcoal">
                      Guests
                    </label>
                    <input
                      id="guestsCount"
                      name="guestsCount"
                      type="number"
                      min="1"
                      value={reservationForm.guestsCount}
                      onChange={handleReservationInputChange}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReservation}
                    className="mt-6 w-full rounded-2xl bg-luxe-charcoal px-5 py-3 font-semibold text-white transition hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:bg-luxe-muted"
                  >
                    {submittingReservation ? "Reserving..." : "Reserve table"}
                  </button>

                  {!user ? (
                    <p className="mt-4 text-sm text-luxe-muted">
                      <Link to="/login" className="font-semibold text-luxe-bronze">
                        Log in
                      </Link>{" "}
                      to reserve a table.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
