import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    flavorName: { type: String, required: true },
    orderCount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", ordersSchema);
