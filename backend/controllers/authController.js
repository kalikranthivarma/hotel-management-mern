import crypto from 'crypto';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// ─── HELPER: shared OTP + email logic ───────────────────────────────────────

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const sendOTPEmail = async (email, name, role, otp, isReset = false) => {
  const action = isReset ? 'Reset Your Password' : 'Verify Your Email';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:10px;">
      <h2 style="color:#1a3c5e;text-align:center;">Hotel Management 🏨</h2>
      <h3 style="text-align:center;">${action}</h3>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your 6-digit One-Time Password (OTP) is:</p>
      <div style="text-align:center;margin:30px 0;">
        <span style="display:inline-block;padding:15px 30px;background:#f4f4f4;border:2px dashed #1a3c5e;font-size:24px;font-weight:bold;letter-spacing:5px;color:#1a3c5e;">
          ${otp}
        </span>
      </div>
      <p style="text-align:center;color:#888;font-size:14px;">This OTP is valid for 10 minutes.</p>
    </div>
  `;
  await sendEmail({ email, subject: `Hotel Management – ${action}`, html });
};

// ─── USER (GUEST) CONTROLLERS ─────────────────────────────────────────────────

// Step 1: Send OTP to User
const registerUserStep1 = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400);
      throw new Error('Please provide first name, last name, and email');
    }

    const emailLower = email.toLowerCase();
    let user = await User.findOne({ email: emailLower });

    if (user && user.verified && user.password) {
      res.status(409);
      throw new Error('An account with this email already exists and is fully registered.');
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email: emailLower,
        verified: false,
        otp,
        otpExpires,
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save({ validateBeforeSave: false });
    }

    try {
      await sendOTPEmail(user.email, user.firstName, 'user', otp, false);
      res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent. Contact support.');
    }
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify User OTP
const verifyUserOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires');

    if (!user) {
      res.status(404);
      throw new Error('Account not found');
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully! You can now proceed.' });
  } catch (error) {
    next(error);
  }
};

// Step 3: Complete User Registration
const registerUserStep3 = async (req, res, next) => {
  try {
    const { email, phone, address, idProof, password, confirmPassword } = req.body;

    if (!email || !phone || !password || !confirmPassword) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error('Account not found');
    }

    if (!user.verified) {
      res.status(401);
      throw new Error('Please verify your email first');
    }

    user.phone = phone;
    user.address = address;
    user.idProof = idProof;
    user.password = password;
    await user.save(); // Password will be hashed by pre-save hook 

    const token = generateToken(user._id, user.role || 'guest');

    res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        role: user.role || 'guest',
      },
    });
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

    // Block admin/superAdmin accounts from using the guest login portal
    if (user.role === 'admin' || user.role === 'superAdmin') {
      res.status(403);
      throw new Error('Staff accounts must log in through the Staff Portal (/admin/login)');
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
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        role: user.role || 'guest',
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotUserPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      res.status(404);
      throw new Error('No guest account found with that email');
    }

    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await sendOTPEmail(user.email, user.firstName, 'user', otp, true);
      res.status(200).json({ success: true, message: 'Password reset OTP sent to your email.' });
    } catch (err) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
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
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      res.status(400);
      throw new Error('Please provide all details');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordOtp +resetPasswordOtpExpires');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.resetPasswordOtp !== otp || user.resetPasswordOtpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN (STAFF) CONTROLLERS ────────────────────────────────────────────────

// Step 1: Send OTP to Admin
const registerAdminStep1 = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400);
      throw new Error('Please provide first name, last name, and email');
    }

    const emailLower = email.toLowerCase();
    let admin = await Admin.findOne({ email: emailLower });

    if (admin && admin.verified && admin.password) {
      res.status(409);
      throw new Error('A staff account with this email already exists and is fully registered.');
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (!admin) {
      admin = await Admin.create({
        firstName,
        lastName,
        email: emailLower,
        role: 'admin',
        verified: false,
        otp,
        otpExpires,
      });
    } else {
      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.role = admin.role === 'superAdmin' ? 'superAdmin' : 'admin';
      admin.otp = otp;
      admin.otpExpires = otpExpires;
      await admin.save({ validateBeforeSave: false });
    }

    try {
      await sendOTPEmail(admin.email, admin.firstName, 'admin', otp, false);
      res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
      admin.otp = undefined;
      admin.otpExpires = undefined;
      await admin.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent.');
    }
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify Admin OTP
const verifyAdminOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires');

    if (!admin) {
      res.status(404);
      throw new Error('Staff account not found');
    }

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    admin.verified = true;
    admin.role = admin.role === 'superAdmin' ? 'superAdmin' : 'admin';
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully! You can now proceed.' });
  } catch (error) {
    next(error);
  }
};

// Step 3: Complete Admin Registration
const registerAdminStep3 = async (req, res, next) => {
  try {
    const { email, phone, employeeId, department, password, confirmPassword } = req.body;

    if (!email || !phone || !employeeId || !department || !password || !confirmPassword) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      res.status(404);
      throw new Error('Account not found');
    }

    if (!admin.verified) {
      res.status(401);
      throw new Error('Please verify your email first');
    }

    if (await Admin.findOne({ employeeId })) {
      res.status(409);
      throw new Error('This Employee ID is already registered');
    }

    admin.phone = phone;
    admin.employeeId = employeeId;
    admin.department = department;
    admin.role = admin.role === 'superAdmin' ? 'superAdmin' : 'admin';
    admin.password = password;
    await admin.save();

    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      success: true,
      message: 'Staff registration completed successfully!',
      token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        employeeId: admin.employeeId,
        role: admin.role,
      },
    });
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

    // Block guest accounts from using the staff login portal
    if (admin.role !== 'admin' && admin.role !== 'superAdmin') {
      res.status(403);
      throw new Error('This account does not have staff privileges. Please use the Guest Login page instead.');
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      message: 'Welcome, Staff Member!',
      token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
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
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });

    if (!admin) {
      res.status(404);
      throw new Error('No staff account found with that email');
    }

    const otp = generateOTP();
    admin.resetPasswordOtp = otp;
    admin.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
    await admin.save({ validateBeforeSave: false });

    try {
      await sendOTPEmail(admin.email, admin.firstName, 'admin', otp, true);
      res.status(200).json({ success: true, message: 'Password reset OTP sent to your email.' });
    } catch (err) {
      admin.resetPasswordOtp = undefined;
      admin.resetPasswordOtpExpires = undefined;
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
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      res.status(400);
      throw new Error('Please provide all details');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+resetPasswordOtp +resetPasswordOtpExpires');

    if (!admin) {
      res.status(404);
      throw new Error('Staff not found');
    }

    if (admin.resetPasswordOtp !== otp || admin.resetPasswordOtpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    admin.password = password;
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordOtpExpires = undefined;
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
  registerAdminStep1,
  registerAdminStep3,
  registerUserStep1,
  registerUserStep3,
  resetAdminPassword,
  resetUserPassword,
  verifyAdminOTP,
  verifyUserOTP,
};
