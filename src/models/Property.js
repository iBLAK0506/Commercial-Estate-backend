import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    images: [String],
    price: { type: Number, required: true },
    city: String,
    address: String,

    // --- THIS IS THE FIX ---
    // 1. Renamed the old 'type' field to 'property' to match your form
    property: {
      type: String,
      enum: ["apartment", "house", "condo", "land", "other"],
      required: true,
    },
    // 2. Added a new 'type' field for "buy" or "rent"
    type: {
      type: String,
      enum: ["buy", "rent"],
      required: true,
    },
    // --- END OF FIX ---

    beds: Number,
    baths: Number,
    sqft: Number,
    amenities: [String],
    latitude: String, // Changed to String to accept text input
    longitude: String, // Changed to String to accept text input
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", propertySchema);
