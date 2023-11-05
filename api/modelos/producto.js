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

Producto.belongsTo(Articulo, {foreignKey: "articulo_id"})
Producto.belongsTo(Talle, {foreignKey: "talle_id"})
Producto.belongsTo(Color, {foreignKey: "color_id"})

module.exports = Producto;