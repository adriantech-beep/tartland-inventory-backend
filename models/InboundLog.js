// models/InboundLog.js

import mongoose from "mongoose";

const inboundLogSchema = new mongoose.Schema(
  {
    rawMaterial: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "MaterialSettings",
      },
      name: { type: String, required: true },
      perGrams: Number,
      perBox: Number,
    },
    boxCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InboundLog", inboundLogSchema);
