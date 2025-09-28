import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function auth(req, res, next) {
  const hdr = req.header("Authorization");
  if (!hdr || !hdr.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = hdr.slice(7);
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
