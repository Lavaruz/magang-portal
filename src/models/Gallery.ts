import { DataTypes, Model,CreationOptional, ForeignKey, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Seeker from "./Seeker";

class Gallery extends Model {
  declare id: CreationOptional<number>;
  declare gal_photo: string;
  declare ownerId: ForeignKey<Seeker['id']>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Gallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gal_photo: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "gallery", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Gallery;
