import { Schema, model } from "mongoose";

const StatsSchema = new Schema(
  {
    letter: {
      type: String,
      enum: ["r", "i", "m", "e", "s"],
      required: true,
      unique: true,
    },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Stats = model("Stats", StatsSchema);
