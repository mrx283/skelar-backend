// backend/routes/downloadRoutes.js
import express from "express";
import { downloadSKLWithQR } from "../controllers/downloadController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

// 🔐 Hanya admin yang bisa download surat SKL lengkap dengan QR
router.get("/skl/:id", verifyToken, authorizeRoles("admin"), downloadSKLWithQR);

export default router;
