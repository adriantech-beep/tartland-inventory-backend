import User from "../models/User.js";
import { uploadToCloudinary } from "../uploads/upload.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    let avatar = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "tartland/users/avatars"
      );
      avatar = result.secure_url;
    }

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ message: "Email already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      avatar,
      password: hashedPw,
      provider: "local",
      role: "staff",
    });
    await newUser.save();

    const jwtToken = generateToken(newUser);

    return res.status(201).json({
      token: jwtToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.provider !== "local") {
      return res.status(400).json({ message: "Please sign in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtToken = generateToken(user);

    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email } = req.body;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "tartland/users/avatars"
      );
      user.avatar = result.secure_url;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: "User updated successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
