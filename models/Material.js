import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    perBox: { type: Number, required: true },
    perGrams: { type: Number, required: true },
    rawMaterialCategory: { type: String, required: true },
    unit: { type: String, default: "box" },
  },
  { timestamps: true }
);

export default mongoose.model("MaterialSettings", materialSchema);
