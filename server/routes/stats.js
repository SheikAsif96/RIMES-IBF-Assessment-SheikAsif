import { Router } from "express";
import { Stats } from "../models/Stats.js";
import { letters } from "../utils/letters.js";
import { User } from "../models/User.js";
import { Article } from "../models/article.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const stats = await Stats.find({}).lean();
    const counts = {};
    for (const l of letters)
      counts[l] = stats.find((s) => s.letter === l)?.count || 0;
    const [usersTotal, articlesTotal] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
    ]);
    res.json({ letters: counts, usersTotal, articlesTotal });
  } catch (e) {
    next(e);
  }
});

export default router;
