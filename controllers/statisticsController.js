import Statistics from "../models/statisticsModel.js";

// 🔹 Barcha statistikalarni olish
export const getStatistics = async (req, res) => {
  try {
    const data = await Statistics.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 🔹 Yangi statistika qo‘shish
export const createStatistic = async (req, res) => {
  try {
    const newStatistic = new Statistics(req.body);
    await newStatistic.save();
    res.status(201).json(newStatistic);
  } catch (error) {
    res.status(400).json({ message: "Statistika yaratishda xatolik", error });
  }
};

// 🔹 Statistika yangilash
export const updateStatistic = async (req, res) => {
  try {
    const updated = await Statistics.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Yangilashda xatolik", error });
  }
};

// 🔹 Statistika o‘chirish
export const deleteStatistic = async (req, res) => {
  try {
    await Statistics.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Statistika o‘chirildi" });
  } catch (error) {
    res.status(400).json({ message: "O‘chirishda xatolik", error });
  }
};