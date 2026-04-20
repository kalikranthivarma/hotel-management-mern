
import DiningOrder from '../models/DiningOrder.js';
import DiningTable from '../models/DiningTable.js';
import Booking from '../models/Booking.js';
import MenuItem from '../models/MenuItem.js';
import TableReservation from '../models/TableReservation.js';

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
    } else {
      if (!isOpen && !activeBooking) {
        res.status(400);
        throw new Error('The restaurant is currently closed. Hours: 7 AM - 10 PM');
      }
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
      paymentStatus: 'Pending',
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
    const { tableNumber, reservationTime, guestsCount, specialRequests } = req.body;

    const resDate = new Date(reservationTime);
    const hours = resDate.getHours();

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

    // 1. Create a reservation record
    const reservation = await TableReservation.create({
      user: req.user._id,
      table: table._id,
      tableNumber: table.tableNumber,
      reservationTime: resDate,
      guestsCount,
      specialRequests,
    });

    // 2. Mark table as reserved
    table.status = 'Reserved';
    await table.save();

    res.status(201).json({
      success: true,
      message: `Table ${tableNumber} successfully reserved for ${resDate.toLocaleString()}`,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my reservations
// @route   GET /api/dining/my-reservations
// @access  Private/User
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await TableReservation.find({ user: req.user._id }).sort({ reservationTime: 1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations
// @route   GET /api/dining/reservations
// @access  Private/Admin
export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await TableReservation.find({})
      .populate('user', 'firstName lastName email')
      .populate('table')
      .sort({ reservationTime: 1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation status
// @route   PUT /api/dining/reservation/:id
// @access  Private/Admin
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const reservation = await TableReservation.findById(req.params.id);

    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    reservation.status = status;
    await reservation.save();

    // If cancelled or completed, make table available again
    if (status === 'Cancelled' || status === 'Completed') {
      const table = await DiningTable.findById(reservation.table);
      if (table) {
        table.status = 'Available';
        await table.save();
      }
    }

    res.status(200).json({ success: true, data: reservation });
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

