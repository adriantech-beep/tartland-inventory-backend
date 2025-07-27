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

        jarsUsed: { type: Number }, // only for jar material

        fullBoxesUsed: { type: Number }, // for both flakes/choco and jars
        leftoverBags: { type: Number }, // for flakes/choco only
        leftoverBoxFraction: { type: Number }, // only for jar material
        leftoverJars: { type: Number }, // only for jar material
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductionLog", productionSchema);
