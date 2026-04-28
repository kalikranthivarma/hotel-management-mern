import sharp from 'sharp';
import { getBucket } from '../config/gridfs.js';

const MENU_IMAGE_MAX_WIDTH = 720;
const MENU_IMAGE_MAX_HEIGHT = 480;
const MENU_IMAGE_QUALITY = 72;

/**
 * Optimize a menu image for card-sized delivery before storing it.
 * @param {Buffer} buffer
 * @returns {Promise<{ buffer: Buffer, filenameSuffix: string, mimetype: string }>}
 */
export const optimizeMenuImageBuffer = async (buffer) => {
  const optimizedBuffer = await sharp(buffer)
    .rotate()
    .resize(MENU_IMAGE_MAX_WIDTH, MENU_IMAGE_MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: MENU_IMAGE_QUALITY,
      effort: 4,
    })
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    filenameSuffix: '.webp',
    mimetype: 'image/webp',
  };
};

const createMenuCardTransform = ({ width, height, fit }) => {
  const hasResize = Number.isFinite(width) || Number.isFinite(height);
  if (!hasResize) return null;

  return sharp()
    .rotate()
    .resize(width, height, {
      fit: fit || 'cover',
      withoutEnlargement: true,
    })
    .webp({
      quality: MENU_IMAGE_QUALITY,
      effort: 4,
    });
};

/**
 * Upload a file buffer to GridFS.
 * @param {Buffer} buffer
 * @param {string} originalname
 * @param {string} mimetype
 * @param {string} prefix
 * @returns {Promise<string>}
 */
export const uploadToGridFS = (buffer, originalname, mimetype, prefix = '') => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const filename = `${prefix ? `${prefix}-` : ''}${Date.now()}-${originalname}`;
    const uploadStream = bucket.openUploadStream(filename, { contentType: mimetype });
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(filename));
    uploadStream.on('error', reject);
  });
};

/**
 * Delete a file from GridFS by its stored filename.
 * @param {string} filename
 */
export const deleteFromGridFS = async (filename) => {
  if (!filename) return;
  const bucket = getBucket();
  const files = await bucket.find({ filename }).toArray();
  if (files.length > 0) {
    await bucket.delete(files[0]._id);
  }
};

/**
 * Read a GridFS file into memory.
 * @param {string} filename
 * @returns {Promise<{ buffer: Buffer, contentType: string | undefined }>}
 */
export const readFromGridFS = (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bucket = getBucket();
      const files = await bucket.find({ filename }).toArray();
      if (!files || files.length === 0) {
        reject(new Error('Image not found'));
        return;
      }

      const chunks = [];
      const downloadStream = bucket.openDownloadStreamByName(filename);
      downloadStream.on('data', (chunk) => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType: files[0].contentType,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Stream an image from GridFS to the HTTP response.
 * @param {string} filename
 * @param {object} res
 * @param {function} next
 */
export const streamImageFromGridFS = async (filename, res, next, options = {}) => {
  try {
    const bucket = getBucket();
    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) {
      res.status(404);
      throw new Error('Image not found');
    }

    const transform = createMenuCardTransform(options);
    res.set('Content-Type', transform ? 'image/webp' : files[0].contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    const downloadStream = bucket.openDownloadStreamByName(filename);

    if (transform) {
      downloadStream.pipe(transform).pipe(res);
      return;
    }

    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Extract the filename from a GridFS image path.
 * @param {string} imagePath
 * @returns {string}
 */
export const extractFilename = (imagePath) => {
  if (!imagePath) return '';
  return imagePath.split('/').pop();
};
