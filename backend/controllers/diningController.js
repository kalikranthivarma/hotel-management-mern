
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

    // 1. Check operational hours (7 AM - 10 PM)
    if (hours < 7 || hours >= 22) {
      res.status(400);
      throw new Error('Table bookings are only allowed between 7 AM and 10 PM');
    }

    const table = await DiningTable.findOne({ tableNumber });
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    // 2. 4-Hour Duration Logic
    const DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
    const requestedStartTime = resDate.getTime();
    const requestedEndTime = requestedStartTime + DURATION_MS;

    // 3. Check for overlapping reservations for this table
    // A reservation overlaps if: existingStart < requestedEnd AND existingEnd > requestedStart
    const existingReservations = await TableReservation.find({
      table: table._id,
      status: 'Confirmed',
    });

    const isOverlapping = existingReservations.some(res => {
      const existingStart = new Date(res.reservationTime).getTime();
      const existingEnd = existingStart + DURATION_MS;
      return existingStart < requestedEndTime && existingEnd > requestedStartTime;
    });

    if (isOverlapping) {
      res.status(400);
      throw new Error('This table is already booked during the requested 4-hour time slot. Please choose another time or table.');
    }

    // 4. Create a reservation record
    const reservation = await TableReservation.create({
      user: req.user._id,
      table: table._id,
      tableNumber: table.tableNumber,
      reservationTime: resDate,
      guestsCount,
      specialRequests,
      status: 'Confirmed'
    });

    // 5. Update table status if the reservation is starting now or very soon
    const now = new Date().getTime();
    if (requestedStartTime <= now && requestedEndTime > now) {
      table.status = 'Reserved';
      await table.save();
    }

    res.status(201).json({
      success: true,
      message: `Table ${tableNumber} successfully reserved for a 4-hour slot starting ${resDate.toLocaleString()}`,
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
    const reservations = await TableReservation.find({ user: req.user._id }).sort({ createdAt: -1 });
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
      .sort({ createdAt: -1 });
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

// @desc    Create new dining table
// @route   POST /api/dining/tables
// @access  Private/Admin
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location } = req.body;

    const existingTable = await DiningTable.findOne({ tableNumber });
    if (existingTable) {
      res.status(400);
      throw new Error('Table number already exists');
    }

    const table = await DiningTable.create({
      tableNumber,
      capacity,
      location: location || 'Indoor',
      status: 'Available'
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dining table
// @route   PUT /api/dining/tables/:id
// @access  Private/Admin
export const updateTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location, status } = req.body;

    const table = await DiningTable.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    // Check if tableNumber is being changed and if it conflicts
    if (tableNumber && tableNumber !== table.tableNumber) {
      const existingTable = await DiningTable.findOne({ tableNumber });
      if (existingTable) {
        res.status(400);
        throw new Error('Table number already exists');
      }
    }

    const updatedTable = await DiningTable.findByIdAndUpdate(
      req.params.id,
      { tableNumber, capacity, location, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedTable });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete dining table
// @route   DELETE /api/dining/tables/:id
// @access  Private/Admin
export const deleteTable = async (req, res, next) => {
  try {
    const table = await DiningTable.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    // Check if table has active reservations
    const activeReservations = await TableReservation.find({
      table: table._id,
      status: { $in: ['Pending', 'Confirmed'] },
      reservationTime: { $gte: new Date() }
    });

    if (activeReservations.length > 0) {
      res.status(400);
      throw new Error('Cannot delete table with active reservations');
    }

    await DiningTable.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel dining order
// @route   PUT /api/dining/order/:id/cancel
// @access  Private/User
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await DiningOrder.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this order');
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['Pending', 'Preparing'];
    if (!cancellableStatuses.includes(order.status)) {
      res.status(400);
      throw new Error('Order cannot be cancelled at this stage');
    }

    // Check time limit (30 minutes for cancellation)
    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = (now - orderTime) / (1000 * 60); // minutes

    if (timeDiff > 30) {
      res.status(400);
      throw new Error('Orders can only be cancelled within 30 minutes of placement');
    }

    // Update order status
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel table reservation
// @route   PUT /api/dining/reservation/:id/cancel
// @access  Private/User
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await TableReservation.findById(req.params.id);
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    // Check if reservation belongs to user
    if (reservation.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this reservation');
    }

    // Check if reservation can be cancelled
    if (new Date(reservation.reservationTime) < new Date()) {
      res.status(400);
      throw new Error('Cannot cancel past reservations');
    }

    if (reservation.status === 'Cancelled' || reservation.status === 'Completed') {
      res.status(400);
      throw new Error(`Reservation is already ${reservation.status.toLowerCase()}`);
    }

    // Update reservation status
    reservation.status = 'Cancelled';
    await reservation.save();

    // Make table available again
    const table = await DiningTable.findById(reservation.table);
    if (table) {
      table.status = 'Available';
      await table.save();
    }

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

