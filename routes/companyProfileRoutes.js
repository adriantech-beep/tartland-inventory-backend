import express from "express";
import {
  createCompanyProfile,
  getCompanySettings,
} from "../controllers/companySettingsController.js";
import { upload } from "../uploads/upload.js";

const router = express.Router();

router.post(
  "/create-company-profile",
  upload.single("avatar"),
  createCompanyProfile
);
router.get("/get-company-profile", getCompanySettings);

export default router;
