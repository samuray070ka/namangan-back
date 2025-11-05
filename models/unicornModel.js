import mongoose from "mongoose";

const unicornSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // kompaniya nomi
    desc: { type: String, required: true },  // qisqa izoh
    image: { type: String, default: "" },    // rasm base64
    date: { type: String, required: true },  // sana va vaqt
  },
  { timestamps: true }
);

const Unicorn = mongoose.model("Unicorn", unicornSchema);
export default Unicorn;
