
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // ─── Common Fields ────────────────────────────────────────────────────────
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
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    // ─── Role (guest | admin | superAdmin) ───────────────────────────────────
    role: {
      type: String,
      enum: ['guest', 'admin', 'superAdmin'],
      default: 'guest',
    },

    // ─── Guest-Only Fields ────────────────────────────────────────────────────
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    idProof: { type: String, trim: true },
    loyaltyPoints: { type: Number, default: 0 },

    // ─── Staff-Only Fields (admin | superAdmin) ───────────────────────────────
    employeeId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs without this field (for guests)
      trim: true,
    },
    department: {
      type: String,
      enum: ['Front Desk', 'Reception', 'Management', 'Housekeeping', 'Security', 'Kitchen', 'IT', 'Maintenance'],
    },


    // ─── Auth / Token Fields ─────────────────────────────────────────────────
    verified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

