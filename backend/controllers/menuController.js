import multer from 'multer';
import path from 'path';
import MenuItem from '../models/MenuItem.js';
import { uploadToGridFS, deleteFromGridFS, streamImageFromGridFS, extractFilename } from '../utils/imageUtils.js';

// Use memory storage — files are held in buffer, then streamed to GridFS
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  },
});

// @desc    Stream image from GridFS
// @route   GET /api/menu/image/:filename
// @access  Public
export const getMenuImage = async (req, res, next) => {
  await streamImageFromGridFS(req.params.filename, res, next);
};

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

    let imageFilename = '';
    if (req.file) {
      imageFilename = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype, 'menu');
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      dietaryInfo: dietaryInfo ? dietaryInfo.split(',') : ['Non-Veg'],
      isSignatureDish: isSignatureDish === 'true',
      image: imageFilename ? `/api/menu/image/${imageFilename}` : '',
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
      // Delete old image from GridFS before uploading new one
      if (menuItem.image) {
        await deleteFromGridFS(extractFilename(menuItem.image));
      }
      const newFilename = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype, 'menu');
      updateData.image = `/api/menu/image/${newFilename}`;
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

    // Delete image from GridFS too
    if (menuItem.image) {
      await deleteFromGridFS(extractFilename(menuItem.image));
    }

    await menuItem.deleteOne();
    res.status(200).json({ success: true, message: 'Menu item removed' });
  } catch (error) {
    next(error);
  }
};
