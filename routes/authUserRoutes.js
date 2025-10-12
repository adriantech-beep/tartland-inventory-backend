import express from "express";
import {
  login,
  signup,
  updateUser,
} from "../controllers/authUserController.js";
import { upload } from "../uploads/upload.js";

const router = express.Router();

router.post("/user-signup", signup);
router.post("/user-login", login);
router.put("/user-update/:uid", upload.single("avatar"), updateUser);

export default router;
