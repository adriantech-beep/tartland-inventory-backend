import mongoose from "mongoose";

const mixtureRuleSchema = new mongoose.Schema(
  {
    flavor: {
      type: String,
      required: true,
      unique: true,
    },
    mixtureCount: {
      type: Number,
      required: true,
    },

    bagsPerMixture: [
      {
        material: {
          id: { type: mongoose.Types.ObjectId, required: true },
          name: { type: String, required: true },
          perGrams: { type: Number, required: true },
          perBox: { type: Number, required: true },
        },
        count: { type: Number, required: true },
      },
    ],
    jarMaterial: {
      id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      perGrams: { type: Number, required: true },
      perBox: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("MixtureRule", mixtureRuleSchema);
