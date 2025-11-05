import express from "express";
import { getUnicorns, createUnicorn, deleteUnicorn, updateUnicorn } from "../controllers/unicornController.js";

const router = express.Router();

router.get("/", getUnicorns);
router.post("/", createUnicorn);
router.put("/:id", updateUnicorn);
router.delete("/:id", deleteUnicorn);

export default router;
