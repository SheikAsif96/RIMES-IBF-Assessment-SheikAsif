import { Schema, model, Types } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Article = model("Article", ArticleSchema);
