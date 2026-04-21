
import DiningOrder from '../models/DiningOrder.js';
import DiningTable from '../models/DiningTable.js';
import Booking from '../models/Booking.js';
import MenuItem from '../models/MenuItem.js';

// Helper to check if it's within restaurant hours (7 AM - 10 PM)
const isRestaurantOpen = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 7 && hours < 22; // 07:00 to 21:59
};

// @desc    Create new dining order
// @route   POST /api/dining/order
// @access  Private/User
export const createOrder = async (req, res, next) => {
  try {
    const { items, orderType, roomNumber, tableNumber, paymentMethod, specialInstructions } = req.body;

    // 1. Check if user has an active booking
    const activeBooking = await Booking.findOne({
      user: req.user._id,
      status: 'confirmed',
      checkIn: { $lte: new Date() },
      checkOut: { $gte: new Date() },
    });

    // 2. Timing logic
    const isOpen = isRestaurantOpen();
    
    if (orderType === 'Room Service') {
      if (!activeBooking) {
        res.status(400);
        throw new Error('Room service is only available for guests with active room bookings');
      }
      // Room service is 24/7 for active guests - no time check needed as per user request
    } else {
      // In-Restaurant / Visitor
      if (!isOpen && !activeBooking) {
        res.status(400);
        throw new Error('The restaurant is currently closed. Hours: 7 AM - 10 PM');
      }
      // If they are an active guest, user didn't specify if they can eat *in restaurant* after 10 PM, 
      // but usually restaurant has hours. However, point 7 says "hotel can provide food for anytime for users who are booked".
      // I'll allow active guests to order anytime regardless of type for maximum flexibility.
    }

    // 3. Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        res.status(404);
        throw new Error(`Menu item not found or unavailable: ${item.menuItem}`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // 4. Create Order
    const order = await DiningOrder.create({
      user: req.user._id,
      items: orderItems,
      orderType,
      roomNumber: orderType === 'Room Service' ? roomNumber : undefined,
      tableNumber: orderType === 'In-Restaurant' ? tableNumber : undefined,
      totalAmount,
      paymentMethod,
      specialInstructions,
      paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Pending', // Online might start as pending until gateway returns
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my dining orders
// @route   GET /api/dining/my-orders
// @access  Private/User
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await DiningOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Kitchen/Admin)
// @route   GET /api/dining/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await DiningOrder.find({}).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/dining/order/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await DiningOrder.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const updatedOrder = await DiningOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a table
// @route   POST /api/dining/book-table
// @access  Private/User
export const bookTable = async (req, res, next) => {
  try {
    const { tableNumber, reservationTime, guestsCount } = req.body;

    const resDate = new Date(reservationTime);
    const hours = resDate.getHours();

    // Check if within 7 AM - 10 PM
    if (hours < 7 || hours >= 22) {
      res.status(400);
      throw new Error('Table bookings are only allowed between 7 AM and 10 PM');
    }

    const table = await DiningTable.findOne({ tableNumber });
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    if (table.status !== 'Available') {
      res.status(400);
      throw new Error('Table is already reserved or occupied');
    }

    // Mark table as reserved (Simple logic for now)
    table.status = 'Reserved';
    await table.save();

    res.status(200).json({
      success: true,
      message: `Table ${tableNumber} reserved for ${reservationTime}`,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tables
// @route   GET /api/dining/tables
// @access  Private
export const getTables = async (req, res, next) => {
  try {
    const tables = await DiningTable.find({});
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};
