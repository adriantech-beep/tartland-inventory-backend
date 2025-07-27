import express from "express";
import {
  createProductionLog,
  deleteProductionLog,
  editProductionLog,
  getProductionLog,
} from "../controllers/productionLogController.js";

const router = express.Router();

router.post("/", createProductionLog);
router.get("/", getProductionLog);
router.delete("/:id", deleteProductionLog);
router.put("/:id", editProductionLog);

export default router;
