import crypto from 'crypto';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// ─── HELPER: shared token + email logic ──────────────────────────────────────

const createVerificationToken = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
};

const sendVerificationEmail = async (email, role, rawToken, res) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/${role}/verify-email/${rawToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1a3c5e">Welcome to Hotel Management 🏨</h2>
      <p>You have registered as a <strong>${role}</strong>. Please verify your email:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1a3c5e;color:#fff;border-radius:6px;text-decoration:none;">
        Verify Email
      </a>
      <p style="color:#888;font-size:12px;margin-top:20px">This link expires in 24 hours.</p>
    </div>
  `;
  await sendEmail({ email, subject: 'Hotel Management – Verify Your Email', html });
};

const sendResetEmail = async (email, role, rawToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/${role}/reset-password/${rawToken}`;
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

// ─── USER (GUEST) CONTROLLERS ─────────────────────────────────────────────────

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone, address, idProof } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    if (await User.findOne({ email: email.toLowerCase() })) {
      res.status(409);
      throw new Error('A guest account with this email already exists');
    }

    const { raw, hashed } = createVerificationToken();

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      address,
      idProof,
      verified: false,
      verificationToken: hashed,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(user.email, 'user', raw, res);
      res.status(201).json({ success: true, message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Registration saved but email could not be sent. Contact support.');
    }
  } catch (error) {
    next(error);
  }
};

const verifyUserEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken: hashed, verificationTokenExpires: { $gt: Date.now() } });

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

const loginUser = async (req, res, next) => {
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

    if (!user.verified) {
      res.status(401);
      throw new Error('Please verify your email before logging in');
    }

    const token = generateToken(user._id, 'user');

    res.status(200).json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotUserPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error('No guest account found with that email');
    }

    const { raw, hashed } = createVerificationToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await sendResetEmail(user.email, 'user', raw);
      res.status(200).json({ success: true, message: 'Reset link sent to your email' });
    } catch (err) {
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

const resetUserPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });

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

// ─── ADMIN (STAFF) CONTROLLERS ────────────────────────────────────────────────

const registerAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone, employeeId, department } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !employeeId || !department) {
      res.status(400);
      throw new Error('Please fill in all required staff fields');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    if (await Admin.findOne({ email: email.toLowerCase() })) {
      res.status(409);
      throw new Error('A staff account with this email already exists');
    }

    if (await Admin.findOne({ employeeId })) {
      res.status(409);
      throw new Error('This Employee ID is already registered');
    }

    const { raw, hashed } = createVerificationToken();

    const admin = await Admin.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      employeeId,
      department,
      verified: false,
      verificationToken: hashed,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(admin.email, 'admin', raw, res);
      res.status(201).json({ success: true, message: 'Staff registered! Please check your email to verify your account.' });
    } catch (err) {
      admin.verificationToken = undefined;
      admin.verificationTokenExpires = undefined;
      await admin.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Registration saved but email could not be sent. Contact support.');
    }
  } catch (error) {
    next(error);
  }
};

const verifyAdminEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const admin = await Admin.findOne({ verificationToken: hashed, verificationTokenExpires: { $gt: Date.now() } });

    if (!admin) {
      res.status(400);
      throw new Error('Invalid or expired verification link');
    }

    admin.verified = true;
    admin.verificationToken = undefined;
    admin.verificationTokenExpires = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: 'Staff email verified! You can now log in.' });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide your email and password');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!admin.verified) {
      res.status(401);
      throw new Error('Please verify your email before logging in');
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      message: 'Welcome, Staff Member!',
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        department: admin.department,
        employeeId: admin.employeeId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotAdminPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email?.toLowerCase() });

    if (!admin) {
      res.status(404);
      throw new Error('No staff account found with that email');
    }

    const { raw, hashed } = createVerificationToken();
    admin.resetPasswordToken = hashed;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save({ validateBeforeSave: false });

    try {
      await sendResetEmail(admin.email, 'admin', raw);
      res.status(200).json({ success: true, message: 'Reset link sent to your email' });
    } catch (err) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

const resetAdminPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const admin = await Admin.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });

    if (!admin) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    if (!req.body.password || req.body.password !== req.body.confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export {
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
};
