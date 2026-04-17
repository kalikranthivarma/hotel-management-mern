import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
const createBooking = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    const roomDetails = await Room.findById(room);

    if (!roomDetails) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (!roomDetails.isAvailable) {
      res.status(400);
      throw new Error('Room is currently not available');
    }

    // Basic date validation
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // Check if room is booked for these dates
    const existingBookings = await Booking.find({
      room,
      status: { $ne: 'Cancelled' },
      $or: [
        { checkInDate: { $lt: checkOut, $gte: checkIn } },
        { checkOutDate: { $gt: checkIn, $lte: checkOut } },
        { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } },
      ],
    });

    if (existingBookings.length > 0) {
      res.status(400);
      throw new Error('Room is already booked for these dates');
    }

    // Calculate total amount
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * roomDetails.pricePerNight;

    const booking = await Booking.create({
      room,
      user: req.user._id, // Set by protectUser middleware
      checkInDate,
      checkOutDate,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private/User
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate('room').populate('user', 'firstName lastName email');
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
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

    // Guests can only update their own bookings; admins can update any booking
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
