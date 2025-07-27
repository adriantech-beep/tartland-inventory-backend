import express from "express";
import {
  createMixtureRule,
  getMixtureRule,
  updateMixtureRule,
  deleteMixtureRule,
} from "../controllers/mixtureRuleController.js";

const router = express.Router();

router.post("/", createMixtureRule);
router.get("/", getMixtureRule);
router.put("/:id", updateMixtureRule);
router.delete("/:id", deleteMixtureRule);

export default router;
