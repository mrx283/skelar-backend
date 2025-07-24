// backend/controllers/sklController.js
import Skl from "../models/skl.js";
import User from "../models/user.js";
import EncryptedQR from "../models/encryptedQR.js";
import { Op } from "sequelize";

// Buat SKL baru
export const createSkl = async (req, res) => {
  try {
    const { user_id, nama_siswa, nisn, nilai, keterangan } = req.body;
    const skl = await Skl.create({
      user_id,
      nama_siswa,
      nisn,
      nilai,
      keterangan,
    });
    res.status(201).json({ message: "SKL berhasil dibuat", skl });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat SKL", error: error.message });
  }
};

// Hitung Jumlah SKL & QR
export const getDashboardStats = async (req, res) => {
  try {
    const totalSKL = await Skl.count();
    const totalQR = await EncryptedQR.count();
    const totalLoginVerifikator = await User.count({
      where: {
        role: "verifikator",
      },
    });

    res.json({ totalSKL, totalQR, totalLoginVerifikator });
  } catch (error) {
    console.error("❌ Error di getDashboardStats:", error);
    res.status(500).json({ message: "Gagal mengambil statistik", error: error.message });
  }
};

// Ambil semua SKL
export const getAllSkl = async (req, res) => {
  try {
    const skl = await Skl.findAll({
      include: {
        model: User,
        attributes: ["id", "name", "email", "role"],
      },
    });
    res.json(skl);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data SKL", error: error.message });
  }
};

// Ambil 1 SKL berdasarkan ID
export const getSklById = async (req, res) => {
  try {
    const skl = await Skl.findByPk(req.params.id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });
    res.json(skl);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil SKL", error: error.message });
  }
};

// Update SKL
export const updateSkl = async (req, res) => {
  try {
    const { nama_siswa, nisn, nilai, keterangan } = req.body;
    const skl = await Skl.findByPk(req.params.id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });

    await skl.update({ nama_siswa, nisn, nilai, keterangan });
    res.json({ message: "SKL berhasil diperbarui", skl });
  } catch (error) {
    res.status(500).json({ message: "Gagal update SKL", error: error.message });
  }
};

// Hapus SKL
export const deleteSkl = async (req, res) => {
  try {
    const skl = await Skl.findByPk(req.params.id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });

    await skl.destroy();
    res.json({ message: "SKL berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus SKL", error: error.message });
  }
};
