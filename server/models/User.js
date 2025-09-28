import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    country: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
