import { DataTypes, Model } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda

class Education extends Model {
  public id!: number;
  public degree!: string;
  public institution!: string;
  public education_type!: string;
  public gpa!: number;
  public start_date!: string;
  public end_date!: string;
  public education_description!: string;
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    degree: DataTypes.STRING,
    institution: DataTypes.STRING,
    education_type: DataTypes.STRING,
    gpa: DataTypes.INTEGER,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    education_description: DataTypes.STRING,
  },
  {
    tableName: "education", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Education;
