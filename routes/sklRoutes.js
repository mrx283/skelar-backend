// backend/routes/sklRoutes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import Skl from "../models/skl.js";
import User from "../models/user.js";
import QRCode from "qrcode";
import { getAllSkl, getSklById, createSkl, updateSkl, deleteSkl, getDashboardStats } from "../controllers/sklController.js";

const router = express.Router();

router.get("/dashboard/stats", verifyToken, getDashboardStats);

// GET semua SKL
router.get("/", verifyToken, async (req, res) => {
  try {
    const sklList = await Skl.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
    });
    res.json(sklList);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data SKL", error: error.message });
  }
});

// POST buat SKL (khusus verifikator & admin)
router.post("/", verifyToken, authorizeRoles("verifikator", "admin"), async (req, res) => {
  const { nama_siswa, nisn, nomor_skl, asal_sekolah, tahun_lulus } = req.body || {};

  try {
    const qrText = `https://skelar.vercel.app/validasi/${nomor_skl}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrText);

    const skl = await Skl.create({
      nama_siswa,
      nisn,
      nomor_skl,
      asal_sekolah,
      tahun_lulus,
      user_id: req.user.id,
      qr_code: qrCodeDataUrl,
    });

    res.status(201).json({
      message: "SKL berhasil dibuat",
      skl: {
        nama_siswa: skl.nama_siswa,
        nisn: skl.nisn,
        nomor_skl: skl.nomor_skl,
        asal_sekolah: skl.asal_sekolah,
        tahun_lulus: skl.tahun_lulus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat SKL", error: error.message });
  }
});

// GET validasi SKL via nomor SKL (bisa digunakan di endpoint QR Scanner)
router.get("/validasi/:nomor_skl", async (req, res) => {
  const { nomor_skl } = req.params;
  try {
    const skl = await Skl.findOne({ where: { nomor_skl }, include: User });

    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });

    res.json({ message: "SKL valid", data: skl });
  } catch (error) {
    res.status(500).json({ message: "Gagal validasi SKL", error: error.message });
  }
});

// GET SKL by ID
router.get("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const skl = await Skl.findByPk(id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });
    res.json(skl);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data SKL", error: error.message });
  }
});

// PUT SKL by ID
router.put("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  const { nama_siswa, nisn, nomor_skl, asal_sekolah, tahun_lulus } = req.body;
  try {
    const skl = await Skl.findByPk(id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });

    skl.nama_siswa = nama_siswa;
    skl.nisn = nisn;
    skl.nomor_skl = nomor_skl;
    skl.asal_sekolah = asal_sekolah;
    skl.tahun_lulus = tahun_lulus;

    await skl.save();
    res.json({ message: "SKL berhasil diperbarui", data: skl });
  } catch (error) {
    res.status(500).json({ message: "Gagal update SKL", error: error.message });
  }
});

// Di routes/sklRoutes.js
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Skl.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "SKL tidak ditemukan" });

    res.json({ message: "SKL berhasil dihapus" });
  } catch (error) {
    console.error("❌ ERROR DELETE:", error); // Tambahkan ini untuk lihat di terminal
    res.status(500).json({ message: "Gagal menghapus SKL", error: error.message });
  }
});

export default router;
