// backend/models/index.js
// backend/models/index.js
import dotenv from "dotenv";
dotenv.config();

import db from "../config/database.js"; // <- ini `sequelize` instance

import User from "./user.js";
import SKL from "./skl.js";
import EncryptedQR from "./encryptedQR.js";

const sequelize = db;

User.hasMany(SKL, { foreignKey: "user_id" });
SKL.belongsTo(User, { foreignKey: "user_id" });

EncryptedQR.belongsTo(SKL, { foreignKey: "skl_id", onDelete: "CASCADE", as: "skl" });
EncryptedQR.belongsTo(User, { foreignKey: "admin_id", as: "admin" });
User.hasMany(EncryptedQR, { foreignKey: "admin_id" });
SKL.hasOne(EncryptedQR, { foreignKey: "skl_id", onDelete: "CASCADE" });

export { sequelize, User, SKL, EncryptedQR };
