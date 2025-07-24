// backend/routes/rsaRoutes.js
import express from "express";
import { encryptSKL, deleteQR } from "../controllers/rsaController.js";
import { getAllEncryptedQR, getEncryptedQRBySKLId } from "../controllers/encryptedQRController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

// 🔐 Buat QR hanya untuk admin
router.post("/encrypt", verifyToken, authorizeRoles("admin"), encryptSKL);

// 📥 Ambil semua data QR (bisa untuk admin & verifikator)
router.get("/list", verifyToken, getAllEncryptedQR);

router.delete("/delete/:skl_id", verifyToken, deleteQR);
router.get("/:id", getEncryptedQRBySKLId);
export default router;
