import { Router } from "express";
import { User } from "../models/User.js";
import { Article } from "../models/article.js";

const router = Router();

// Public endpoint: list minimal profiles and article counts
router.get("/", async (_req, res, next) => {
  try {
    const users = await User.find(
      {},
      "username email country position createdAt"
    ).lean();
    const ids = users.map((u) => u._id);
    const counts = await Article.aggregate([
      { $match: { userId: { $in: ids } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce(
      (m, c) => ((m[c._id.toString()] = c.count), m),
      {}
    );
    const payload = users.map((u) => ({
      _id: u._id,
      username: u.username,
      email: u.email,
      country: u.country,
      position: u.position,
      createdAt: u.createdAt,
      articleCount: countMap[u._id.toString()] || 0,
    }));
    res.json(payload);
  } catch (e) {
    next(e);
  }
});

export default router;
