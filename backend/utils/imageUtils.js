import { getBucket } from '../config/gridfs.js';

/**
 * Upload a file buffer to GridFS.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalname - Original file name
 * @param {string} mimetype - MIME type of the file
 * @param {string} prefix - Optional prefix to namespace files (e.g. 'room', 'menu')
 * @returns {Promise<string>} The stored filename in GridFS
 */
export const uploadToGridFS = (buffer, originalname, mimetype, prefix = '') => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const filename = `${prefix ? prefix + '-' : ''}${Date.now()}-${originalname}`;
    const uploadStream = bucket.openUploadStream(filename, { contentType: mimetype });
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(filename));
    uploadStream.on('error', reject);
  });
};

/**
 * Delete a file from GridFS by its stored filename.
 * @param {string} filename - The filename stored in GridFS
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
 * Stream an image from GridFS to the HTTP response.
 * @param {string} filename - The filename to stream
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware
 */
export const streamImageFromGridFS = async (filename, res, next) => {
  try {
    const bucket = getBucket();
    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) {
      res.status(404);
      throw new Error('Image not found');
    }
    res.set('Content-Type', files[0].contentType || 'image/jpeg');
    // Cache for 7 days — images in GridFS are immutable once stored
    res.set('Cache-Control', 'public, max-age=604800');
    bucket.openDownloadStreamByName(filename).pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Extract the filename from a GridFS image path (e.g. '/api/menu/image/abc.jpg' -> 'abc.jpg')
 * @param {string} imagePath
 * @returns {string}
 */
export const extractFilename = (imagePath) => {
  if (!imagePath) return '';
  return imagePath.split('/').pop();
};
