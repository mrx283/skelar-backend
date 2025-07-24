import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "verifikator"),
      allowNull: false,
      defaultValue: "verifikator",
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
