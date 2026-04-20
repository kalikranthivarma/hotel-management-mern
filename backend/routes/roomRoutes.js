
import express from 'express';
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getFeaturedRooms,
  getRoomById,
  getRoomImage,
  toggleRoomAvailability,
  updateRoom,
  upload,
} from '../controllers/roomController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllRooms);
router.get('/featured', getFeaturedRooms);
router.get('/image/:filename', getRoomImage);
router.get('/:id', getRoomById);

// ADMIN-ONLY ROUTES
router.post('/', protectAdmin, upload.single('image'), createRoom);
router.put('/:id', protectAdmin, upload.single('image'), updateRoom);
router.patch('/:id/availability', protectAdmin, toggleRoomAvailability);
router.delete('/:id', protectAdmin, deleteRoom);

export default router;
