import HttpError from "../models/HttpError.js";
import Material from "../models/Material.js";
import { validationResult } from "express-validator";

export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find();

    const formatted = materials.map((prod) => prod.toObject({ getters: true }));
    res.status(200).json({ materials: formatted });
  } catch (err) {
    return res.status(500).json({ message: "Fetching raw materials failed" });
  }
};

export const createMaterial = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data" });
  }

  const { name, perBox, perGrams, rawMaterialCategory, unit } = req.body;

  try {
    const existingMaterial = await Material.findOne({ name });
    if (existingMaterial) {
      return res.status(422).json({
        message:
          "Material name already exists. Please choose a different name.",
      });
    }

    const newMaterial = new Material({
      name,
      perBox,
      perGrams,
      rawMaterialCategory,
      unit: unit || "box",
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json({
      message: "Material created successfully",
      material: savedMaterial,
    });
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ message: "Server error while creating material" });
  }
};

export const updateMaterial = async (req, res) => {
  const updated = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const deleteMaterial = async (req, res) => {
  try {
    const deleted = await Material.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Material not found" });
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting material", error });
  }
};
