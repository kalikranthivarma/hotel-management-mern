
import express from 'express';
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getFeaturedRooms,
  getRoomById,
  toggleRoomAvailability,
  updateRoom,
} from '../controllers/roomController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUBLIC ROUTES 
router.get('/', getAllRooms);
router.get('/featured', getFeaturedRooms);
router.get('/:id', getRoomById);

// ADMIN-ONLY ROUTES 
router.post('/', protectAdmin, createRoom);
router.put('/:id', protectAdmin, updateRoom);
router.patch('/:id/availability', protectAdmin, toggleRoomAvailability);
router.delete('/:id', protectAdmin, deleteRoom);

export default router;

