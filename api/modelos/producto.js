const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Articulo = require("./articulo")
const Talle = require("./talle")
const Color = require("./color")

const Producto = sequelize.define(
    "producto",
    {
        stock: {
            type: DataTypes.INTEGER,
        }
    },
    {
        tableName: "producto"
    }
)

Articulo.hasMany(Producto, {foreignKey: "articulo_id"})
Talle.hasMany(Producto, {foreignKey: "talle_id"})
Color.hasMany(Producto, {foreignKey: "color_id"})

module.exports = Producto;