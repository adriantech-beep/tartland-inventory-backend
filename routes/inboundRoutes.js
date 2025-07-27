import express from "express";
import {
  addInboundLog,
  deleteInboundLog,
  getInboundLog,
} from "../controllers/inboundController.js";

const router = express.Router();

router.post("/", addInboundLog);
router.get("/", getInboundLog);
router.delete("/:id", deleteInboundLog);

export default router;
