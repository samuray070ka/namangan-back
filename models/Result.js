import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    plan: { type: Number, required: true },
    actual: { type: Number, required: true },
    color: { type: String, default: "#3F8CFF" },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);