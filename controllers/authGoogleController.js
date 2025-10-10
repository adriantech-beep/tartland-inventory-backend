import express from "express";
import { OAuth2Client } from "google-auth-library";

import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authGoogle = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Missing token" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email)
      return res.status(400).json({ message: "No email in token" });

    const email = payload.email;
    const name = payload.name || "";
    const googleId = payload.sub;
    const avatar = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(2),
        googleId,
        provider: "google",
        avatar,
        role: "staff",
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
        user.avatar = user.avatar || avatar;
        await user.save();
      }
    }

    const jwtToken = generateToken(user);

    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};
