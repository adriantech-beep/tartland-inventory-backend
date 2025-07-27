import HttpError from "../models/HttpError.js";
import Material from "../models/Material.js";
import { validationResult } from "express-validator";

export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find();

    const formatted = materials.map((prod) => prod.toObject({ getters: true }));
    res.status(200).json({ materials: formatted });
  } catch (err) {
    const error = new HttpError("Fetching raw materials failed", 500);
    return next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, perBox, perGrams, rawMaterialCategory, unit } = req.body;
  try {
    const existingMaterial = await Material.findOne({ name });
    if (existingMaterial) {
      return next(
        new HttpError(
          "Material name already exists. Please choose a different name.",
          422
        )
      );
    }

    const newMaterial = new Material({
      name,
      perBox,
      perGrams,
      rawMaterialCategory,
      unit,
    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error(err);
    return next(new HttpError("Creating product failed.", 500));
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
