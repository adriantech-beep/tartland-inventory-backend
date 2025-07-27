import express from "express";
import { getProductsProduced } from "../controllers/productsProducedController.js";

const router = express.Router();

router.get("/", getProductsProduced);

export default router;
