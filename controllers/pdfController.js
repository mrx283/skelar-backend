// controllers/pdfController.js
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import EncryptedQR from "../models/encryptedQR.js";
import Skl from "../models/skl.js";
import User from "../models/user.js";

export const generateSKLPDF = async (req, res) => {
  try {
    const logoPath = path.resolve("public/Logo_Kota_Medan.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    const { id } = req.params;

    const qrData = await EncryptedQR.findOne({
      where: { skl_id: id },
      include: [
        { model: Skl, as: "skl" },
        { model: User, as: "admin" },
      ],
    });

    if (!qrData || !qrData.qr_code || !qrData.encrypted_text) {
      return res.status(400).json({ message: "Data QR belum dibuat. Silakan pilih admin dan buat QR dahulu." });
    }

    const skl = qrData.skl;

    const qrText = `https://skelar-frontend.vercel.app/verifikasi/${skl.id}`;
    const qrBase64 = await QRCode.toDataURL(qrText);

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 50px; }
            h1, h2, h3, h4, h5, h6 { margin: 0; text-align: center; }
            .center { text-align: center; }
            .justify { text-align: justify; }
            .mt { margin-top: 20px; }
            table { width: 100%; margin-top: 20px; }
            .logo { float: left; width: 100px; }
            .header-text { text-align: center; font-size: 14pt; font-weight: bold; }
            .qr { width: 100px; height: 100px; }
            .signature { text-align: right; margin-top: 50px; }
          </style>
        </head>
        <body>
          <div style="overflow: hidden;">
            <img src="data:image/png;base64,${logoBase64}" class="logo" />
            <div class="header-text">
              PEMERINTAH KOTA MEDAN<br />
              DINAS PENDIDIKAN dan KEBUDAYAAN<br />
              UPT SD NEGERI 064024<br />
              Jalan Prona I Pb. Selayang II<br />
              Medan Selayang Kota Medan, Sumatera Utara 20131
            </div>
          </div>

          <hr />

          <h2 class="mt">SURAT KETERANGAN LULUS</h2>
          <h4>Nomor: ${skl.nomor_skl}</h4>

          <p class="justify">
            Yang bertanda tangan di bawah ini, Kepala UPT SD NEGERI 064024 Nomor Pokok Sekolah Nasional 10210228 Kota Medan Provinsi Sumatera Utara, menerangkan bahwa:
          </p>

          <table>
            <tr><td>Nama Siswa</td><td>:</td><td>${skl.nama_siswa}</td></tr>
            <tr><td>NISN</td><td>:</td><td>${skl.nisn}</td></tr>
            <tr><td>Asal Sekolah</td><td>:</td><td>${skl.asal_sekolah}</td></tr>
            <tr><td>Tahun Lulus</td><td>:</td><td>${skl.tahun_lulus}</td></tr>
          </table>

          <p class="justify">
            Berdasarkan Keputusan Kepala UPT SD NEGERI 064024 Nomor 422/005/V/UPTSDN24/2025 tanggal 2 Juni 2025 tentang Kelulusan Peserta Didik Tahun Ajaran 2024/2025 dinyatakan:
          </p>

          <h3 class="center">LULUS</h3>

          <p class="justify">
            Kami menjamin bahwa data yang tercantum di atas adalah benar dan sesuai dengan yang tercantum di dalam dokumen resmi sekolah.
          </p>
          <p class="justify">
            Demikian surat pernyataan ini kami buat dengan sebenar-benarnya untuk dapat digunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
          </p>

          <div class="signature">
            Medan, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
            Kepala<br />
            <img src="${qrBase64}" class="qr" /><br />
            <strong>JOAN FERRY L R, S.Pd</strong><br />
            NIP. 19791119 200604 1 003
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=SKL_${skl.nama_siswa}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};
