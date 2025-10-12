import User from "../models/User.js";

export const getActiveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Fetching active user failed." });
  }
};
