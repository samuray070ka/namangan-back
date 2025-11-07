// routes/unicornRoutes.js (To'g'ri, o'zgarishsiz)
import express from "express";
import {
  getUnicorns,
  createUnicorn,
  getLocationsByDistrict,
  getUnicornsByLocation,
  getDistrictSummary,
  getDistrictWithSubUnicorns,
  updateUnicorn,
  deleteUnicorn,
} from "../controllers/unicornController.js";

const router = express.Router();

router.get("/", getUnicorns);
router.get("/summary", getDistrictSummary);
router.get("/district/:district/locations", getLocationsByDistrict); // Qishloqlar uchun
router.get("/location/:location", getUnicornsByLocation); // MChJ uchun
router.get("/district/:district", getDistrictWithSubUnicorns); // Eski
router.post("/", createUnicorn);
router.put("/:id", updateUnicorn);
router.delete("/:id", deleteUnicorn);

export default router;