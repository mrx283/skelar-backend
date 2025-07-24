// utils/rsaUtils.js
import forge from "node-forge";
import QRCode from "qrcode";

export const generateEncryptedQR = async ({ nisn, nomor_skl }) => {
  // 1. Generate RSA keypair
  const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair({ bits: 2048 });

  // 2. Gabungkan hanya data yang dibutuhkan
  const plainText = `${nisn};${nomor_skl}`;
  console.log("📦 Plain text to encrypt:", plainText);

  // 3. Enkripsi pakai public key
  const encrypted = publicKey.encrypt(plainText, "RSA-OAEP");
  const encryptedBase64 = forge.util.encode64(encrypted);

  console.log("🔒 Encrypted base64 length:", encryptedBase64.length);

  // 4. Buat QR dari hasil enkripsi
  const qrCodeDataUrl = await QRCode.toDataURL(encryptedBase64, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 2,
    scale: 12,
  });

  return {
    encryptedBase64,
    qrCodeDataUrl,
    publicKeyPem: forge.pki.publicKeyToPem(publicKey),
    privateKeyPem: forge.pki.privateKeyToPem(privateKey),
  };
};
