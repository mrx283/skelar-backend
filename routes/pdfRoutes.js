// routes/pdfRoutes.js
import express from "express";
import { generateSKLPDF } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/generate/:id", generateSKLPDF);

export default router;
