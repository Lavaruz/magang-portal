import { Sequelize } from "sequelize";

// Konfigurasi koneksi database Anda
const sequelize = new Sequelize({
  dialect: "mysql", // Ganti dengan jenis database yang Anda gunakan
  host: "127.0.0.1",
  username: "root",
  password: "181001",
  database: "magang-portal",
  logging: false,
});

// Fungsi untuk menghubungkan ke database
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Model-model disinkronkan dengan database.");
  } catch (error) {
    console.error("Koneksi database gagal:", error);
  }
};

export { sequelize, connectToDatabase };
