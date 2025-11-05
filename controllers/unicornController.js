import Unicorn from "../models/unicornModel.js";

// Barcha yozuvlarni olish
export const getUnicorns = async (req, res) => {
  try {
    const unicorns = await Unicorn.find().sort({ createdAt: -1 });
    res.status(200).json(unicorns);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

// Yangi qo'shish
export const createUnicorn = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUnicorn = new Unicorn({ title, desc, image, date });
    await newUnicorn.save();

    res.status(201).json(newUnicorn);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Yaratishda xato" });
  }
};

// Yangilash
export const updateUnicorn = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const updateData = { title, desc };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Unicorn.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Yangilashda xato" });
  }
};

// O‘chirish
export const deleteUnicorn = async (req, res) => {
  try {
    const unicorn = await Unicorn.findById(req.params.id);
    if (!unicorn) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    // Faylni o‘chirish (ixtiyoriy)
    if (unicorn.image) {
      const filePath = `./uploads/${unicorn.image.split("/").pop()}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Unicorn.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "O‘chirildi" });
  } catch (error) {
    res.status(400).json({ message: "O‘chirishda xato" });
  }
};