import Unicorn from "../models/unicornModel.js";

// 🔹 Barcha yozuvlarni olish
export const getUnicorns = async (req, res) => {
  try {
    const unicorns = await Unicorn.find().sort({ createdAt: -1 });
    res.status(200).json(unicorns);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
// 🔹 Yangi ma'lumot qo‘shish (ProfileForm dan)
export const createUnicorn = async (req, res) => {
  try {
    const { title, desc, image } = req.body;
    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      hour12: false,
    });

    const newUnicorn = new Unicorn({ title, desc, image, date });
    await newUnicorn.save();
    res.status(201).json(newUnicorn);
  } catch (error) {
    res.status(400).json({ message: "Ma'lumot yaratishda xatolik", error });
  }
};

// 🔹 O‘chirish
export const deleteUnicorn = async (req, res) => {
  try {
    await Unicorn.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ma'lumot o‘chirildi" });
  } catch (error) {
    res.status(400).json({ message: "O‘chirishda xatolik", error });
  }
};

// controllers/unicornController.js
export const updateUnicorn = async (req, res) => {
  try {
    const { title, desc, image } = req.body;
    const updated = await Unicorn.findByIdAndUpdate(
      req.params.id,
      { title, desc, image },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Yangilashda xato" });
  }
};