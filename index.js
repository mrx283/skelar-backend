import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/verifyToken.js";
import userRoutes from "./routes/userRoutes.js";
import sklRoutes from "./routes/sklRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import rsaRoutes from "./routes/rsaRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skl", sklRoutes);
app.use("/api", qrRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/rsa", rsaRoutes);
app.use("/api/pdf", pdfRoutes);

app.use(
  cors({
    origin: "https://skelar-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("SKELAR Backend Ready!");
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Ini halaman terlindungi",
    user: req.user,
  });
});

(async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");

    await db.sync({ alter: true });
    console.log("✅ Model synced...");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
  }
})();
