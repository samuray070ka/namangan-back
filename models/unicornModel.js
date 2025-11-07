// models/unicornModel.js (To'g'ri, o'zgarishsiz – location va district bor)
import mongoose from "mongoose";

const unicornSchema = new mongoose.Schema(
  {
    district: { type: String, required: true }, // Tuman nomi (masalan, "Pop", "Chust")
    location: { type: String, required: true }, // Qishloq nomi (masalan, "Chust", "Pop-shaharcha")
    title: { type: String, required: true },    // MChJ nomi
    desc: { type: String, required: true },     // Izoh
    image: { type: String, default: "" },       // Rasm
    date: { type: String, required: true },     // Sana
  },
  { timestamps: true }
);

export default mongoose.model("Unicorn", unicornSchema);