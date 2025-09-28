import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
