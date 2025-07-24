// backend/migrations/20250709160948-create-skl.cjs
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("skl", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nama_siswa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nisn: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nomor_skl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      asal_sekolah: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tahun_lulus: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nilai: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      tanggal_terbit: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      qr_code: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("skl");
  },
};
