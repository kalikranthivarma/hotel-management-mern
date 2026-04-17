import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// User-only routes
router.post('/', protectUser, createBooking);
router.get('/my', protectUser, getMyBookings);

// Admin-only routes
router.get('/', protectAdmin, getAllBookings);

// Shared/Protected routes
// updateBookingStatus handles its own ownership/role check internally
router.put('/:id', protect, updateBookingStatus);

export default router;
