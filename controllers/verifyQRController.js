// controllers/verifyQRController.js
import QrCode from "qrcode-reader";
import forge from "node-forge";
import { SKL, User, EncryptedQR } from "../models/index.js";

const verifyQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "QR image is required" });
    }

    console.log("🧪 File diterima:", req.file.originalname);

    // 🔁 Dynamic import Jimp
    const jimpModule = await import("jimp");
    const Jimp = jimpModule.default || jimpModule.Jimp;
    const image = await Jimp.read(req.file.buffer);
    console.log("🧪 Ukuran gambar:", image.bitmap.width, image.bitmap.height);

    const qr = new QrCode();

    qr.callback = async (err, value) => {
      if (err || !value?.result) {
        console.error({ message: "❌ Gagal membaca QR:", detail: err?.message });
        return res.status(400).json({ message: "QR tidak dapat dibaca" });
      }

      const encryptedText = value.result;
      console.log("✅ QR dibaca:", encryptedText);

      // 🔍 Cari data berdasarkan encrypted_text
      const qrData = await EncryptedQR.findOne({
        where: { encrypted_text: encryptedText },
        include: [
          {
            model: SKL,
            as: "skl",
            include: [{ model: User, as: "user", attributes: { exclude: ["password"] } }],
          },
        ],
      });

      if (!qrData || !qrData.private_key) {
        return res.status(404).json({ message: "Data QR tidak ditemukan atau private key hilang" });
      }

      // 🔐 Dekripsi menggunakan private key dari DB
      try {
        const privateKey = forge.pki.privateKeyFromPem(qrData.private_key);
        const decryptedText = privateKey.decrypt(forge.util.decode64(encryptedText), "RSA-OAEP");

        console.log("🔓 Decrypted Text:", decryptedText);
        // Optional: Kamu bisa validasi isi decryptedText di sini

        return res.json({
          message: "✅ QR valid",
          data: qrData.skl,
        });
      } catch (decryptionError) {
        console.error("❌ Gagal mendekripsi:", decryptionError.message);
        return res.status(400).json({ message: "Gagal mendekripsi QR" });
      }
    };

    qr.decode(image.bitmap);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default verifyQR;
