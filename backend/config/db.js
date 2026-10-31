import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("[DB] MONGODB_URI not found in environment. Using local JSON store fallback.");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[DB] MongoDB connection failed: ${error.message}`);
    console.log("[DB] Continuing with local JSON store fallback.");
    isConnected = false;
    return false;
  }
};

export const isDbConnected = () => isConnected;

