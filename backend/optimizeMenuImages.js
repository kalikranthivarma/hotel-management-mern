import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import MenuItem from './models/MenuItem.js';
import {
  deleteFromGridFS,
  extractFilename,
  optimizeMenuImageBuffer,
  readFromGridFS,
  uploadToGridFS,
} from './utils/imageUtils.js';

dotenv.config();

const optimizeExistingMenuImages = async () => {
  await connectDB();

  const menuItems = await MenuItem.find({ image: { $ne: '' } });
  let updatedCount = 0;

  for (const menuItem of menuItems) {
    const currentFilename = extractFilename(menuItem.image);
    if (!currentFilename) continue;

    const { buffer } = await readFromGridFS(currentFilename);
    const optimizedImage = await optimizeMenuImageBuffer(buffer);
    const normalizedFilename = `${path.parse(currentFilename).name}${optimizedImage.filenameSuffix}`;
    const newFilename = await uploadToGridFS(
      optimizedImage.buffer,
      normalizedFilename,
      optimizedImage.mimetype,
      'menu',
    );

    menuItem.image = `/api/menu/image/${newFilename}`;
    await menuItem.save();
    await deleteFromGridFS(currentFilename);
    updatedCount += 1;

    console.log(`Optimized ${menuItem.name}`);
  }

  console.log(`Optimized ${updatedCount} menu images.`);
};

optimizeExistingMenuImages()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Failed to optimize menu images:', error);
    await mongoose.disconnect();
    process.exit(1);
  });
