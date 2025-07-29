import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    flavor: {
      type: String,
      required: true,
      unique: true, // so only one entry per flavor
    },
    availableBundles: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
