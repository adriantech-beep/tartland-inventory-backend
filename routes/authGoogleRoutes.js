import express from "express";
import { authGoogle } from "../controllers/authGoogleController.js";

const router = express.Router();

router.post("/google", authGoogle);

export default router;
