"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Offering extends sequelize_1.Model {
}
Offering.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    offeringDate: sequelize_1.DataTypes.STRING,
    offeringStatus: sequelize_1.DataTypes.STRING,
}, {
    sequelize: _1.sequelize,
    tableName: 'offering', // Nama tabel di database
});
exports.default = Offering;
//# sourceMappingURL=Offering.js.map