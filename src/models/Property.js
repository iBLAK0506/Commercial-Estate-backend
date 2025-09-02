import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  city: String,
  address: String,
  type: { type: String, enum: ["apartment", "house", "condo", "land", "other"], default: "apartment" },
  beds: Number,
  baths: Number,
  sqft: Number,
  amenities: [String],
  location: {
    lat: Number,
    lng: Number
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Property = mongoose.model("Property", propertySchema);
