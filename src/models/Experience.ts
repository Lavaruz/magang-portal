import { DataTypes, Model } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda

class Experience extends Model {
  public id!: number;
  public job_title!: string;
  public company_name!: string;
  public experience_type!: string;
  public start_date!: string;
  public end_date!: string;
  public experience_description!: string;
}

Experience.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_title: DataTypes.STRING,
    company_name: DataTypes.STRING,
    experience_type: DataTypes.STRING,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    experience_description: DataTypes.STRING
  },
  {
    tableName: "experience", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Experience;
