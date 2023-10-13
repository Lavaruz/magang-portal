import { DataTypes, Model } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda

class Mahasiswa extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
}

Mahasiswa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "mahasiswa", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Mahasiswa;
