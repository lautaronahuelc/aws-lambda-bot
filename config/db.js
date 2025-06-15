import mongoose from 'mongoose';
import 'dotenv/config';

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB connected successfully on ${process.env.NODE_ENV}.`);
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;