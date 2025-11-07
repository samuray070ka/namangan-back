import Statistics from "../models/statisticsModel.js";

// 🔹 Create
export const createStatistic = async (req, res) => {
  try {
    const newStatistic = new Statistics(req.body);
    await newStatistic.save();
    res.status(201).json(newStatistic);
  } catch (error) {
    res.status(400).json({ message: "Statistika yaratishda xatolik", error: error.message });
  }
};

// 🔹 Read (all)
export const getStatistics = async (req, res) => {
  try {
    const data = await Statistics.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// 🔹 Update
export const updateStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Statistics.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Statistika topilmadi" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Yangilashda xatolik", error: error.message });
  }
};

// 🔹 Delete
export const deleteStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    await Statistics.findByIdAndDelete(id);
    res.status(200).json({ message: "Statistika o‘chirildi" });
  } catch (error) {
    res.status(400).json({ message: "O‘chirishda xatolik", error: error.message });
  }
};

// 🔹 Read by district (tuzatildi)
export const getStatisticsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const data = await Statistics.find({ district });
    
    if (data.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun statistika topilmadi" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// 🔹 Read by location
export const getStatisticsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const data = await Statistics.find({ location });
    
    if (data.length === 0) {
      return res.status(404).json({ message: "Bu location uchun statistika topilmadi" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// YANGI: Home uchun tumanlar umumiy statistikasi (aggregate)
export const getDistrictSummary = async (req, res) => {
  try {
    const summary = await Statistics.aggregate([
      {
        $group: {
          _id: "$district", // Tuman bo'yicha guruhla
          totalNum: { $sum: "$num" }, // Num bo'yicha jami
          locationCount: { $sum: 1 }, // Qishloqlar soni (location bo'yicha unique emas)
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

// YANGI: Tuman uchun qishloqlar va ularning statistikasi (aggregate)
export const getDistrictWithLocations = async (req, res) => {
  try {
    const { district } = req.params;
    const locations = await Statistics.aggregate([
      { $match: { district } }, // Faqat o'sha tuman
      {
        $group: {
          _id: "$location", // Qishloq bo'yicha guruhla
          totalNum: { $sum: "$num" }, // Num bo'yicha jami
          count: { $sum: 1 }, // Natijalar soni
          titles: { $addToSet: "$title" } // Title'lar
        }
      },
      {
        $group: { // Tuman umumiy statistikasi
          _id: null,
          totalNum: { $sum: "$totalNum" },
          locationCount: { $sum: 1 },
          locations: { $push: { _id: "$_id", totalNum: "$totalNum", count: "$count", titles: "$titles" } }
        }
      }
    ]);
    
    if (locations.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun statistika topilmadi" });
    }

    res.status(200).json(locations[0]); // Birinchi element (umumiy)
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};