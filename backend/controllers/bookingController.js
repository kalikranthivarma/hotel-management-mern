
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
const createBooking = async (req, res, next) => {
  try {
    console.log('[createBooking] req.body:', req.body);
    console.log('[createBooking] req.user:', req.user);

    const { room, checkInDate, checkOutDate, guestsCount = 1 } = req.body;

    if (!room || !checkInDate || !checkOutDate) {
      res.status(400);
      throw new Error('room, checkInDate, and checkOutDate are required');
    }

    const roomDetails = await Room.findById(room);
    if (!roomDetails) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (!roomDetails.isAvailable) {
      res.status(400);
      throw new Error('Room is currently not available');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      res.status(400);
      throw new Error('Invalid check-in or check-out date');
    }

    if (checkIn >= checkOut) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // Check for date conflicts
    const existingBookings = await Booking.find({
      room,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: checkOut, $gte: checkIn } },
        { checkOut: { $gt: checkIn, $lte: checkOut } },
        { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
      ],
    });

    if (existingBookings.length > 0) {
      res.status(400);
      throw new Error('Room is already booked for these dates');
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * roomDetails.pricePerNight;

    const guestName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Guest';
    const guestEmail = req.user.email || '';
    const guestPhone = req.user.phone || 'Not provided';

    console.log('[createBooking] Creating with:', {
      room, guestName, guestEmail, guestPhone, checkIn, checkOut, guestsCount, totalPrice
    });

    const booking = await Booking.create({
      room,
      user: req.user._id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guestsCount: Number(guestsCount) || 1,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('[createBooking] ERROR:', error.message);
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private/User
const getMyBookings = async (req, res, next) => {
  try {
    console.log(`[getMyBookings] User ID: ${req.user._id} (${req.user.email})`);
    const bookings = await Booking.find({ user: req.user._id }).populate('room').sort({ createdAt: -1 });
    console.log(`[getMyBookings] Found: ${bookings.length}`);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('room')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin or Owner)
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this booking');
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export { createBooking, getAllBookings, getMyBookings, updateBookingStatus };
