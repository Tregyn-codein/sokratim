const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, DataTypes);
db.url = require("../models/url.model.js")(sequelize, DataTypes);

module.exports = db;
