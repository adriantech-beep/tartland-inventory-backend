import Orders from "../models/Orders.js";
import ProductionLog from "../models/ProductionLog.js";

export const getAvailableStock = async (req, res) => {
  try {
    const produced = await ProductionLog.aggregate([
      {
        $group: {
          _id: "$flavor",
          totalBundles: { $sum: "$totalBundles" },
        },
      },
    ]);

    const ordered = await Orders.aggregate([
      {
        $group: {
          _id: "$flavorName",
          totalOrdered: { $sum: "$bundleCount" },
        },
      },
    ]);

    const orderedMap = new Map();
    ordered.forEach((o) => {
      orderedMap.set(o._id, o.totalOrdered);
    });

    const available = produced.map((prod) => {
      const orderedCount = orderedMap.get(prod._id) || 0;
      return {
        flavor: prod._id,
        availableBundles: prod.totalBundles - orderedCount,
      };
    });

    res.status(200).json({ available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch available stock" });
  }
};
