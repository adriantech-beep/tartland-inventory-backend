import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rawMaterial: {
      id: String,
      name: String,
      perGrams: Number,
      perBox: Number,
    },
    boxCount: Number,
    totalUnits: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
