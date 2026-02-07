const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Articulo = require("./articulo")

const Producto = sequelize.define(
    "producto",
    {
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        talle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        ml_product_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
    },
    {
        tableName: "producto",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Producto;