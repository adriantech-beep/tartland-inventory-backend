import ProductionLog from "../models/ProductionLog.js";

import Inventory from "../models/Inventory.js";
import Stock from "../models/Stock.js";

export const createProductionLog = async (req, res, next) => {
  const { flavor, mixtureCount, totalJars, totalBundles, materialsUsed } =
    req.body;

  try {
    for (const mat of materialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });

      if (!inventoryItem) {
        return res.status(400).json({
          message: `Material not found in inventory: ${mat.name}`,
        });
      }

      const currentUnits = inventoryItem.totalUnits;

      const requiredUnits = mat.type === "jar" ? mat.jarsUsed : mat.bagsUsed;

      if (currentUnits < requiredUnits) {
        return res.status(422).json({
          message: `Insufficient stock for ${mat.name}. Required: ${requiredUnits}, Available: ${currentUnits}`,
        });
      }
    }

    const newProductionLog = new ProductionLog({
      flavor,
      mixtureCount,
      totalJars,
      totalBundles,
      materialsUsed,
    });

    await newProductionLog.save();

    for (const mat of materialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });

      const bagsPerBox = mat.perBox;
      let remainingUnits = inventoryItem.totalUnits;

      const used = mat.type === "jar" ? mat.jarsUsed : mat.bagsUsed;
      remainingUnits -= used;

      const updatedBoxCount = Math.floor(remainingUnits / bagsPerBox);

      await Inventory.updateOne(
        { _id: inventoryItem._id },
        {
          $set: {
            boxCount: updatedBoxCount,
            totalUnits: remainingUnits,
          },
        }
      );
    }

    await Stock.findOneAndUpdate(
      { flavor },
      { $inc: { availableBundles: totalBundles } },
      { upsert: true, new: true }
    );
    res.status(201).json(newProductionLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save production log." });
  }
};

export const getProductionLog = async (req, res, next) => {
  try {
    const productionLog = await ProductionLog.find();

    const formatted = productionLog.map((prod) =>
      prod.toObject({ getters: true })
    );
    res.status(200).json({ productionLog: formatted });
  } catch (err) {
    const error = new HttpError("Fetching production logs failed", 500);
    return next(error);
  }
};

export const deleteProductionLog = async (req, res, next) => {
  try {
    const production = await ProductionLog.findById(req.params.id);

    if (!production) {
      return res.status(404).json({ message: "Production log not found." });
    }

    for (const mat of production.materialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });

      if (!inventoryItem) continue;

      const unitsToRestore =
        typeof mat.jarsUsed === "number" ? mat.jarsUsed : mat.bagsUsed;

      if (typeof unitsToRestore !== "number") continue;

      const newTotalUnits = inventoryItem.totalUnits + unitsToRestore;
      const newBoxCount = mat.perBox
        ? Math.floor(newTotalUnits / mat.perBox)
        : inventoryItem.boxCount;

      await Inventory.updateOne(
        { _id: inventoryItem._id },
        {
          $set: {
            totalUnits: newTotalUnits,
            boxCount: newBoxCount,
          },
        }
      );
    }

    await ProductionLog.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Production deleted and inventory restored." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete production log." });
  }
};

export const editProductionLog = async (req, res) => {
  const { id } = req.params;
  const {
    flavor,
    mixtureCount,
    totalJars,
    totalBundles,
    materialsUsed: newMaterialsUsed,
  } = req.body;

  try {
    const existingLog = await ProductionLog.findById(id);
    if (!existingLog) {
      return res.status(404).json({ message: "Production log not found" });
    }

    for (const mat of existingLog.materialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });
      if (!inventoryItem) continue;

      const used = mat.type === "jar" ? mat.jarsUsed : mat.bagsUsed;
      inventoryItem.totalUnits += used;

      const updatedBoxCount = Math.floor(inventoryItem.totalUnits / mat.perBox);
      inventoryItem.boxCount = updatedBoxCount;
      await inventoryItem.save();
    }

    for (const mat of newMaterialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });
      if (!inventoryItem) {
        return res
          .status(400)
          .json({ message: `Material not found: ${mat.name}` });
      }

      const required = mat.type === "jar" ? mat.jarsUsed : mat.bagsUsed;
      if (inventoryItem.totalUnits < required) {
        return res.status(422).json({
          message: `Insufficient stock for ${mat.name}. Required: ${required}, Available: ${inventoryItem.totalUnits}`,
        });
      }
    }

    existingLog.flavor = flavor;
    existingLog.mixtureCount = mixtureCount;
    existingLog.totalJars = totalJars;
    existingLog.totalBundles = totalBundles;
    existingLog.materialsUsed = newMaterialsUsed;
    await existingLog.save();

    for (const mat of newMaterialsUsed) {
      if (!mat.id) continue;

      const inventoryItem = await Inventory.findOne({
        "rawMaterial.id": mat.id,
      });
      const used = mat.type === "jar" ? mat.jarsUsed : mat.bagsUsed;
      inventoryItem.totalUnits -= used;

      const updatedBoxCount = Math.floor(inventoryItem.totalUnits / mat.perBox);
      inventoryItem.boxCount = updatedBoxCount;
      await inventoryItem.save();
    }

    res
      .status(200)
      .json({ message: "Production log updated", updatedLog: existingLog });
  } catch (err) {
    console.error("Error editing production log:", err);
    res.status(500).json({ message: "Failed to edit production log" });
  }
};
