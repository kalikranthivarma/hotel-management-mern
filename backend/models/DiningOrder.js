
import mongoose from 'mongoose';

const diningOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },
        name: String, // Cached for order history
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    orderType: {
      type: String,
      enum: ['Room Service', 'In-Restaurant'],
      required: true,
    },
    roomNumber: {
      type: String, // Used if orderType is 'Room Service'
    },
    tableNumber: {
      type: String, // Used if orderType is 'In-Restaurant'
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Out for Delivery', 'Served', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Online', 'Cash', 'Card'],
      default: 'Cash',
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    orderTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('DiningOrder', diningOrderSchema);
