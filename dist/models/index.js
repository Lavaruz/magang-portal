"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// Konfigurasi koneksi database Anda
const sequelize = new sequelize_1.Sequelize({
    dialect: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "181001",
    database: "magang-portal",
    logging: false,
});
exports.sequelize = sequelize;
// Fungsi untuk menghubungkan ke database
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Model-model disinkronkan dengan database.");
    }
    catch (error) {
        console.error("Koneksi database gagal:", error);
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=index.js.map