import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo() {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  console.log("=> using new database connection");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    // THIS IS THE MOST IMPORTANT LOG. IF YOU SEE THIS, IT'S WORKING.
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    // THIS LOG WILL SHOW THE EXACT CONNECTION ERROR.
    console.error("❌ MONGODB CONNECTION FAILED:", error);
  }
}
