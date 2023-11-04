"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Recruiter extends sequelize_1.Model {
}
Recruiter.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rec_type: sequelize_1.DataTypes.STRING,
    rec_org_name: sequelize_1.DataTypes.STRING,
    rec_org_desc: sequelize_1.DataTypes.TEXT,
    rec_org_size: sequelize_1.DataTypes.STRING,
    rec_org_year: sequelize_1.DataTypes.STRING,
    rec_org_website: sequelize_1.DataTypes.TEXT,
    rec_org_address: sequelize_1.DataTypes.TEXT,
    rec_info_firstname: sequelize_1.DataTypes.STRING,
    rec_info_lastname: sequelize_1.DataTypes.STRING,
    rec_info_email: sequelize_1.DataTypes.STRING,
    rec_info_position: sequelize_1.DataTypes.STRING,
    rec_tier: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "recruiter",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = Recruiter;
//# sourceMappingURL=Recruiter.js.map