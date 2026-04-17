import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['single', 'double', 'deluxe', 'suite', 'family', 'presidential'],
      required: true,
    },
    bedType: {
      type: String,
      enum: ['single', 'double', 'twin', 'king', 'queen'],
      required: true,
    },
    view: {
      type: String,
      enum: ['garden', 'pool', 'city', 'mountain', 'sea', 'courtyard'],
      default: 'garden',
    },
    floor: {
      type: Number,
      required: true,
    },
    size: {
      type: Number, // in sq. ft.
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);