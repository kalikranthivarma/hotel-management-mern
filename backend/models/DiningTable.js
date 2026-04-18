
import mongoose from 'mongoose';

const diningTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      enum: ['Indoor', 'Outdoor', 'Rooftop', 'Balcony', 'Private Room'],
      default: 'Indoor',
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Occupied'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

export default mongoose.model('DiningTable', diningTableSchema);
