// backend/controllers/downloadController.js
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx";
import EncryptedQR from "../models/encryptedQR.js";
import Skl from "../models/skl.js";
import User from "../models/user.js";
import { readFileSync } from "fs";
import path from "path";
import QRCode from "qrcode";

export const downloadSKLWithQR = async (req, res) => {
  try {
    const logoPath = path.resolve("public/Logo_Kota_Medan.png");
    const logoBuffer = readFileSync(logoPath);

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

    const qrText = `http://192.168.100.9:5173/verifikasi/${skl.id}`;

    const qrBase64 = await QRCode.toDataURL(qrText);
    const qrImageBuffer = Buffer.from(qrBase64.split(",")[1], "base64");

    // HEADER TABLE (LOGO KIRI - JUDUL KANAN)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: logoBuffer,
                      transformation: { width: 100, height: 100 },
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "PEMERINTAH KOTA MEDAN", bold: true, size: 24, font: "Arial" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 360 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: "DINAS PENDIDIKAN dan KEBUDAYAAN", bold: true, size: 24, font: "Arial" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 360 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: "UPT SD NEGERI 064024", bold: true, size: 24, font: "Arial" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 360 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: "Jalan Prona I Pb. Selayang II", bold: true, size: 20, font: "Arial" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 360 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: "Medan Selayang Kota Medan, Sumatera Utara 20131", bold: true, size: 20, font: "Arial" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 360 },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const garisBawah = new Paragraph({
      children: [
        new TextRun({
          text: "_________________________________________________________________________________",
          font: "Arial",
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
    });

    const doc = new Document({
      sections: [
        {
          children: [
            headerTable,
            garisBawah,

            // JUDUL SURAT
            new Paragraph({
              spacing: { before: 300 },
              children: [new TextRun({ text: "SURAT KETERANGAN LULUS", bold: true, underline: {}, size: 24, font: "Arial" })],
              alignment: AlignmentType.CENTER,
            }),

            // NOMOR SURAT
            new Paragraph({
              spacing: { after: 400 },
              children: [new TextRun({ text: `Nomor: ${skl.nomor_skl}`, bold: true, size: 20, font: "Arial" })],
              alignment: AlignmentType.CENTER,
            }),

            // ISI PENGANTAR
            new Paragraph({
              spacing: { line: 360 },
              children: [
                new TextRun({
                  text: "Yang bertanda tangan di bawah ini, Kepala UPT SD NEGERI 064024 Nomor Pokok Sekolah Nasional 10210228 Kota Medan Provinsi Sumatera Utara, menerangkan bahwa:",
                  size: 20,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),

            // TABEL IDENTITAS SISWA
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                ["Nama Siswa", skl.nama_siswa],
                ["NISN", skl.nisn],
                ["Asal Sekolah", skl.asal_sekolah],
                ["Tahun Lulus", skl.tahun_lulus.toString()],
              ].map(
                ([label, value]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: label, font: "Arial", size: 20 })] }),
                      new TableCell({ children: [new Paragraph({ text: ":", font: "Arial", size: 20 })], width: { size: 5, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: value, font: "Arial", size: 20 })] }),
                    ],
                  })
              ),
            }),

            // PERNYATAAN KELULUSAN
            new Paragraph({
              spacing: { before: 200, after: 200, line: 360 },
              children: [
                new TextRun({
                  text: "Berdasarkan Keputusan Kepala UPT SD NEGERI 064024 Nomor 422/005/V/UPTSDN24/2025 tanggal 2 Juni 2025 tentang Kelulusan Peserta Didik Tahun Ajaran 2024/2025 dinyatakan:",
                  size: 20,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [new TextRun({ text: "LULUS", bold: true, underline: {}, size: 20, font: "Arial" })],
              alignment: AlignmentType.CENTER,
            }),

            // PENUTUP
            new Paragraph({
              spacing: { before: 200, line: 360 },
              children: [
                new TextRun({
                  text: "Kami menjamin bahwa data yang tercantum di atas adalah benar dan sesuai dengan yang tercantum di dalam dokumen resmi sekolah.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),
            new Paragraph({
              spacing: { line: 360 },
              children: [
                new TextRun({
                  text: "Demikian surat pernyataan ini kami buat dengan sebenar-benarnya untuk dapat digunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),

            // QR CODE + TTD
            new Paragraph({
              spacing: { before: 400 },
              children: [
                new TextRun({
                  text: `Medan, ${new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`,
                  size: 20,
                  bold: true,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Kepala", size: 20, bold: true, font: "Arial" })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: qrImageBuffer,
                  transformation: { width: 100, height: 100 },
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "JOAN FERRY L R, S.Pd", size: 20, bold: true, font: "Arial" })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "NIP. 19791119 200604 1 003", size: 20, bold: true, font: "Arial" })],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Disposition", `attachment; filename=SKL_${skl.nama_siswa}.docx`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat file Word", error: error.message });
  }
};
