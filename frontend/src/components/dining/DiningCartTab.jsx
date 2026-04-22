import { useEffect } from "react";
import { toast } from "react-toastify";

export default function DiningCartTab({
  cart,
  clearCart,
  formatCurrency,
  getImageUrl,
  handleOrderInputChange,
  handlePlaceOrder,
  inputClass,
  isAdmin,
  orderForm,
  orderMessage,
  submittingOrder,
  totalAmount,
  updateCart,
  user,
  tables,
  setActiveTab,
}) {
  useEffect(() => {
    if (orderMessage.type === "success") {
      toast.success("Order Placed Successfully!");
      const timer = setTimeout(() => {
        setActiveTab("orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderMessage, setActiveTab]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
          <h2 className="font-serif text-2xl">Your Order</h2>
          <p className="mt-2 text-luxe-muted">
            Review your items before placing the order
          </p>
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
                  decoding="async"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-luxe-charcoal">
                    {item.name}
                  </h3>
                  <p className="text-sm text-luxe-muted">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-luxe-border bg-luxe-smoke p-1">
                    <button
                      type="button"
                      onClick={() => updateCart(item, -1)}
                      className="h-6 w-6 rounded-full text-xs text-luxe-charcoal transition hover:bg-white"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
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
            <div className="text-6xl">Cart</div>
            <h3 className="mt-4 font-serif text-2xl">Your cart is empty</h3>
            <p className="mt-2 text-luxe-muted">
              Browse our menu to add delicious items
            </p>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="h-fit lg:sticky lg:top-8">
          <div className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">Order Details</h3>
              <div className="text-right">
                <p className="text-xs text-luxe-muted">Total Amount</p>
                <p className="text-lg font-semibold text-luxe-charcoal">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            {user && !isAdmin ? (
              <form className="mt-6 space-y-4" onSubmit={handlePlaceOrder}>
                <div>
                  <label className="text-sm font-semibold text-luxe-charcoal">
                    Order Type
                  </label>
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
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Room Number
                    </label>
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
                    <label className="text-sm font-semibold text-luxe-charcoal">
                      Table Number
                    </label>
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
                  <label className="text-sm font-semibold text-luxe-charcoal">
                    Payment Method
                  </label>
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
                  <label className="text-sm font-semibold text-luxe-charcoal">
                    Special Instructions
                  </label>
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
                  <div
                    className={`mt-4 rounded-xl p-5 text-sm font-medium ${
                      orderMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <p>{orderMessage.text}</p>
                      {orderMessage.type === "success" && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("orders")}
                          className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          View My Orders
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-luxe-border px-5 py-8 text-center text-luxe-muted">
                {user
                  ? "Admin users cannot place dining orders."
                  : "Please log in to place an order."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
