import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { config } from "../config.js";

const router = Router();

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(6),
  position: z.string().min(2),
  country: z.string().min(2),
  password: z.string().min(6),
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (exists) return res.status(409).json({ error: "User exists" });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, passwordHash });
    res.status(201).json({ id: user._id });
  } catch (e) {
    next(e);
  }
});

const loginSchema = z.object({
  login: z.string().min(3), // email or username
  password: z.string().min(6),
});

router.post("/login", async (req, res, next) => {
  try {
    const { login, password } = loginSchema.parse(req.body);
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }],
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      config.jwtSecret,
      { expiresIn: "2d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
