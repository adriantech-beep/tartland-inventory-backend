import Company from "../models/Company.js";
import { uploadToCloudinary } from "../uploads/upload.js";

export const createCompanyProfile = async (req, res) => {
  try {
    const { companyName } = req.body;
    let avatar = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "tartland/company/avatar"
      );
      avatar = result.secure_url;
    }

    const existingCompany = await Company.findOne();

    if (existingCompany) {
      existingCompany.companyName = companyName || existingCompany.companyName;
      if (avatar) existingCompany.avatar = avatar;

      await existingCompany.save();
      return res.status(200).json(existingCompany);
    }

    const newProfile = new Company({
      companyName,
      avatar,
    });

    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    console.error("Creating/updating company profile failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const companySettings = await Company.findOne();

    if (!companySettings) {
      return res.status(404).json({ message: "No company settings found." });
    }

    const formatted = companySettings.toObject({ getters: true });

    res.status(200).json({ companySettings: formatted });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Fetching company settings failed", 500));
  }
};

export const editCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName } = req.body;

    const companySettings = await Company.findById(id);
    if (!companySettings) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "tartland/company/avatar"
      );
      companySettings.avatar = result.secure_url;
    }

    if (companyName) {
      companySettings.companyName = companyName;
    }

    await companySettings.save();

    return res.status(200).json({
      message: "Company profile updated successfully",
      companySettings,
    });
  } catch (error) {
    console.error("Updating company profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
