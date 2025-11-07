import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    district: { type: String, required: true }, // YANGI: Tuman nomi, masalan "Toshkent" yoki "Namangan"
    location: { type: String, required: true }, // Qishloq/shahar, masalan "pop" yoki "pop-shaharcha"
    title: { type: String, required: true },    // "workplaces", "production" va h.k.
    num: { type: Number, required: true },      // Raqamli qiymat
    color: { type: String, default: "#00d097" },
    background: { type: String, default: "#FFFFFF" },
  },
  { timestamps: true }
);

export default mongoose.model("Statistics", statisticsSchema);