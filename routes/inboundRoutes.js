import express from "express";
import {
  addInboundLog,
  deleteInboundLog,
  getInboundLog,
  updateInboundLog,
} from "../controllers/inboundController.js";

const router = express.Router();

router.post("/", addInboundLog);
router.get("/", getInboundLog);
router.delete("/:id", deleteInboundLog);
router.put("/:id", updateInboundLog);

export default router;
