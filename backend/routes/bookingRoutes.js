import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protectAdmin, getAllBookings)
  .post(protectUser, createBooking);

router.get('/my', protectUser, getMyBookings);

router.route('/:id')
  .put(protectAdmin, updateBookingStatus); // Admin can update any status

export default router;
