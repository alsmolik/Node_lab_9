"use strict";

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        period: {
            type: DataTypes.INTEGER
        }
    }, {
            timestamps: false,
            classMethods: {
                associate: function (models) {
                    Payment.belongsTo(models.User, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Payment.belongsTo(models.Domain, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        });

    return Payment;
};