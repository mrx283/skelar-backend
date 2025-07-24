// backend/routes/userRoutes.js

import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { getAllAdmin, getAllVerifikator } from "../controllers/userController.js";

const router = express.Router();

router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Selamat datang admin!" });
});

router.get("/verifikator", verifyToken, authorizeRoles("verifikator"), (req, res) => {
  res.json({ message: "Selamat datang verifikator!" });
});

router.get("/admin-list", verifyToken, authorizeRoles("admin"), getAllAdmin);

router.get("/verifikator-list", verifyToken, getAllVerifikator);
export default router;
