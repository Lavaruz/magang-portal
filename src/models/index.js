"use strict";
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/./../../.env") });
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
let env = process.env.ENV_TYPE || "development";
const config = require(__dirname + "/../config/dbConfig.json")[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true,
        },
      },
      logging: false
    }
  );
  console.log("db run on host");
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
