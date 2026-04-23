import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  bookDiningTable,
  cancelDiningOrder,
  createDiningOrder,
  getDiningTables,
  getMyDiningOrders,
  getMyDiningReservations,
  cancelDiningReservation,
} from "../api/diningApi";
import { getMenuItems } from "../api/menuApi";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiningCartTab = lazy(
  () => import("../components/dining/DiningCartTab"),
);
const DiningReserveTab = lazy(
  () => import("../components/dining/DiningReserveTab"),
);
const DiningOrdersTab = lazy(
  () => import("../components/dining/DiningOrdersTab"),
);

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

const protectedTabs = new Set(["cart", "reserve", "orders"]);

const INITIAL_VISIBLE_MENU_ITEMS = 8;
const MENU_ITEMS_LOAD_STEP = 8;
const BELOW_THE_FOLD_STYLE = {
  contentVisibility: "auto",
  containIntrinsicSize: "1200px",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const fallbackDiningImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#f4efe7" />
      <rect x="70" y="70" width="660" height="460" rx="36" fill="#d4b08a" opacity="0.18" />
      <circle cx="400" cy="250" r="92" fill="#1f2937" opacity="0.12" />
      <path d="M328 220h144v24H328zm24 42h96v24h-96zm-8 56h112v24H344z" fill="#1f2937" opacity="0.42" />
      <text x="400" y="430" font-family="Georgia, serif" font-size="34" text-anchor="middle" fill="#5b4633">
        Dining Menu
      </text>
    </svg>
  `);

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return fallbackDiningImage;
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "";
  return `${baseUrl}${imagePath}`;
};

const formatCurrency = (amount) => currencyFormatter.format(amount || 0);

const MenuCard = memo(function MenuCard({
  ariaAttributes,
  isPriority,
  item,
  quantity,
  onUpdateCart,
  style,
}) {
  return (
    <div style={style} {...ariaAttributes}>
      <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)] transition-all hover:shadow-[0_25px_60px_rgba(28,28,28,0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            decoding={isPriority ? "sync" : "async"}
            fetchPriority={isPriority ? "high" : "auto"}
            loading={isPriority ? "eager" : "lazy"}
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

        <div className="flex flex-1 flex-col p-5">
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

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-luxe-muted">
            {item.description ||
              "Freshly prepared and served with KNSU dining care."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(item.dietaryInfo || []).map((diet) => (
              <span
                key={`${item._id}-${diet}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[diet] || "bg-luxe-smoke text-luxe-charcoal"
                  }`}
              >
                {diet}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-5">
            <div className="flex items-center rounded-full border border-luxe-border bg-luxe-smoke p-1">
              <button
                type="button"
                onClick={() => onUpdateCart(item, -1)}
                className="h-8 w-8 rounded-full text-sm text-luxe-charcoal transition hover:bg-white"
              >
                -
              </button>
              <span className="min-w-8 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateCart(item, 1)}
                disabled={!item.isAvailable}
                className="h-8 w-8 rounded-full text-sm text-luxe-charcoal transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>

            {quantity > 0 ? (
              <span className="text-sm font-semibold text-luxe-bronze">
                Added to cart
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onUpdateCart(item, 1)}
                disabled={!item.isAvailable}
                className="rounded-full bg-luxe-bronze px-4 py-2 text-sm font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Dining() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";
  const menuCacheRef = useRef({});
  const hasLoadedProtectedDataRef = useRef(false);

  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingProtectedData, setLoadingProtectedData] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [shouldLoadMenu, setShouldLoadMenu] = useState(false);
  const [visibleMenuItemCount, setVisibleMenuItemCount] = useState(
    INITIAL_VISIBLE_MENU_ITEMS,
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "Available"),
    [tables],
  );

  const filteredMenuItems = useMemo(() => {
    const search = deferredSearchQuery.trim().toLowerCase();

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
        !dietaryFilters.every((filter) => item.dietaryInfo?.includes(filter))
      ) {
        return false;
      }

      return true;
    });
  }, [deferredSearchQuery, dietaryFilters, menuItems]);

  const cartMap = useMemo(() => {
    const map = new Map();
    cart.forEach((item) => map.set(item._id, item));
    return map;
  }, [cart]);

  const visibleMenuItems = useMemo(
    () => filteredMenuItems.slice(0, visibleMenuItemCount),
    [filteredMenuItems, visibleMenuItemCount],
  );
  const hasMoreMenuItems = visibleMenuItemCount < filteredMenuItems.length;

  useEffect(() => {
    setVisibleMenuItemCount(INITIAL_VISIBLE_MENU_ITEMS);
  }, [selectedCategory, deferredSearchQuery, dietaryFilters]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setShouldLoadMenu(true);
      return undefined;
    }

    const rafId = window.requestAnimationFrame(() => {
      setShouldLoadMenu(true);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!shouldLoadMenu) {
      return;
    }

    const loadMenu = async () => {
      const cacheKey = selectedCategory;
      const cachedMenu = menuCacheRef.current[cacheKey];

      if (cachedMenu) {
        setMenuError("");
        setMenuItems(cachedMenu);
        setLoadingMenu(false);
        return;
      }

      try {
        setLoadingMenu(true);
        setMenuError("");

        const response = await getMenuItems(
          selectedCategory === "All" ? {} : { category: selectedCategory },
        );
        const nextMenu = Array.isArray(response?.data) ? response.data : [];
        menuCacheRef.current[cacheKey] = nextMenu;
        setMenuItems(nextMenu);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuError(
          error.response?.data?.message || "Unable to load the menu right now.",
        );
        setMenuItems([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    loadMenu();
  }, [selectedCategory, shouldLoadMenu]);

  const loadProtectedData = useCallback(async () => {
    try {
      setLoadingProtectedData(true);
      const [tablesResponse, ordersResponse, reservationsResponse] =
        await Promise.all([
          getDiningTables(),
          getMyDiningOrders(),
          getMyDiningReservations(),
        ]);

      setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
      setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
      setReservations(
        Array.isArray(reservationsResponse?.data)
          ? reservationsResponse.data
          : [],
      );
      hasLoadedProtectedDataRef.current = true;
    } catch (error) {
      console.error("Failed to fetch dining data:", error);
    } finally {
      setLoadingProtectedData(false);
    }
  }, []);

  useEffect(() => {
    setOrderMessage({ text: "", type: "" });
    setReserveMessage({ text: "", type: "" });

    if (!user || isAdmin) {
      setTables([]);
      setOrders([]);
      setReservations([]);
      hasLoadedProtectedDataRef.current = false;
      return;
    }

    if (!protectedTabs.has(activeTab) || hasLoadedProtectedDataRef.current) {
      return;
    }

    loadProtectedData();
  }, [activeTab, isAdmin, loadProtectedData, user]);

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

  const clearCart = useCallback(() => {
    setCart([]);
    setOrderForm((prev) => ({
      ...prev,
      roomNumber: "",
      tableNumber: "",
      specialInstructions: "",
    }));
  }, []);

  const handleOrderInputChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "orderType" && value === "Room Service"
        ? { tableNumber: "" }
        : {}),
      ...(name === "orderType" && value === "In-Restaurant"
        ? { roomNumber: "" }
        : {}),
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

    if (submittingOrder) {
      return;
    }

    setOrderMessage({ text: "", type: "" });

    if (!user) {
      setOrderMessage({
        text: "Please log in to place a dining order.",
        type: "error",
      });
      return;
    }

    if (cart.length === 0) {
      setOrderMessage({
        text: "Add at least one menu item before placing an order.",
        type: "error",
      });
      return;
    }

    if (
      orderForm.orderType === "Room Service" &&
      !orderForm.roomNumber.trim()
    ) {
      setOrderMessage({
        text: "Room number is required for room service.",
        type: "error",
      });
      return;
    }

    if (
      orderForm.orderType === "In-Restaurant" &&
      !orderForm.tableNumber.trim()
    ) {
      setOrderMessage({
        text: "Table number is required for in-restaurant orders.",
        type: "error",
      });
      return;
    }

    const newOrderPayload = {
      items: cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),
      orderType: orderForm.orderType,
      roomNumber:
        orderForm.orderType === "Room Service"
          ? orderForm.roomNumber
          : undefined,
      tableNumber:
        orderForm.orderType === "In-Restaurant"
          ? orderForm.tableNumber
          : undefined,
      paymentMethod: orderForm.paymentMethod,
      specialInstructions: orderForm.specialInstructions,
    };

    try {
      setSubmittingOrder(true);

      const response = await createDiningOrder(newOrderPayload);
      const newOrder = response?.data;

      if (newOrder) {
        setOrders((prev) => [newOrder, ...prev]);
      }

      setOrderMessage({
        text: "Dining order placed successfully.",
        type: "success",
      });
      clearCart();
    } catch (error) {
      console.error("Failed to place dining order:", error);
      setOrderMessage({
        text:
          error.response?.data?.message ||
          "Unable to place the order right now.",
        type: "error",
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReserveTable = async (event) => {
    event.preventDefault();
    setReserveMessage({ text: "", type: "" });

    if (!user) {
      setReserveMessage({
        text: "Please log in to reserve a table.",
        type: "error",
      });
      return;
    }

    if (!reservationForm.tableNumber) {
      setReserveMessage({ text: "Please select a table.", type: "error" });
      return;
    }

    if (!reservationForm.reservationTime) {
      setReserveMessage({
        text: "Please select a reservation time.",
        type: "error",
      });
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

      setReserveMessage({
        text: `Table ${reservationForm.tableNumber} reserved successfully.`,
        type: "success",
      });
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
      setReservations(
        Array.isArray(reservationsResponse?.data)
          ? reservationsResponse.data
          : [],
      );
      hasLoadedProtectedDataRef.current = true;
      setActiveTab("orders");
    } catch (error) {
      console.error("Failed to reserve table:", error);
      setReserveMessage({
        text:
          error.response?.data?.message ||
          "Unable to reserve the table right now.",
        type: "error",
      });
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await cancelDiningOrder(orderId);
      const cancelledOrder = response?.data;

      setPageMessage("Order cancelled successfully.");

      if (cancelledOrder?._id) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === cancelledOrder._id ? cancelledOrder : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setPageMessage(
        error.response?.data?.message || "Unable to cancel the order.",
      );
    }
  };

  const handleCancelReservation = async (resId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      const response = await cancelDiningReservation(resId);
      const cancelledRes = response?.data;

      setPageMessage("Reservation cancelled successfully.");
      toast.success("Reservation cancelled.");

      if (cancelledRes?._id) {
        setReservations((prev) =>
          prev.map((res) =>
            res._id === cancelledRes._id ? cancelledRes : res,
          ),
        );
      }

      // Refresh available tables list
      const tablesResponse = await getDiningTables();
      setTables(Array.isArray(tablesResponse?.data) ? tablesResponse.data : []);
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      setPageMessage(
        error.response?.data?.message || "Unable to cancel the reservation.",
      );
      toast.error(error.response?.data?.message || "Failed to cancel.");
    }
  };

  const canCancelOrder = (order) => {
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = now - orderTime;
    const thirtyMinutes = 30 * 60 * 1000;

    return (
      order.status !== "Cancelled" &&
      order.status !== "Completed" &&
      order.status !== "Served" &&
      timeDiff <= thirtyMinutes
    );
  };

  const canCancelReservation = useCallback((reservation) => {
    const cancellableStatuses = new Set(["Pending", "Reserved", "Confirmed"]);

    return (
      cancellableStatuses.has(reservation.status) &&
      new Date(reservation.reservationTime) > new Date()
    );
  }, []);

  const toggleDietaryFilter = useCallback((filter) => {
    setDietaryFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((existingFilter) => existingFilter !== filter)
        : [...prev, filter],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setDietaryFilters([]);
    setSelectedCategory("All");
  }, []);

  return (
    <div className="pb-14">
      <section className="overflow-hidden border-b border-luxe-border bg-[linear-gradient(135deg,#171412_0%,#22211f_58%,#1c1c1c_100%)] px-4 py-14 text-white lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            Dining Experience
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Culinary excellence awaits
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Discover our curated menu featuring signature dishes, reserve your
            table, or order room service for ultimate convenience.
          </p>
        </div>
      </section>

      <div
        className="mx-auto max-w-7xl px-4 py-8 lg:px-8"
        style={BELOW_THE_FOLD_STYLE}
      >
        {pageMessage ? (
          <div className="mb-6 rounded-2xl border border-luxe-border bg-white px-4 py-3 text-sm shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            {pageMessage}
          </div>
        ) : null}

        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-luxe-smoke p-1">
            {[
              { id: "menu", label: "Browse Menu", icon: "🍽️" },
              { id: "cart", label: `Cart (${cart.length})`, icon: "🛒" },
              { id: "reserve", label: "Reserve Table", icon: "📅" },
              { id: "orders", label: "My Orders", icon: "📋" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === tab.id
                  ? "bg-luxe-charcoal text-white shadow-lg shadow-luxe-charcoal/20"
                  : "text-luxe-charcoal hover:bg-white"
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-4 rounded-2xl bg-luxe-bronze/10 px-4 py-3">
              <div className="text-sm font-semibold text-luxe-charcoal">
                {cart.length} item{cart.length > 1 ? "s" : ""} •{" "}
                {formatCurrency(totalAmount)}
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

        {activeTab === "menu" && (
          <div className="space-y-8">
            <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for dishes..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke py-3 pl-11 pr-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
                    />
                    <svg
                      className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxe-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center text-sm font-semibold text-luxe-muted">
                    Filters:
                  </span>
                  {Object.keys(badgeStyles).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleDietaryFilter(filter)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${dietaryFilters.includes(filter)
                        ? "bg-luxe-bronze text-white shadow-md shadow-luxe-bronze/30"
                        : "bg-luxe-smoke text-luxe-muted hover:text-luxe-charcoal"
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full border border-luxe-border bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-luxe-muted transition hover:border-luxe-bronze hover:text-luxe-charcoal"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${selectedCategory === category
                      ? "bg-luxe-charcoal text-white shadow-lg shadow-luxe-charcoal/20"
                      : "border border-luxe-border bg-white text-luxe-charcoal hover:bg-luxe-smoke"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {!shouldLoadMenu || loadingMenu ? (
              !shouldLoadMenu ? (
                <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
                  <div className="h-5 w-40 animate-pulse rounded-full bg-luxe-smoke" />
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-[24px] border border-luxe-border bg-white"
                      >
                        <div className="aspect-[4/3] animate-pulse bg-luxe-smoke" />
                        <div className="space-y-3 p-5">
                          <div className="h-3 w-20 animate-pulse rounded-full bg-luxe-smoke" />
                          <div className="h-6 w-2/3 animate-pulse rounded-full bg-luxe-smoke" />
                          <div className="h-4 w-full animate-pulse rounded-full bg-luxe-smoke" />
                          <div className="h-4 w-5/6 animate-pulse rounded-full bg-luxe-smoke" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Loader />
              )
            ) : menuError ? (
              <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
                <h3 className="font-serif text-3xl">Menu unavailable</h3>
                <p className="mt-3 text-luxe-muted">{menuError}</p>
              </div>
            ) : filteredMenuItems.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {visibleMenuItems.map((item) => (
                    <MenuCard
                      key={item._id}
                      isPriority={item._id === visibleMenuItems[0]?._id}
                      item={item}
                      quantity={cartMap.get(item._id)?.quantity || 0}
                      onUpdateCart={updateCart}
                    />
                  ))}
                </div>

                {hasMoreMenuItems ? (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleMenuItemCount((prev) =>
                          Math.min(
                            prev + MENU_ITEMS_LOAD_STEP,
                            filteredMenuItems.length,
                          ),
                        )
                      }
                      className="rounded-full border border-luxe-border bg-white px-6 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-smoke"
                    >
                      Load more dishes
                    </button>
                  </div>
                ) : null}
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

        {activeTab === "cart" && (
          <Suspense fallback={<Loader />}>
            <DiningCartTab
              cart={cart}
              clearCart={clearCart}
              formatCurrency={formatCurrency}
              getImageUrl={getImageUrl}
              handleOrderInputChange={handleOrderInputChange}
              handlePlaceOrder={handlePlaceOrder}
              inputClass={inputClass}
              isAdmin={isAdmin}
              orderForm={orderForm}
              orderMessage={orderMessage}
              submittingOrder={submittingOrder}
              tables={tables}
              totalAmount={totalAmount}
              updateCart={updateCart}
              setActiveTab={setActiveTab}
              user={user}
            />
          </Suspense>
        )}

        {activeTab === "reserve" && (
          <Suspense fallback={<Loader />}>
            <DiningReserveTab
              availableTables={availableTables}
              handleReservationInputChange={handleReservationInputChange}
              handleReserveTable={handleReserveTable}
              inputClass={inputClass}
              isAdmin={isAdmin}
              loadingProtectedData={loadingProtectedData}
              reservationForm={reservationForm}
              reserveMessage={reserveMessage}
              setReservationForm={setReservationForm}
              setActiveTab={setActiveTab}
              submittingReservation={submittingReservation}
              user={user}
            />
          </Suspense>
        )}

        {activeTab === "orders" && (
          <Suspense fallback={<Loader />}>
            <DiningOrdersTab
              canCancelReservation={canCancelReservation}
              canCancelOrder={canCancelOrder}
              formatCurrency={formatCurrency}
              handleCancelOrder={handleCancelOrder}
              handleCancelReservation={handleCancelReservation}
              isAdmin={isAdmin}
              loadingProtectedData={loadingProtectedData}
              orders={orders}
              reservations={reservations}
              statusStyles={statusStyles}
              user={user}
            />
          </Suspense>
        )}
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
