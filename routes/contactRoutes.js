import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// GET - barcha contactlar
router.get("/", async (req, res) => {
  const data = await Contact.find();
  res.json(data);
});

// POST - yangi contact qo‘shish (formdan)
router.post("/", async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.json(newContact);
});

// DELETE - contactni o‘chirish
router.delete("/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Contact o‘chirildi" });
});

export default router;