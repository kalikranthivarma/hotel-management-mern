
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  bookTable,
  getTables,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} from '../controllers/diningController.js';
import { protect, protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guest routes
router.post('/order', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.post('/book-table', protectUser, bookTable);
router.get('/my-reservations', protectUser, getMyReservations);

// Admin routes
router.get('/orders', protectAdmin, getAllOrders);
router.put('/order/:id', protectAdmin, updateOrderStatus);
router.get('/reservations', protectAdmin, getAllReservations);
router.put('/reservation/:id', protectAdmin, updateReservationStatus);

// Shared protected routes
router.get('/tables', protect, getTables);

export default router;
