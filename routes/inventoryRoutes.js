import express from "express";
import {
  createInventory,
  deleteInventory,
  getInventory,
  updateInventory,
  getInventorySummary,
} from "../controllers/inventoryController.js";
const router = express.Router();

router.post("/", createInventory);
router.get("/", getInventory);
router.delete("/:id", deleteInventory);
router.put("/:id", updateInventory);
router.get("/summary", getInventorySummary);

export default router;
