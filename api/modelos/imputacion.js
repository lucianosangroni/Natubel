const { sequelize } = require("../config/dbConnect");
const { DataTypes } = require("sequelize");
const Pago = require("./pago");
const Factura = require("./factura");

const Imputacion = sequelize.define(
    "imputacion",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        numero_imputacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "imputacion",
    }
);

Pago.belongsToMany(Factura, {
    through: Imputacion,
    foreignKey: "pago_id",
    otherKey: "factura_id",
});

Factura.belongsToMany(Pago, {
    through: Imputacion,
    foreignKey: "factura_id",
    otherKey: "pago_id",
});

module.exports = Imputacion;