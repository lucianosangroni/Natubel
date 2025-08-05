const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Marca = require("./marca")

const Porcentaje = sequelize.define(
    "porcentaje",
    {
        tipo_precio: {
            type: DataTypes.ENUM("MINORISTA", "MAYORISTA", "DISTRIBUIDOR", "DE MARCA", "5%", "10%"),
            allowNull: false,
        },
        ganancia: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },
    {
        tableName: "porcentaje",
    }
)

Marca.hasMany(Porcentaje, {foreignKey: "marca_id"})

module.exports = Porcentaje;