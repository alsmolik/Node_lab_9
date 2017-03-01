"use strict";

module.exports = function (sequelize, DataTypes) {
    var Domain = sequelize.define('Domain', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        expires: {
            type: DataTypes.DATEONLY
        }
    }, {
            timestamps: false,
            classMethods: {
                associate: function (models) {
                    Domain.belongsTo(models.User, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        });

    return Domain;
};