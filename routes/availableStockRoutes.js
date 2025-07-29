import express from "express";

import { getAvailableStock } from "../controllers/availableStockController.js";

const router = express.Router();

router.get("/", getAvailableStock);

export default router;
