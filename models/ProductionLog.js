import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    flavor: { type: String, required: true },
    mixtureCount: { type: Number, required: true },
    totalJars: { type: Number, required: true },
    totalBundles: { type: Number, required: true },

    materialsUsed: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: false },
        name: { type: String, required: true },
        type: { type: String, required: true },

        perGrams: { type: Number },
        perBox: { type: Number },

        bagsUsed: { type: Number },
        gramsUsed: { type: Number },

        jarsUsed: { type: Number },

        fullBoxesUsed: { type: Number },
        leftoverBags: { type: Number },
        leftoverBoxFraction: { type: Number },
        leftoverJars: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductionLog", productionSchema);
