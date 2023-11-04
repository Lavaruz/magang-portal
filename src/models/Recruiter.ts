import { DataTypes, Model,CreationOptional, ForeignKey, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Seeker from "./Seeker";

class Recruiter extends Model {
  declare id: CreationOptional<number>;
  declare rec_type:string;
  declare rec_org_name:string;
  declare rec_org_desc:string;
  declare rec_org_size:string;
  declare rec_org_year:string;
  declare rec_org_website:string;
  declare rec_org_address:string;
  declare rec_info_firstname:string;
  declare rec_info_lastname:string;
  declare rec_info_email:string;
  declare rec_info_position:string;
  declare rec_tier:string;
  declare ownerId: ForeignKey<Seeker['id']>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Recruiter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rec_type:DataTypes.STRING,
    rec_org_name:DataTypes.STRING,
    rec_org_desc:DataTypes.TEXT,
    rec_org_size:DataTypes.STRING,
    rec_org_year:DataTypes.STRING,
    rec_org_website:DataTypes.TEXT,
    rec_org_address:DataTypes.TEXT,
    rec_info_firstname:DataTypes.STRING,
    rec_info_lastname:DataTypes.STRING,
    rec_info_email:DataTypes.STRING,
    rec_info_position:DataTypes.STRING,
    rec_tier:DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "recruiter", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Recruiter;
