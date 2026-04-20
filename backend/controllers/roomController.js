import multer from 'multer';
import path from 'path';
import Room from '../models/Room.js';
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

// @desc    Stream room image from GridFS
// @route   GET /api/rooms/image/:filename
// @access  Public
export const getRoomImage = async (req, res, next) => {
  await streamImageFromGridFS(req.params.filename, res, next);
};

//  PUBLIC CONTROLLERS

// GET /api/rooms  Get all active rooms with optional filters
const getAllRooms = async (req, res, next) => {
  try {
    const { type, minPrice, maxPrice, maxGuests, view, bedType, isAvailable } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (view) filter.view = view;
    if (bedType) filter.bedType = bedType;
    if (maxGuests) filter.maxGuests = { $gte: Number(maxGuests) };
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(filter).sort({ isFeatured: -1, pricePerNight: 1 });

    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    next(error);
  }
};

// GET /api/rooms/featured  Get featured rooms (for home page)
const getFeaturedRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true, isFeatured: true }).sort({ pricePerNight: 1 });
    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    next(error);
  }
};

// GET /api/rooms/:id  Get a single room by ID
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room || !room.isActive) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

//  ADMIN-ONLY CONTROLLERS

// POST /api/rooms  Create a new room (Admin only)
const createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      title,
      description,
      type,
      bedType,
      view,
      floor,
      size,
      pricePerNight,
      maxGuests,
      amenities,
      isFeatured,
    } = req.body;

    if (!roomNumber || !title || !description || !type || !bedType || !floor || !size || !pricePerNight || !maxGuests) {
      res.status(400);
      throw new Error('Please provide all required room fields');
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      res.status(409);
      throw new Error(`Room number ${roomNumber} already exists`);
    }

    // Handle file upload if an image was provided
    let images = [];
    if (req.file) {
      const filename = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype, 'room');
      images = [`/api/rooms/image/${filename}`];
    }

    const room = await Room.create({
      roomNumber,
      title,
      description,
      type,
      bedType,
      view,
      floor,
      size,
      pricePerNight,
      maxGuests,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',').map(a => a.trim())) : [],
      images,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    res.status(201).json({ success: true, message: 'Room created successfully', room });
  } catch (error) {
    next(error);
  }
};

// PUT /api/rooms/:id  Update a room (Admin only)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const updateData = { ...req.body };

    // Handle new image upload
    if (req.file) {
      // Delete old GridFS images for this room
      for (const img of room.images) {
        if (img.startsWith('/api/rooms/image/')) {
          await deleteFromGridFS(extractFilename(img));
        }
      }
      const filename = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype, 'room');
      updateData.images = [`/api/rooms/image/${filename}`];
    }

    if (updateData.amenities && !Array.isArray(updateData.amenities)) {
      updateData.amenities = updateData.amenities.split(',').map(a => a.trim());
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rooms/:id/availability  Toggle room availability (Admin only)
const toggleRoomAvailability = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.status(200).json({
      success: true,
      message: `Room is now ${room.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: room.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/rooms/:id  Soft-delete a room (Admin only)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    room.isActive = false;
    await room.save();

    res.status(200).json({ success: true, message: 'Room removed successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createRoom,
  deleteRoom,
  getAllRooms,
  getFeaturedRooms,
  getRoomById,
  toggleRoomAvailability,
  updateRoom,
};
