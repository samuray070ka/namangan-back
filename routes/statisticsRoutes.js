import express from "express";
import {
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from "../controllers/statisticsController.js";

const router = express.Router();

router.get("/", getStatistics);          // Barcha statistikalarni olish
router.post("/", createStatistic);       // Yangi statistika qo‘shish
router.put("/:id", updateStatistic);     // Yangilash
router.delete("/:id", deleteStatistic);  // O‘chirish

export default router;
