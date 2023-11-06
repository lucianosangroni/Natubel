const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Producto = require("./producto")
const Pedido = require("./pedido")

const Producto_X_Pedido = sequelize.define(
    "productos_x_pedido",
    {
        cantidad: {
            type: DataTypes.INTEGER,
        },
        precio: {
            type: DataTypes.FLOAT,
        }
    },
    {
        tableName: "producto_x_pedido"
    }
)

Producto_X_Pedido.belongsTo(Producto, {foreignKey: "producto_id"})
Producto_X_Pedido.belongsTo(Pedido, {foreignKey: "pedido_id"})

module.exports = Producto_X_Pedido;