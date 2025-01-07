const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Pedido = require("./pedido")

const Factura = sequelize.define(
    "factura",
    {
        monto : {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        flag_imputada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "factura",
    }
)

Factura.belongsTo(Pedido, {foreignKey: "pedido_id"})

module.exports = Factura;