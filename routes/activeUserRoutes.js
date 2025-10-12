import express from "express";
import { checkAuth } from "../services/checkAuth.js";
import { getActiveUser } from "../controllers/activeUserController.js";

const router = express.Router();

router.get("/active-user", checkAuth, getActiveUser);

export default router;
