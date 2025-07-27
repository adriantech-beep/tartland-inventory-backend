import InboundLog from "../models/InboundLog.js";
import Inventory from "../models/Inventory.js";

export const addInboundLog = async (req, res) => {
  try {
    const { rawMaterial, boxCount, totalUnits } = req.body;

    if (!rawMaterial?.id || !boxCount || !totalUnits) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newInbound = await InboundLog.create({
      rawMaterial,
      boxCount,
      totalUnits,
    });

    const existing = await Inventory.findOne({
      "rawMaterial.id": rawMaterial.id,
    });

    if (existing) {
      existing.boxCount += boxCount;
      existing.totalUnits += totalUnits;
      await existing.save();
    } else {
      await Inventory.create({
        rawMaterial,
        boxCount,
        totalUnits,
        name: rawMaterial.name,
      });
    }

    res.status(201).json({
      message: "Inbound stock logged and inventory updated",
      inbound: newInbound,
    });
  } catch (error) {
    console.error("Error adding inbound log:", error);
    res.status(500).json({ message: "Failed to add inbound log" });
  }
};

export const getInboundLog = async (req, res, next) => {
  try {
    const inboundLog = await InboundLog.find();

    const formatted = inboundLog.map((prod) =>
      prod.toObject({ getters: true })
    );
    res.status(200).json({ inboundLog: formatted });
  } catch (err) {
    const error = new HttpError("Fetching raw materials failed", 500);
    return next(error);
  }
};

export const deleteInboundLog = async (req, res) => {
  try {
    const deleted = await InboundLog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Inbound log not found" });
    }

    const { rawMaterial, boxCount, totalUnits } = deleted;

    const existing = await Inventory.findOne({
      "rawMaterial.id": rawMaterial.id,
    });

    if (existing) {
      existing.boxCount -= boxCount;
      existing.totalUnits -= totalUnits;

      if (existing.boxCount <= 0 || existing.totalUnits <= 0) {
        await Inventory.deleteOne({ _id: existing._id });
      } else {
        await existing.save();
      }
    }

    res
      .status(200)
      .json({ message: "Inbound log deleted and inventory updated." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inbound log", error });
  }
};
