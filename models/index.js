"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config = require('../config.json')["db"];
var password = config.password ? config.password : "";
var sequelize = new Sequelize(config.driver + "://" + config.username + ":" + password + "@" + config.host + ":" + config.port + "/" + config.dbname);
var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;