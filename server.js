import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import aboutRoutes from "./routes/aboutRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import unicornRoutes from "./routes/unicornRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlayapti`));