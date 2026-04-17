import express from 'express';
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from '../controllers/roomController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protectAdmin, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protectAdmin, updateRoom)
  .delete(protectAdmin, deleteRoom);

export default router;
