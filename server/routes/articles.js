import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { Stats } from "../models/Stats.js";
import { countLetters, deltaCounts, letters } from "../utils/letters.js";
import { Article } from "../models/article.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const userId = req.query.userId;
    const q = userId ? { userId } : {};
    const [items, total] = await Promise.all([
      Article.find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Article.countDocuments(q),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
});

const upsertSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, body } = upsertSchema.parse(req.body);
    const doc = await Article.create({ title, body, userId: req.userId });
    const c = countLetters(body);
    await Promise.all(
      letters.map((l) =>
        Stats.updateOne(
          { letter: l },
          { $inc: { count: c[l] } },
          { upsert: true }
        )
      )
    );
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { title, body } = upsertSchema.parse(req.body);
    const art = await Article.findById(req.params.id);
    if (!art) return res.status(404).json({ error: "Not found" });
    if (art.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Forbidden" });
    const delta = deltaCounts(art.body, body);
    art.title = title;
    art.body = body;
    await art.save();
    await Promise.all(
      Object.entries(delta).map(([l, d]) =>
        Stats.updateOne({ letter: l }, { $inc: { count: d } }, { upsert: true })
      )
    );
    res.json(art);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const art = await Article.findById(req.params.id);
    if (!art) return res.status(404).json({ error: "Not found" });
    if (art.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Forbidden" });
    const c = countLetters(art.body);
    await art.deleteOne();
    await Promise.all(
      Object.entries(c).map(([l, d]) =>
        Stats.updateOne(
          { letter: l },
          { $inc: { count: -d } },
          { upsert: true }
        )
      )
    );
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
