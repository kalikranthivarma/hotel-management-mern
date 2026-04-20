import mongoose from 'mongoose';

let bucket;

// Call this AFTER mongoose has connected
export const initGridFS = () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'menuImages',
  });
  console.log('GridFS bucket initialized');
  return bucket;
};

export const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFS bucket has not been initialized. Call initGridFS() first.');
  }
  return bucket;
};
