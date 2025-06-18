import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected.');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected successfully on ${process.env.NODE_ENV}.`);
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;