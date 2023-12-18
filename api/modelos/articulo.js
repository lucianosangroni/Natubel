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
            type: DataTypes.STRING,
        },
        precio_unitario: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "articulo",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Articulo;