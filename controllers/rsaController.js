// backend/controllers/rsaController.js
import { generateEncryptedQR } from "../utils/rsaUtils.js";
import EncryptedQR from "../models/encryptedQR.js";
import Skl from "../models/skl.js";
import User from "../models/user.js";

export const deleteQR = async (req, res) => {
  try {
    const { skl_id } = req.params;

    const existingQR = await EncryptedQR.findOne({ where: { skl_id } });
    if (!existingQR) {
      return res.status(404).json({ message: "QR tidak ditemukan untuk data ini" });
    }

    await existingQR.destroy();
    res.json({ message: "✅ QR berhasil dihapus, silakan buat ulang" });
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal menghapus QR", error: error.message });
  }
};
export const encryptSKL = async (req, res) => {
  try {
    const { nisn, nomor_skl, skl_id, admin_id } = req.body;

    // ✅ Validasi admin
    const admin = await User.findByPk(admin_id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak: hanya admin yang boleh mengenkripsi" });
    }

    // ✅ Validasi SKL
    const skl = await Skl.findByPk(skl_id);
    if (!skl) return res.status(404).json({ message: "SKL tidak ditemukan" });

    // ✅ Cek QR sudah pernah dibuat atau belum
    const existing = await EncryptedQR.findOne({ where: { skl_id } });
    if (existing) {
      return res.status(400).json({ message: "QR sudah dibuat sebelumnya" });
    }

    // ✅ Enkripsi hanya nisn & nomor_skl
    const { encryptedBase64, qrCodeDataUrl, publicKeyPem, privateKeyPem } = await generateEncryptedQR({ nisn, nomor_skl });

    // ✅ Simpan ke DB
    await EncryptedQR.create({
      encrypted_text: encryptedBase64,
      qr_code: qrCodeDataUrl,
      skl_id,
      admin_id,
      private_key: privateKeyPem,
    });

    // ✅ Kirim respons
    res.json({
      message: "✅ Berhasil mengenkripsi dan membuat QR",
      encrypted: encryptedBase64,
      qrCode: qrCodeDataUrl,
      publicKeyPem,
      privateKeyPem,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Gagal enkripsi SKL", error: error.message });
  }
};
