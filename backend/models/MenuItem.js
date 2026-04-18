
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Salad', 'Soup', 'Chef Specials'],
    },
    image: {
      type: String,
      default: '',
    },
    dietaryInfo: {
      type: [String],
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Gluten-Free', 'Spicy'],
      default: ['Non-Veg'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isSignatureDish: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
