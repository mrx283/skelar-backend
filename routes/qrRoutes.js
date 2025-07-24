// routes/qrRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import verifyQR from "../controllers/verifyQRController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/verify-qr", verifyToken, upload.single("qr_image"), verifyQR);

export default router;
