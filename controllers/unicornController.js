// controllers/unicornController.js (Tug'irlangan: Filtrlar kuchaytirildi, console.log qo'shildi debug uchun)
import Unicorn from "../models/unicornModel.js";

// 🔹 Barcha yozuvlarni olish (home uchun barcha tumanlar)
export const getUnicorns = async (req, res) => {
  try {
    const unicorns = await Unicorn.find().sort({ createdAt: -1 });
    console.log("Barcha unicornlar soni:", unicorns.length); // Debug
    res.status(200).json(unicorns);
  } catch (error) {
    console.error("getUnicorns xato:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// 🔹 Yangi ma'lumot qo‘shish
export const createUnicorn = async (req, res) => {
  try {
    const { district, location, title, desc, image } = req.body;
    if (!district || !location || !title || !desc) {
      return res.status(400).json({ message: "Majburiy maydonlar to'ldirilmagan" });
    }
    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      hour12: false,
    });

    const newUnicorn = new Unicorn({ district, location, title, desc, image, date });
    await newUnicorn.save();
    console.log("Yangi unicorn qo'shildi:", newUnicorn); // Debug
    res.status(201).json(newUnicorn);
  } catch (error) {
    console.error("createUnicorn xato:", error);
    res.status(400).json({ message: "Ma'lumot yaratishda xatolik", error: error.message });
  }
};

// 🔹 O‘chirish
export const deleteUnicorn = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Unicorn.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Ma'lumot topilmadi" });
    }
    res.status(200).json({ message: "Ma'lumot o‘chirildi" });
  } catch (error) {
    console.error("deleteUnicorn xato:", error);
    res.status(400).json({ message: "O‘chirishda xatolik", error: error.message });
  }
};

// 🔹 Yangilash
export const updateUnicorn = async (req, res) => {
  try {
    const { id } = req.params;
    const { district, location, title, desc, image } = req.body;
    const updated = await Unicorn.findByIdAndUpdate(
      id,
      { district, location, title, desc, image },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Ma'lumot topilmadi" });
    }
    console.log("Yangilangan unicorn:", updated); // Debug
    res.status(200).json(updated);
  } catch (error) {
    console.error("updateUnicorn xato:", error);
    res.status(400).json({ message: "Yangilashda xato", error: error.message });
  }
};

// controllers/unicornController.js
export const getLocationsByDistrict = async (req, res) => {
  try {
    let { district } = req.params;

    // URL decode (%20 → bo'sh joy)
    district = decodeURIComponent(district);

    // Normallashtirish: - va bo'sh joylarni tozalash
    const dbDistrict = district
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const regex = new RegExp(`^${dbDistrict}$`, "i");

    console.log("URL:", req.params.district, "→ DB:", dbDistrict);

    const locations = await Unicorn.aggregate([
      { $match: { district: regex } },
      {
        $group: {
          _id: "$location",
          totalCount: { $sum: 1 },
          firstDesc: { $first: "$desc" },
          firstImage: { $first: "$image" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    if (locations.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun qishloq topilmadi" });
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error("getLocationsByDistrict xato:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};
// YANGI: Qishloq bo'yicha MChJ'larni olish (unicpage uchun – filtr kuchaytirildi)
export const getUnicornsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    console.log("Qidirilayotgan location:", location); // Debug
    const data = await Unicorn.find({ location: { $eq: location } }).sort({ createdAt: -1 });
    console.log("Topilgan MChJ soni:", data.length, "Location:", location); // Debug
    if (data.length === 0) {
      return res.status(404).json({ message: "Bu qishloq uchun ma'lumot topilmadi" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("getUnicornsByLocation xato:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Home uchun tumanlar umumiy statistikasi
export const getDistrictSummary = async (req, res) => {
  try {
    const summary = await Unicorn.aggregate([
      {
        $group: {
          _id: "$district",
          totalCount: { $sum: 1 },
          titles: { $addToSet: "$title" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    console.log("Summary soni:", summary.length); // Debug
    res.status(200).json(summary);
  } catch (error) {
    console.error("getDistrictSummary xato:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Tuman uchun sub-unicornlar (eski, agar kerak bo'lsa)
export const getDistrictWithSubUnicorns = async (req, res) => {
  try {
    const { district } = req.params;
    const subs = await Unicorn.aggregate([
      { $match: { district: { $eq: district } } },
      {
        $group: {
          _id: "$title",
          totalCount: { $sum: 1 },
          descs: { $addToSet: "$desc" },
          images: { $addToSet: "$image" }
        }
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: "$totalCount" },
          subCount: { $sum: 1 },
          subs: { $push: "$$ROOT" }
        }
      }
    ]);
    
    if (subs.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun ma'lumot topilmadi" });
    }

    res.status(200).json(subs[0]);
  } catch (error) {
    console.error("getDistrictWithSubUnicorns xato:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};