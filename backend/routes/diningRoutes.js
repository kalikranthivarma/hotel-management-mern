
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  bookTable,
  getTables,
} from '../controllers/diningController.js';
import { protect, protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guest routes
router.post('/order', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.post('/book-table', protectUser, bookTable);

// Admin routes
router.get('/orders', protectAdmin, getAllOrders);
router.put('/order/:id', protectAdmin, updateOrderStatus);

// Shared protected routes
router.get('/tables', protect, getTables);

export default router;
