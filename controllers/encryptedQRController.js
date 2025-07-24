// controllers/encryptedQRController.js

import { EncryptedQR, User, SKL } from "../models/index.js";

export const getAllEncryptedQR = async (req, res) => {
  try {
    const qrList = await EncryptedQR.findAll({
      include: [
        {
          model: SKL,
          as: "skl",
          attributes: ["id", "nama_siswa", "nisn", "nomor_skl"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(qrList);
  } catch (error) {
    console.error("❌ Error getAllEncryptedQR:", error);
    res.status(500).json({ message: "Gagal mengambil QR", error: error.message });
  }
};

export const getEncryptedQRBySKLId = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await EncryptedQR.findOne({
      where: { skl_id: id },
      include: [
        {
          model: SKL,
          as: "skl",
          attributes: ["id", "nama_siswa", "nisn", "nomor_skl", "tahun_lulus"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!qr) {
      return res.status(404).json({ message: "QR tidak ditemukan untuk ID tersebut" });
    }

    res.json(qr);
  } catch (error) {
    console.error("❌ Error getEncryptedQRBySKLId:", error);
    res.status(500).json({ message: "Gagal mengambil QR", error: error.message });
  }
};
