import { validationResult } from "express-validator";
import MixtureRule from "../models/MixtureRule.js";
import HttpError from "../models/HttpError.js";

export const getMixtureRule = async (req, res, next) => {
  try {
    const mixture = await MixtureRule.find();

    const formatted = mixture.map((prod) => prod.toObject({ getters: true }));
    res.status(200).json({ mixture: formatted });
  } catch (err) {
    const error = new HttpError("Fetching mixture rule settings failed", 500);
    return next(error);
  }
};

export const createMixtureRule = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data submitted", 422));
  }

  const { flavor, mixtureCount, bagsPerMixture, jarMaterial } = req.body;

  try {
    const existingRule = await MixtureRule.findOne({ flavor });
    if (existingRule) {
      return next(
        new HttpError("Mixture rule for this flavor already exists", 422)
      );
    }

    const newRule = new MixtureRule({
      flavor,
      mixtureCount,
      bagsPerMixture,
      jarMaterial,
    });

    await newRule.save();
    res.status(201).json(newRule);
  } catch (err) {
    console.error(err);
    return next(new HttpError("Creating mixture rule failed", 500));
  }
};

export const updateMixtureRule = async (req, res) => {
  const updated = await MixtureRule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const deleteMixtureRule = async (req, res) => {
  try {
    const deleted = await MixtureRule.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Mixture rule not found" });
    res.status(200).json({ message: "Mixture rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mixture rule", error });
  }
};
