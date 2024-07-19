const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Articulo = sequelize.define(
    "articulo",
    {
        numero_articulo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        precio_mayorista: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        precio_minorista: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        precio_distribuidor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        flag_mostrar: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        tableName: "articulo",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Articulo;