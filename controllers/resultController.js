import Result from "../models/Result.js";

// 🔹 Create
export const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Read (all)
export const getResults = async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update
export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Result.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    await Result.findByIdAndDelete(id);
    res.status(200).json({ message: "O‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Read by district (tuzatildi)
export const getResultsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const results = await Result.find({ district });
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun ma'lumot topilmadi" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Read by location
export const getResultsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const results = await Result.find({ location });
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Bu location uchun ma'lumot topilmadi" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// YANGI: Home uchun tumanlar umumiy statistikasi (aggregate)
export const getDistrictSummary = async (req, res) => {
  try {
    const summary = await Result.aggregate([
      {
        $group: {
          _id: "$district", // Tuman bo'yicha guruhla
          totalPlan: { $sum: "$plan" },
          totalActual: { $sum: "$actual" },
          villageCount: { $sum: 1 }, // Qishloqlar soni (location bo'yicha unique emas, chunki har bir natija qishloq uchun)
          titles: { $addToSet: "$title" } // Qaysi title'lar bor
        }
      },
      { $sort: { _id: 1 } } // Tuman nomiga qarab saralash
    ]);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// YANGI: Tuman uchun qishloqlar va ularning statistikasi (aggregate)
export const getDistrictWithVillages = async (req, res) => {
  try {
    const { district } = req.params;
    const villages = await Result.aggregate([
      { $match: { district } }, // Faqat o'sha tuman
      {
        $group: {
          _id: "$location", // Qishloq bo'yicha guruhla
          totalPlan: { $sum: "$plan" },
          totalActual: { $sum: "$actual" },
          count: { $sum: 1 }, // Natijalar soni
          titles: { $addToSet: "$title" } // Title'lar
        }
      },
      {
        $group: { // Tuman umumiy statistikasi
          _id: null,
          totalPlan: { $sum: "$totalPlan" },
          totalActual: { $sum: "$totalActual" },
          villageCount: { $sum: 1 },
          villages: { $push: { _id: "$_id", totalPlan: "$totalPlan", totalActual: "$totalActual", count: "$count", titles: "$titles" } }
        }
      }
    ]);
    
    if (villages.length === 0) {
      return res.status(404).json({ message: "Bu tuman uchun ma'lumot topilmadi" });
    }

    res.status(200).json(villages[0]); // Birinchi element (umumiy)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};