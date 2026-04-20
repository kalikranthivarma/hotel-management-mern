
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  bookTable,
  getTables,
  createTable,
  updateTable,
  deleteTable,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} from '../controllers/diningController.js';
import { protect, protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guest routes
router.post('/order', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.put('/order/:id/cancel', protectUser, cancelOrder);
router.post('/book-table', protectUser, bookTable);
router.get('/my-reservations', protectUser, getMyReservations);

// Admin routes
router.get('/orders', protectAdmin, getAllOrders);
router.put('/order/:id', protectAdmin, updateOrderStatus);
router.get('/reservations', protectAdmin, getAllReservations);
router.put('/reservation/:id', protectAdmin, updateReservationStatus);

// Table management routes (Admin only)
router.post('/tables', protectAdmin, createTable);
router.put('/tables/:id', protectAdmin, updateTable);
router.delete('/tables/:id', protectAdmin, deleteTable);

// Shared protected routes
router.get('/tables', protect, getTables);

export default router;
