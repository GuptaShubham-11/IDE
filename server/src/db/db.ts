import mongoose from 'mongoose';
import { DB_NAME } from '../constant';

const dbToConnect = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log(
      `✅ MongoDB connected! 🛢️ DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
};

export default dbToConnect;
