import express from "express";
import {
  createResult,
  getResults,
  getResultsByLocation,
  getResultsByDistrict, // YANGI: Import qilindi
  getDistrictSummary,   // YANGI
  getDistrictWithVillages, // YANGI
  updateResult,
  deleteResult,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/", createResult);
router.get("/", getResults);
router.get("/summary", getDistrictSummary); // YANGI: Home uchun /api/results/summary
router.get("/district/:district", getDistrictWithVillages); // YANGI: Tuman uchun /api/results/district/namangan
router.get("/location/:location", getResultsByLocation); // Qishloq uchun
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

export default router;