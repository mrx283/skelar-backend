// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.status(201).json({
      message: "Registrasi berhasil",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal register",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // ⬅️ penting bro
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};
