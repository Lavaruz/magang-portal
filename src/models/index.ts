import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

let sequelize
if(process.env.ENV_TYPE == 'production'){
  console.log("DB run on host");
  
  sequelize = new Sequelize({
    dialect: "mysql", // Ganti dengan jenis database yang Anda gunakan
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
    logging:false
  });
}else{
  console.log("DB run on local");
  // Konfigurasi koneksi database Anda
  sequelize = new Sequelize({
    dialect: "mysql", // Ganti dengan jenis database yang Anda gunakan
    host: "127.0.0.1",
    username: "root",
    password: "181001",
    database: "magang-portal",
    logging: false,
  });
}



// Fungsi untuk menghubungkan ke database
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate({alter: true});
    await sequelize.sync();
    console.log("Model-model disinkronkan dengan database.");
  } catch (error) {
    console.error("Koneksi database gagal:", error);
  }
};

export { sequelize, connectToDatabase };
