import User from "../models/user.js";

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: "admin" },
      attributes: ["id", "name", "email"], // yang ditampilkan
    });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data admin", error: error.message });
  }
};

export const getAllVerifikator = async (req, res) => {
  try {
    const verifikators = await User.findAll({
      where: { role: "verifikator" },
      attributes: ["id", "name", "email", "createdAt"], // kamu bisa tambah atribut lain kalau perlu
    });
    res.json(verifikators);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data verifikator", error: error.message });
  }
};
