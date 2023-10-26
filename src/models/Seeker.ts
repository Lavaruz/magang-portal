import { DataTypes, Model } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda

class Seeker extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public domicile!: string;
  public date_of_birth!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public role!: string;
  public sex!: string;
}

Seeker.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    domicile: {
      type: DataTypes.STRING,
    },
    date_of_birth: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    sex: {
      type: DataTypes.STRING,
    },
    current_status: DataTypes.TEXT,
    profile_summary: DataTypes.TEXT
  },
  {
    tableName: "seeker", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Seeker;
