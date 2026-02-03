const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Marca = require("./marca")

const Articulo = sequelize.define(
    "articulo",
    {
        numero_articulo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        enBenka: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        precio_de_marca: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        flag_mostrar: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        ml_item_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
    },
    {
        tableName: "articulo",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

Marca.hasMany(Articulo, { foreignKey: "marca_id" });

module.exports = Articulo;