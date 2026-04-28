import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://Sowmya:Sowmya@ac-z9qpnek-shard-00-00.doivzzv.mongodb.net:27017,ac-z9qpnek-shard-00-01.doivzzv.mongodb.net:27017,ac-z9qpnek-shard-00-02.doivzzv.mongodb.net:27017/hotel-management?ssl=true&replicaSet=atlas-z9qpnek-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected successfully to MongoDB Bypass String");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error bypass:", err.message);
    process.exit(1);
  });
