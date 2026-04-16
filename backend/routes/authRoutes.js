import express from 'express';
import {
  forgotAdminPassword,
  forgotUserPassword,
  loginAdmin,
  loginUser,
  registerAdmin,
  registerUser,
  resetAdminPassword,
  resetUserPassword,
  verifyAdminEmail,
  verifyUserEmail,
} from '../controllers/authController.js';

const router = express.Router();

// ─── GUEST (USER) ROUTES ──────────────────────────────────────────────────────
router.post('/user/register', registerUser);
router.get('/user/verify-email/:token', verifyUserEmail);
router.post('/user/login', loginUser);
router.post('/user/forgot-password', forgotUserPassword);
router.put('/user/reset-password/:token', resetUserPassword);

// ─── STAFF (ADMIN) ROUTES ─────────────────────────────────────────────────────
router.post('/admin/register', registerAdmin);
router.get('/admin/verify-email/:token', verifyAdminEmail);
router.post('/admin/login', loginAdmin);
router.post('/admin/forgot-password', forgotAdminPassword);
router.put('/admin/reset-password/:token', resetAdminPassword);

export default router;
