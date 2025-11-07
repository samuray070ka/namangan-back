import express from "express";
import {
  createStatistic,
  getStatistics,
  getStatisticsByLocation,
  getStatisticsByDistrict, // YANGI: Import qilindi
  getDistrictSummary,      // YANGI
  getDistrictWithLocations, // YANGI
  updateStatistic,
  deleteStatistic,
} from "../controllers/statisticsController.js";

const router = express.Router();

router.post("/", createStatistic);
router.get("/", getStatistics);
router.get("/summary", getDistrictSummary); // YANGI: Home uchun /api/statistics/summary
router.get("/district/:district", getDistrictWithLocations); // YANGI: Tuman uchun /api/statistics/district/namangan
router.get("/location/:location", getStatisticsByLocation); // Qishloq uchun
router.put("/:id", updateStatistic);
router.delete("/:id", deleteStatistic);

export default router;