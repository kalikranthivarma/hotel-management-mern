
import express from 'express';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  upload,
} from '../controllers/menuController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', protectAdmin, upload.single('image'), addMenuItem);
router.put('/:id', protectAdmin, upload.single('image'), updateMenuItem);
router.delete('/:id', protectAdmin, deleteMenuItem);

export default router;
