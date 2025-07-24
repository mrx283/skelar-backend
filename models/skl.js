// backend/models/skl.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Skl = db.define(
  "skl",
  {
    nama_siswa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nisn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nomor_skl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asal_sekolah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tahun_lulus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Skl;
