// backend/models/encryptedQR.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./user.js";

const EncryptedQR = db.define(
  "EncryptedQR",
  {
    encrypted_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    skl_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    private_key: {
      type: DataTypes.TEXT, // ✅ Tambahkan kolom ini
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default EncryptedQR;
