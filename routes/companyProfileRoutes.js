import express from "express";
import {
  createCompanyProfile,
  editCompanyProfile,
  getCompanyProfile,
} from "../controllers/companySettingsController.js";
import { upload } from "../uploads/upload.js";

const router = express.Router();

router.post(
  "/create-company-profile",
  upload.single("avatar"),
  createCompanyProfile
);
router.get("/get-company-profile", getCompanyProfile);
router.put(
  "/edit-company-profile/:id",
  upload.single("avatar"),
  editCompanyProfile
);

export default router;
