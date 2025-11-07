import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    district: { type: String, required: true }, // YANGI: Tuman nomi, masalan "Toshkent" yoki "Namangan"
    location: { type: String, required: true }, // Qishloq/shahar, masalan "pop" yoki "pop-shaharcha"
    title: { type: String, required: true },    // "workplaces", "production"
    plan: { type: Number, required: true },
    actual: { type: Number, required: true },
    color: { type: String, default: "#3F8CFF" },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);