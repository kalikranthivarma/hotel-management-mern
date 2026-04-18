
import multer from 'multer';
import path from 'path';
import MenuItem from '../models/MenuItem.js';

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/menu');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, isAvailable, isSignatureDish } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isAvailable) filter.isAvailable = isAvailable === 'true';
    if (isSignatureDish) filter.isSignatureDish = isSignatureDish === 'true';

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new menu item
// @route   POST /api/menu
// @access  Private/Admin
export const addMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, dietaryInfo, isSignatureDish } = req.body;
    
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/menu/${req.file.filename}`;
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      dietaryInfo: dietaryInfo ? dietaryInfo.split(',') : ['Non-Veg'],
      isSignatureDish: isSignatureDish === 'true',
      image: imagePath,
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/menu/${req.file.filename}`;
    }

    if (req.body.dietaryInfo) {
      updateData.dietaryInfo = req.body.dietaryInfo.split(',');
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    await menuItem.deleteOne();
    res.status(200).json({ success: true, message: 'Menu item removed' });
  } catch (error) {
    next(error);
  }
};

export { upload };
