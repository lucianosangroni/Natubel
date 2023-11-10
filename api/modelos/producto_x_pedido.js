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
        precio_unitario: {
            type: DataTypes.FLOAT,
        }
    },
    {
        tableName: "producto_x_pedido",
    }
)

Producto.belongsToMany(Pedido, {
    through: Producto_X_Pedido,
    foreignKey: "producto_id",
});

Pedido.belongsToMany(Producto, {
    through: Producto_X_Pedido,
    foreignKey: "pedido_id",
});

module.exports = Producto_X_Pedido;