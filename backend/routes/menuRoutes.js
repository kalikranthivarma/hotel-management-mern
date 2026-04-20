
import express from 'express';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuImage,
  upload,
} from '../controllers/menuController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: serve images from GridFS
router.get('/image/:filename', getMenuImage);

// Public: get all menu items
router.get('/', getMenuItems);

// Admin: manage menu items
router.post('/', protectAdmin, upload.single('image'), addMenuItem);
router.put('/:id', protectAdmin, upload.single('image'), updateMenuItem);
router.delete('/:id', protectAdmin, deleteMenuItem);

export default router;
