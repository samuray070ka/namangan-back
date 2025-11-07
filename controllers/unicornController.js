import Unicorn from "../models/unicornModel.js";

// 🔹 Barcha yozuvlarni olish (home uchun barcha tumanlar)
export const getUnicorns = async (req, res) => {
  try {
    const unicorns = await Unicorn.find().sort({ createdAt: -1 });
    res.status(200).json(unicorns);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// 🔹 Yangi ma'lumot qo‘shish (ProfileForm dan)
// 🔹 O‘chirish
export const deleteUnicorn = async (req, res) => {
  try {
    const { id } = req.params;
    await Unicorn.findByIdAndDelete(id);
    res.status(200).json({ message: "Ma'lumot o‘chirildi" });
  } catch (error) {
    res.status(400).json({ message: "O‘chirishda xatolik", error: error.message });
  }
};

// 🔹 Yangilash

// YANGI: Tuman bo'yicha unicornlarni olish (tuman sahifasi uchun)
export const getUnicornsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const data = await Unicorn.find({ district }).sort({ createdAt: -1 });
    
    if (data.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun ma'lumot topilmadi" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Home uchun tumanlar umumiy statistikasi (aggregate)
export const getDistrictSummary = async (req, res) => {
  try {
    const summary = await Unicorn.aggregate([
      {
        $group: {
          _id: "$district", // Tuman bo'yicha guruhla
          totalCount: { $sum: 1 }, // Sub-unicornlar soni
          titles: { $addToSet: "$title" } // Qaysi title'lar bor
        }
      },
      { $sort: { _id: 1 } } // Tuman nomiga qarab saralash
    ]);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Tuman uchun sub-unicornlar va ularning statistikasi (aggregate)
export const getDistrictWithSubUnicorns = async (req, res) => {
  try {
    const { district } = req.params;
    const subs = await Unicorn.aggregate([
      { $match: { district } }, // Faqat o'sha tuman
      {
        $group: {
          _id: "$title", // Sub-title bo'yicha guruhla (agar kerak bo'lsa; aks holda "$location" ishlatish mumkin)
          totalCount: { $sum: 1 }, // Soni
          descs: { $addToSet: "$desc" }, // Izohlar
          images: { $addToSet: "$image" } // Rasmlar
        }
      },
      {
        $group: { // Tuman umumiy statistikasi
          _id: null,
          totalCount: { $sum: "$totalCount" },
          subCount: { $sum: 1 },
          subs: { $push: { _id: "$_id", totalCount: "$totalCount", descs: "$descs", images: "$images" } }
        }
      }
    ]);
    
    if (subs.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun ma'lumot topilmadi" });
    }

    res.status(200).json(subs[0]); // Birinchi element (umumiy)
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};
// YANGI: Tuman bo'yicha qishloqlarni olish (district sahifasi uchun)
export const getLocationsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const locations = await Unicorn.aggregate([
      { $match: { district } },
      {
        $group: {
          _id: "$location", // Qishloq bo'yicha guruhla
          totalCount: { $sum: 1 }, // MChJ soni
          titles: { $addToSet: "$title" }, // Sub-title'lar
          firstDesc: { $first: "$desc" }, // Birinchi izoh
          firstImage: { $first: "$image" } // Birinchi rasm
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    if (locations.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun qishloq topilmadi" });
    }

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Qishloq bo'yicha MChJ'larni olish (village sahifasi uchun)
export const getUnicornsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const data = await Unicorn.find({ location }).sort({ createdAt: -1 });
    
    if (data.length === 0) {
      return res.status(404).json({ message: "Bu qishloq uchun ma'lumot topilmadi" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// Create va Update'ga location qo'shish
export const createUnicorn = async (req, res) => {
  try {
    const { district, location, title, desc, image } = req.body; // location qo'shildi
    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      hour12: false,
    });

    const newUnicorn = new Unicorn({ district, location, title, desc, image, date });
    await newUnicorn.save();
    res.status(201).json(newUnicorn);
  } catch (error) {
    res.status(400).json({ message: "Ma'lumot yaratishda xatolik", error: error.message });
  }
};

export const updateUnicorn = async (req, res) => {
  try {
    const { id } = req.params;
    const { district, location, title, desc, image } = req.body; // location qo'shildi
    const updated = await Unicorn.findByIdAndUpdate(
      id,
      { district, location, title, desc, image },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Ma'lumot topilmadi" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Yangilashda xato", error: error.message });
  }
};