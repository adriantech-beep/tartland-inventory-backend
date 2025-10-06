import ProductionLog from "../models/ProductionLog.js";

export const getProductsProduced = async (req, res) => {
  try {
    const produced = await ProductionLog.aggregate([
      {
        $group: {
          _id: "$flavor",
          totalBundles: { $sum: "$totalBundles" },
          totalJars: { $sum: "$totalJars" },
          totalMixtures: { $sum: "$mixtureCount" },
        },
      },
      {
        $project: {
          flavor: "$_id",
          totalBundles: 1,
          totalJars: 1,
          totalMixtures: 1,
          _id: 0,
        },
      },
      {
        $sort: { flavor: 1 }, 
      },
    ]);

    res.status(200).json({ produced });
  } catch (error) {
    console.error("Error fetching production summary:", error);
    res.status(500).json({ message: "Failed to fetch production summary" });
  }
};
