import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────

// Generates a raw token for emails and its hashed counterpart for DB storage
const createToken = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
};

// Maps internal role to the URL segment used in frontend links
const urlRole = (role) => (role === 'guest' ? 'user' : 'admin');

const sendVerificationEmail = async (email, role, rawToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/${urlRole(role)}/verify-email/${rawToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1a3c5e">Welcome to Hotel Management 🏨</h2>
      <p>You have registered as a <strong>${urlRole(role)}</strong>. Please verify your email:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1a3c5e;color:#fff;border-radius:6px;text-decoration:none;">
        Verify Email
      </a>
      <p style="color:#888;font-size:12px;margin-top:20px">This link expires in 24 hours.</p>
    </div>
  `;
  await sendEmail({ email, subject: 'Hotel Management – Verify Your Email', html });
};

const sendResetEmail = async (email, role, rawToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/${urlRole(role)}/reset-password/${rawToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1a3c5e">Password Reset Request 🔑</h2>
      <p>Click the link below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#c0392b;color:#fff;border-radius:6px;text-decoration:none;">
        Reset Password
      </a>
      <p style="color:#888;font-size:12px;margin-top:20px">If you did not request this, please ignore this email.</p>
    </div>
  `;
  await sendEmail({ email, subject: 'Hotel Management – Password Reset', html });
};

// ─── CORE REUSABLE LOGIC ──────────────────────────────────────────────────────

// Shared registration logic — called by registerUser and registerAdmin
const registerAccount = async (req, res, next, role) => {
  try {
    const {
      firstName, lastName, email, password, confirmPassword,
      phone, address, idProof, employeeId, department,
    } = req.body;

    const isStaff = role !== 'guest';

    // Required for everyone
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    // Required for staff only
    if (isStaff && (!employeeId || !department)) {
      res.status(400);
      throw new Error('Employee ID and department are required for staff accounts');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    if (await User.findOne({ email: email.toLowerCase() })) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }

    if (isStaff && (await User.findOne({ employeeId }))) {
      res.status(409);
      throw new Error('This Employee ID is already registered');
    }

    const { raw, hashed } = createToken();

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      // Guest-only
      ...(role === 'guest' && { address, idProof }),
      // Staff-only
      ...(isStaff && { employeeId, department }),
      verified: false,
      verificationToken: hashed,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(user.email, role, raw);
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
      });
    } catch (emailErr) {
      // If email fails, clean up the token but keep the account
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Account created but verification email could not be sent. Contact support.');
    }
  } catch (error) {
    next(error);
  }
};

// Shared login logic — allowedRoles determines who can log in via this endpoint
const loginAccount = async (req, res, next, allowedRoles) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide your email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Block wrong account type from using the wrong login endpoint
    if (!allowedRoles.includes(user.role)) {
      res.status(403);
      throw new Error('Access denied: incorrect account type for this login');
    }

    if (!user.verified) {
      res.status(401);
      throw new Error('Please verify your email before logging in');
    }

    const token = generateToken(user._id, user.role);

    // Build response — include role-specific extra fields
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
    if (user.role === 'guest') userData.loyaltyPoints = user.loyaltyPoints;
    if (user.role !== 'guest') {
      userData.employeeId = user.employeeId;
      userData.department = user.department;
    }

    res.status(200).json({ success: true, message: 'Login successful!', token, user: userData });
  } catch (error) {
    next(error);
  }
};

// Shared forgot password logic
const forgotPasswordAccount = async (req, res, next, role) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error('No account found with that email');
    }

    const { raw, hashed } = createToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await sendResetEmail(user.email, role, raw);
      res.status(200).json({ success: true, message: 'Reset link sent to your email' });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// ─── SHARED CONTROLLERS (used by both user & admin routes) ────────────────────

// Verify email — works for both guests and staff via the same token logic
const verifyEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashed,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification link');
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified! You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// Reset password — works for both guests and staff
const resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    if (!req.body.password || req.body.password !== req.body.confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide your email');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error('No account found with that email');
    }

    if (user.verified) {
      res.status(400);
      throw new Error('Account is already verified. You can log in.');
    }

    const { raw, hashed } = createToken();
    user.verificationToken = hashed;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(user.email, user.role, raw);
      res.status(200).json({ success: true, message: 'Verification link resent to your email.' });
    } catch (emailErr) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent. Please try again.');
    }
  } catch (error) {
    next(error);
  }
};

// ─── EXPORTED ROUTE HANDLERS ──────────────────────────────────────────────────

const registerUser  = (req, res, next) => registerAccount(req, res, next, 'guest');
const registerAdmin = (req, res, next) => registerAccount(req, res, next, 'admin');

const loginUser  = (req, res, next) => loginAccount(req, res, next, ['guest']);
const loginAdmin = (req, res, next) => loginAccount(req, res, next, ['admin', 'superAdmin']);

const forgotUserPassword  = (req, res, next) => forgotPasswordAccount(req, res, next, 'guest');
const forgotAdminPassword = (req, res, next) => forgotPasswordAccount(req, res, next, 'admin');

export {
  forgotAdminPassword,
  forgotUserPassword,
  loginAdmin,
  loginUser,
  registerAdmin,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
};
