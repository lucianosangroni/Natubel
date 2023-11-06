const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Articulo = sequelize.define(
    "articulo",
    {
        numero_articulo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        precio_unitario: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: "articulo",
    }
)

module.exports = Articulo;