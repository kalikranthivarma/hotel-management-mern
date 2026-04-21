
import mongoose from 'mongoose';

const tableReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiningTable',
      required: true,
    },
    tableNumber: {
      type: String, // Cached for easier display
      required: true,
    },
    reservationTime: {
      type: Date,
      required: true,
    },
    guestsCount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Confirmed', // Default to confirmed for simpler UX, can be changed later
    },
    specialRequests: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TableReservation', tableReservationSchema);
