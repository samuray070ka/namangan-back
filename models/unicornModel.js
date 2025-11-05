import mongoose from "mongoose";

const unicornSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, default: "" }, // Endi: "/uploads/filename.jpg"
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Unicorn = mongoose.model("Unicorn", unicornSchema);
export default Unicorn;