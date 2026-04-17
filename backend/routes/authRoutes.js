import express from 'express';
import {
  forgotAdminPassword,
  forgotUserPassword,
  loginAdmin,
  loginUser,
  registerAdmin,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';

const router = express.Router();

// ─── GUEST (USER) ROUTES ──────────────────────────────────────────────────────
router.post('/user/register', registerUser);
router.post('/user/resend-verification', resendVerificationEmail);
router.get('/user/verify-email/:token', verifyEmail);
router.post('/user/login', loginUser);
router.post('/user/forgot-password', forgotUserPassword);
router.put('/user/reset-password/:token', resetPassword);

// ─── STAFF (ADMIN) ROUTES ─────────────────────────────────────────────────────
router.post('/admin/register', registerAdmin);
router.get('/admin/verify-email/:token', verifyEmail);
router.post('/admin/login', loginAdmin);
router.post('/admin/forgot-password', forgotAdminPassword);
router.put('/admin/reset-password/:token', resetPassword);

export default router;
