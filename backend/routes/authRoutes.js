import express from 'express';
import {
  forgotAdminPassword,
  forgotUserPassword,
  loginAdmin,
  loginUser,
  registerAdminStep1,
  registerAdminStep3,
  registerUserStep1,
  registerUserStep3,
  refreshAccessToken,
  resetAdminPassword,
  resetUserPassword,
  verifyAdminOTP,
  verifyUserOTP,
} from '../controllers/authController.js';

const router = express.Router();

// ─── REFRESH TOKEN ROUTE ──────────────────────────────────────────────────────
router.post('/refresh', refreshAccessToken);

// ─── GUEST (USER) ROUTES ──────────────────────────────────────────────────────
router.post('/user/register-step-1', registerUserStep1);
router.post('/user/verify-otp', verifyUserOTP);
router.post('/user/register-step-3', registerUserStep3);
router.post('/user/login', loginUser);
router.post('/user/forgot-password', forgotUserPassword);
router.post('/user/reset-password', resetUserPassword); 

// ─── STAFF (ADMIN) ROUTES ─────────────────────────────────────────────────────
router.post('/admin/register-step-1', registerAdminStep1);
router.post('/admin/verify-otp', verifyAdminOTP);
router.post('/admin/register-step-3', registerAdminStep3);
router.post('/admin/login', loginAdmin);
router.post('/admin/forgot-password', forgotAdminPassword);
router.post('/admin/reset-password', resetAdminPassword); 

export default router;
