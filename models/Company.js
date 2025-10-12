import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
