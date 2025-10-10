import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["admin", "staff", "moderator"],
      default: "staff",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
