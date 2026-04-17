import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      enum: ['Reception', 'Management', 'Housekeeping', 'Security', 'SuperAdmin'],
      default: 'Reception',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
