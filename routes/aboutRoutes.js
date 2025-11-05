import express from "express";
import About from "../models/About.js";

const router = express.Router();

// GET - Barcha "biz haqimizda" ma'lumotlarni olish
router.get("/", async (req, res) => {
  const data = await About.find();
  res.json(data);
});

// POST - Yangi ma'lumot qo‘shish
router.post("/", async (req, res) => {
  const newAbout = new About(req.body);
  await newAbout.save();
  res.json(newAbout);
});

// PUT - Ma'lumot yangilash
router.put("/:id", async (req, res) => {
  const updated = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE - Ma'lumotni o‘chirish
router.delete("/:id", async (req, res) => {
  await About.findByIdAndDelete(req.params.id);
  res.json({ message: "O‘chirildi" });
});

export default router;
