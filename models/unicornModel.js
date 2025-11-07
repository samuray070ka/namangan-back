// Backend Update: Unicorn Model va Controller'ga "location" qo'shish (Village uchun)
// models/unicornModel.js (O'zgartirilgan)
import mongoose from "mongoose";

const unicornSchema = new mongoose.Schema(
  {
    district: { type: String, required: true }, // Tuman nomi
    location: { type: String, required: true }, // Qishloq nomi (yangi)
    title: { type: String, required: true },    // Sub-mahsulot nomi (MChJ)
    desc: { type: String, required: true },     // Izoh
    image: { type: String, default: "" },       // Rasm
    date: { type: String, required: true },     // Sana
  },
  { timestamps: true }
);

export default mongoose.model("Unicorn", unicornSchema);