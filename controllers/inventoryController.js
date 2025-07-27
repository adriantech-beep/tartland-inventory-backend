import { validationResult } from "express-validator";
import Inventory from "../models/Inventory.js";
import HttpError from "../models/HttpError.js";

export const createInventory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, rawMaterial, boxCount, totalUnits } = req.body;
  try {
    const newInventory = new Inventory({
      name,
      rawMaterial,
      boxCount,
      totalUnits,
    });

    const exists = await Inventory.findOne({
      "rawMaterial.id": rawMaterial.id,
    });
    if (exists) {
      return res.status(409).json({ message: "Inventory already exists" });
    }

    await newInventory.save();
    res.status(201).json(newInventory);
  } catch (err) {
    console.error(err);
    return next(new HttpError("Creating inventory failed.", 500));
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find();

    const formatted = inventory.map((prod) => prod.toObject({ getters: true }));
    res.status(200).json({ inventory: formatted });
  } catch (err) {
    const error = new HttpError("Fetching inventory list failed", 500);
    return next(error);
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Inventory list not found" });
    res.status(200).json({ message: "Inventory list deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory list", error });
  }
};

export const updateInventory = async (req, res) => {
  const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const getInventorySummary = async (req, res, next) => {
  try {
    const summary = await Inventory.aggregate([
      {
        $group: {
          _id: "$rawMaterial.id",
          name: { $first: "$name" },
          totalBoxes: { $sum: "$boxCount" },
          totalUnits: { $sum: "$totalUnits" },
        },
      },
    ]);

    res.status(200).json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch inventory summary." });
  }
};
