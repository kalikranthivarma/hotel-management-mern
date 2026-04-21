import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; 
import Loader from "../components/Loader";
import {
  bookDiningTable,
  cancelDiningOrder,
  createDiningOrder,
  getDiningTables,
  getMyDiningOrders,
  getMyDiningReservations,
} from "../api/diningApi";
import { getMenuItems } from "../api/menuApi";
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
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';

  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingProtectedData, setLoadingProtectedData] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [dietaryFilters, setDietaryFilters] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
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
    specialRequests: "",
  });
  const [reservations, setReservations] = useState([]);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [orderMessage, setOrderMessage] = useState({ text: "", type: "" });
  const [reserveMessage, setReserveMessage] = useState({ text: "", type: "" });

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );  //runs only when cart changes

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "Available"),
    [tables],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredMenuItems = useMemo(() => {
    const search = debouncedSearch.toLowerCase();

    return menuItems.filter((item) => {
      if (
        search &&
        !item.name.toLowerCase().includes(search) &&
        !item.description?.toLowerCase().includes(search)
      ) {
        return false;
      }

      if (
        dietaryFilters.length &&
        !dietaryFilters.every((filter) =>
          item.dietaryInfo?.includes(filter)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [menuItems, debouncedSearch, dietaryFilters]);

  const cartMap = useMemo(() => {
    const map = new Map();
    cart.forEach((item) => map.set(item._id, item));
    return map;
  }, [cart]);

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
    if (!user || isAdmin) {
      setTables([]);
      setOrders([]);
      return;
    }

    const loadProtectedData = async () => {
      try {
        setLoadingProtectedData(true);
        const [tablesResponse, ordersResponse, reservationsResponse] = await Promise.all([
          getDiningTables(),
          getMyDiningOrders(),
          getMyDiningReservations(),
        ]);

        setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
        setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
        setReservations(Array.isArray(reservationsResponse?.data) ? reservationsResponse.data : []);
      } catch (error) {
        console.error("Failed to fetch dining data:", error);
      } finally {
        setLoadingProtectedData(false);
      }
    };

    loadProtectedData();
  }, [user, isAdmin]);

  const updateCart = useCallback((menuItem, delta) => {
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
  }, []);

  const clearCart = () => {
    setCart([]);
    setOrderForm((prev) => ({
      ...prev,
      roomNumber: "",
      tableNumber: "",
      specialInstructions: "",
    }));
  };

  const handleOrderInputChange = (event) => {  //Function triggered when any order form input changes
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
    setOrderMessage({ text: "", type: "" });

    if (!user) {
      setOrderMessage({ text: "Please log in to place a dining order.", type: "error" });
      return;
    }

    if (cart.length === 0) {
      setOrderMessage({ text: "Add at least one menu item before placing an order.", type: "error" });
      return;
    }

    if (orderForm.orderType === "Room Service" && !orderForm.roomNumber.trim()) {
      setOrderMessage({ text: "Room number is required for room service.", type: "error" });
      return;
    }

    if (orderForm.orderType === "In-Restaurant" && !orderForm.tableNumber.trim()) {
      setOrderMessage({ text: "Table number is required for in-restaurant orders.", type: "error" });
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

      setOrderMessage({ text: "Dining order placed successfully.", type: "success" });
      clearCart();

      const ordersResponse = await getMyDiningOrders();
      setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
    } catch (error) {
      console.error("Failed to place dining order:", error);
      setOrderMessage({ text: error.response?.data?.message || "Unable to place the order right now.", type: "error" });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReserveTable = async (event) => {
    event.preventDefault();
    setReserveMessage({ text: "", type: "" });

    if (!user) {
      setReserveMessage({ text: "Please log in to reserve a table.", type: "error" });
      return;
    }

    if (!reservationForm.tableNumber) {
      setReserveMessage({ text: "Please select a table.", type: "error" });
      return;
    }

    if (!reservationForm.reservationTime) {
      setReserveMessage({ text: "Please select a reservation time.", type: "error" });
      return;
    }

    try {
      setSubmittingReservation(true);

      await bookDiningTable({
        tableNumber: reservationForm.tableNumber,
        reservationTime: reservationForm.reservationTime,
        guestsCount: reservationForm.guestsCount,
        specialRequests: reservationForm.specialRequests,
      });

      setReserveMessage({ text: `Table ${reservationForm.tableNumber} reserved successfully.`, type: "success" });
      setReservationForm({
        tableNumber: "",
        reservationTime: "",
        guestsCount: 2,
        specialRequests: "",
      });

      const [tablesResponse, reservationsResponse] = await Promise.all([
        getDiningTables(),
        getMyDiningReservations(),
      ]);
      setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
      setReservations(Array.isArray(reservationsResponse?.data) ? reservationsResponse.data : []);
    } catch (error) {
      console.error("Failed to reserve table:", error);
      setReserveMessage({ text: error.response?.data?.message || "Unable to reserve the table right now.", type: "error" });
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await cancelDiningOrder(orderId);
      setPageMessage("Order cancelled successfully.");

      // Refresh orders
      const ordersResponse = await getMyDiningOrders();
      setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setPageMessage(error.response?.data?.message || "Unable to cancel the order.");
    }
  };

  const canCancelOrder = (order) => {
    // Only allow cancellation within 30 minutes of order creation
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = now - orderTime;
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

    return (
      order.status !== "Cancelled" &&
      order.status !== "Completed" &&
      order.status !== "Served" &&
      timeDiff <= thirtyMinutes
    );
  };

  const toggleDietaryFilter = useCallback((filter) => {
    setDietaryFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  }, []);

  return (
    <div className="pb-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-luxe-border bg-luxe-charcoal px-4 py-16 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,176,138,0.28),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            Dining Experience
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
            Culinary excellence awaits
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Discover our curated menu featuring signature dishes, reserve your table, or order room service for ultimate convenience.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {pageMessage ? (
          <div className="mb-6 rounded-2xl border border-luxe-border bg-white px-4 py-3 text-sm shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            {pageMessage}
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 rounded-2xl bg-luxe-smoke p-1">
            {[
              { id: "menu", label: "Browse Menu", icon: "🍽️" },
              { id: "cart", label: `Cart (${cart.length})`, icon: "🛒" },
              { id: "reserve", label: "Reserve Table", icon: "📅" },
              { id: "orders", label: "My Orders", icon: "📋" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-luxe-charcoal text-white shadow-lg shadow-luxe-charcoal/20"
                    : "text-luxe-charcoal hover:bg-white"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cart Summary - Always visible when items in cart */}
          {cart.length > 0 && (
            <div className="flex items-center gap-4 rounded-2xl bg-luxe-bronze/10 px-4 py-3">
              <div className="text-sm font-semibold text-luxe-charcoal">
                {cart.length} item{cart.length > 1 ? "s" : ""} • {formatCurrency(totalAmount)}
              </div>
              <button
                onClick={() => setActiveTab("cart")}
                className="rounded-xl bg-luxe-bronze px-4 py-2 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
              >
                View Cart
              </button>
            </div>
          )}
        </div>

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke py-3 pl-11 pr-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
                    />
                    <svg
                      className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxe-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center text-sm font-semibold text-luxe-muted">Filters:</span>
                  {Object.keys(badgeStyles).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleDietaryFilter(filter)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                        dietaryFilters.includes(filter)
                          ? "bg-luxe-bronze text-white shadow-md shadow-luxe-bronze/30"
                          : "bg-luxe-smoke text-luxe-muted hover:text-luxe-charcoal"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-luxe-charcoal text-white shadow-lg shadow-luxe-charcoal/20"
                        : "border border-luxe-border bg-white text-luxe-charcoal hover:bg-luxe-smoke"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            {loadingMenu ? (
              <Loader />
            ) : menuError ? (
              <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-3xl">Menu unavailable</h3>
                <p className="mt-3 text-luxe-muted">{menuError}</p>
              </div>
            ) : filteredMenuItems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenuItems.map((item) => {
                  const cartItem = cartMap.get(item._id);

                  return (
                    <div
                      key={item._id}
                      className="group overflow-hidden rounded-[24px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)] transition-all hover:shadow-[0_25px_60px_rgba(28,28,28,0.12)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {item.isSignatureDish && (
                          <span className="absolute left-3 top-3 rounded-full bg-luxe-charcoal/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            Signature
                          </span>
                        )}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-bronze">
                              {item.category}
                            </p>
                            <h3 className="mt-2 font-serif text-xl leading-tight">
                              {item.name}
                            </h3>
                          </div>
                          <p className="shrink-0 text-lg font-semibold text-luxe-charcoal">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-luxe-muted line-clamp-2">
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
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-luxe-border bg-luxe-smoke p-1">
                            <button
                              type="button"
                              onClick={() => updateCart(item, -1)}
                              className="h-8 w-8 rounded-full text-sm text-luxe-charcoal transition hover:bg-white"
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold">
                              {cartItem?.quantity || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCart(item, 1)}
                              disabled={!item.isAvailable}
                              className="h-8 w-8 rounded-full text-sm text-luxe-charcoal transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          {cartItem ? (
                            <span className="text-sm font-semibold text-luxe-bronze">
                              Added to cart
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateCart(item, 1)}
                              disabled={!item.isAvailable}
                              className="rounded-full bg-luxe-bronze px-4 py-2 text-sm font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-3xl">No dishes found</h3>
                <p className="mt-3 text-luxe-muted">
                  {searchQuery || dietaryFilters.length > 0
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "No menu items are available in this category."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
                <h2 className="font-serif text-2xl">Your Order</h2>
                <p className="mt-2 text-luxe-muted">Review your items before placing the order</p>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 rounded-[24px] border border-luxe-border bg-white p-4 shadow-sm"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-luxe-charcoal">{item.name}</h3>
                        <p className="text-sm text-luxe-muted">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-luxe-border bg-luxe-smoke p-1">
                          <button
                            onClick={() => updateCart(item, -1)}
                            className="h-6 w-6 rounded-full text-xs text-luxe-charcoal transition hover:bg-white"
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCart(item, 1)}
                            className="h-6 w-6 rounded-full text-xs text-luxe-charcoal transition hover:bg-white"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-luxe-charcoal">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                  <div className="text-6xl">🛒</div>
                  <h3 className="mt-4 font-serif text-2xl">Your cart is empty</h3>
                  <p className="mt-2 text-luxe-muted">Browse our menu to add delicious items</p>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="mt-6 rounded-full bg-luxe-bronze px-6 py-3 font-semibold text-white transition hover:bg-luxe-charcoal"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </div>

            {/* Order Form Sidebar */}
            {cart.length > 0 && (
              <div className="lg:sticky lg:top-8 h-fit">
                <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl">Order Details</h3>
                    <div className="text-right">
                      <p className="text-xs text-luxe-muted">Total Amount</p>
                      <p className="text-lg font-semibold text-luxe-charcoal">{formatCurrency(totalAmount)}</p>
                    </div>
                  </div>

                  {user && !isAdmin ? (
                    <form className="mt-6 space-y-4" onSubmit={handlePlaceOrder}>
                      <div>
                        <label className="text-sm font-semibold text-luxe-charcoal">Order Type</label>
                        <select
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
                        <div>
                          <label className="text-sm font-semibold text-luxe-charcoal">Room Number</label>
                          <input
                            type="text"
                            name="roomNumber"
                            value={orderForm.roomNumber}
                            onChange={handleOrderInputChange}
                            className={inputClass}
                            placeholder="Eg. 1204"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-semibold text-luxe-charcoal">Table Number</label>
                          <select
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

                      <div>
                        <label className="text-sm font-semibold text-luxe-charcoal">Payment Method</label>
                        <select
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

                      <div>
                        <label className="text-sm font-semibold text-luxe-charcoal">Special Instructions</label>
                        <textarea
                          name="specialInstructions"
                          rows="3"
                          value={orderForm.specialInstructions}
                          onChange={handleOrderInputChange}
                          className={inputClass}
                          placeholder="Optional notes for the kitchen"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={submittingOrder}
                          className="flex-1 rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
                        >
                          {submittingOrder ? "Placing order..." : "Place Order"}
                        </button>
                        <button
                          type="button"
                          onClick={clearCart}
                          className="rounded-2xl border border-luxe-border px-5 py-3 font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                        >
                          Clear
                        </button>
                      </div>

                      {orderMessage.text && (
                        <div className={`mt-4 rounded-xl px-4 py-2 text-sm font-medium ${
                          orderMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {orderMessage.text}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                      {user ? "Admin users cannot place dining orders." : "Please log in to place an order."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reserve Table Tab */}
        {activeTab === "reserve" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
                <h2 className="font-serif text-2xl">Table Availability</h2>
                <p className="mt-2 text-luxe-muted">Choose from our available dining tables</p>
              </div>

              {user && !isAdmin ? (
                loadingProtectedData ? (
                  <Loader />
                ) : availableTables.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableTables.map((table) => (
                      <div
                        key={table._id}
                        className={`cursor-pointer rounded-[24px] border-2 p-5 transition-all ${
                          reservationForm.tableNumber === table.tableNumber.toString()
                            ? "border-luxe-bronze bg-luxe-bronze/5 shadow-lg"
                            : "border-luxe-border bg-white hover:border-luxe-bronze/50"
                        }`}
                        onClick={() => setReservationForm(prev => ({ ...prev, tableNumber: table.tableNumber.toString() }))}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl">Table {table.tableNumber}</h3>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Available
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-luxe-muted">{table.location}</p>
                        <p className="mt-1 text-sm font-semibold text-luxe-charcoal">
                          Capacity: {table.capacity} guests
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                    <h3 className="font-serif text-2xl">No tables available</h3>
                    <p className="mt-2 text-luxe-muted">All tables are currently reserved. Please try again later.</p>
                  </div>
                )
              ) : (
                <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                  {user ? "Admin users cannot reserve tables." : "Please log in to view table availability."}
                </div>
              )}
            </div>

            {/* Reservation Form Sidebar */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
                <h3 className="font-serif text-xl">Make Reservation</h3>
                <p className="mt-2 text-sm text-luxe-muted">Book your table for a special dining experience</p>

                {user && !isAdmin ? (
                  <form className="mt-6 space-y-4" onSubmit={handleReserveTable}>
                    <div>
                      <label className="text-sm font-semibold text-luxe-charcoal">Selected Table</label>
                      <div className="mt-2 rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 text-sm">
                        {reservationForm.tableNumber ? `Table ${reservationForm.tableNumber}` : "Select a table from the list"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-luxe-charcoal">Reservation Time</label>
                      <input
                        type="datetime-local"
                        name="reservationTime"
                        value={reservationForm.reservationTime}
                        onChange={handleReservationInputChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-luxe-charcoal">Number of Guests</label>
                      <input
                        type="number"
                        name="guestsCount"
                        min="1"
                        max="20"
                        value={reservationForm.guestsCount}
                        onChange={handleReservationInputChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-luxe-charcoal">Special Requests</label>
                      <textarea
                        name="specialRequests"
                        rows="3"
                        value={reservationForm.specialRequests}
                        onChange={handleReservationInputChange}
                        className={inputClass}
                        placeholder="Window seat, anniversary, dietary requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReservation || !reservationForm.tableNumber || !reservationForm.reservationTime}
                      className="mt-6 w-full rounded-2xl bg-luxe-charcoal px-5 py-3 font-semibold text-white transition hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:bg-luxe-muted"
                    >
                      {submittingReservation ? "Reserving..." : "Reserve Table"}
                    </button>

                    {reserveMessage.text && (
                      <div className={`mt-4 rounded-xl px-4 py-2 text-sm font-medium ${
                        reserveMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {reserveMessage.text}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                    {user ? "Admin users cannot make reservations." : "Please log in to make a reservation."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              <h2 className="font-serif text-2xl">My Dining History</h2>
              <p className="mt-2 text-luxe-muted">Track your orders and reservations</p>
            </div>

            {user && !isAdmin ? (
              loadingProtectedData ? (
                <Loader />
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Recent Orders */}
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
                              <p className="font-semibold text-luxe-charcoal">{order.orderType}</p>
                              <p className="text-sm text-luxe-muted">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[order.status] || "bg-white text-luxe-charcoal"
                              }`}>
                                {order.status}
                              </span>
                              {canCancelOrder(order) && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200 transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-luxe-muted">
                            {order.items?.length} item{order.items?.length > 1 ? "s" : ""} • {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                        No orders yet
                      </div>
                    )}
                  </div>

                  {/* Recent Reservations */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl">Table Reservations</h3>
                    {reservations.length > 0 ? (
                      reservations.slice(0, 3).map((res) => (
                        <div
                          key={res._id}
                          className="rounded-[24px] border border-luxe-border bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-luxe-charcoal">Table {res.tableNumber}</p>
                              <p className="text-sm text-luxe-muted">
                                {new Date(res.reservationTime).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[res.status] || "bg-white text-luxe-charcoal"
                            }`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-luxe-muted">
                            {res.guestsCount} guests • {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                {user ? "Admin users don't have guest dining history." : "Please log in to view your dining history."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
