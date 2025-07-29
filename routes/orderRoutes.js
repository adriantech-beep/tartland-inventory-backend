import express from "express";
import {
  createOrder,
  deleteOrder,
  editOrder,
  getOrders,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.delete("/:id", deleteOrder);
router.put("/:id", editOrder);

export default router;
