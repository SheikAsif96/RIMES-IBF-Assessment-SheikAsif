import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { connectMongo } from "./db.js";
import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/articles.js";
import statsRoutes from "./routes/stats.js";
import { errorHandler } from "./middleware/error.js";

async function bootstrap() {
  await connectMongo();
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/auth", authRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/stats", statsRoutes);

  app.use(errorHandler);
  app.listen(config.port, () => console.log(`API on :${config.port}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
