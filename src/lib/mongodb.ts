// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/formDB";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let isConnected = false; // track connection state

export const connectDB = async (): Promise<void> => {
  if (isConnected) return; // prevent multiple connections

  try {
    await mongoose.connect(MONGODB_URI); // connect via Mongoose
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// ✅ Usage in API route:
// import { connectDB } from "@/lib/mongodb";
// await connectDB();
// const newUser = new User({ ... });
// await newUser.save();
