import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import aboutRoutes from "./routes/aboutRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import unicornRoutes from "./routes/unicornRoutes.js";

dotenv.config();

// __dirname uchun (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // JSON limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rasm fayllarini statik qilish
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer sozlamalari
import multer from "multer";
import fs from "fs";

// Papka yaratish
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "unicorn-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm yuklang!"));
    }
  },
});

// Upload middleware (faqat unicorn uchun)
app.use("/api/unicorns", (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  } else {
    next();
  }
});

// ROUTES
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/unicorns", unicornRoutes);

// MongoDB ulanish
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.log("❌ MongoDB ulanmadi:", err));

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlayapti`);
  console.log(`🖼️  Rasmlar: http://localhost:${PORT}/uploads`);
});