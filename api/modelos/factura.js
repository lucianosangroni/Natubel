const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Pedido = require("./pedido")
const Persona = require("./persona")

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
        flag_cancelada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "factura",
    }
)

Factura.belongsTo(Pedido, {foreignKey: "pedido_id"})
Persona.hasMany(Factura, { foreignKey: "persona_id" });

module.exports = Factura;