// routes/unicornRoutes.js (O'zgartirilgan: yangi endpoint'lar)
import express from "express";
import {
  getUnicorns,
  createUnicorn,
  getLocationsByDistrict, // YANGI
  getUnicornsByLocation, // YANGI
  getDistrictSummary,
  getDistrictWithSubUnicorns,
  updateUnicorn,
  deleteUnicorn,
} from "../controllers/unicornController.js";

const router = express.Router();

router.get("/", getUnicorns);
router.get("/summary", getDistrictSummary);
router.get("/district/:district/locations", getLocationsByDistrict); // YANGI: /api/unicorns/district/namangan/locations
router.get("/location/:location", getUnicornsByLocation); // YANGI: /api/unicorns/location/pop
router.get("/district/:district", getDistrictWithSubUnicorns); // Eski, agar kerak bo'lsa
router.post("/", createUnicorn);
router.put("/:id", updateUnicorn);
router.delete("/:id", deleteUnicorn);

export default router;