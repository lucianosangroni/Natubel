const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Pedido = require("./pedido")

const Pedido_Cancelado = sequelize.define(
    "pedido_cancelado",
    {
        razon_cancelado: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "pedido_cancelado",
    }
)

Pedido_Cancelado.belongsTo(Pedido, {foreignKey: "pedido_id"})

module.exports = Pedido_Cancelado;