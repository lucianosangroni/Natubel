const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Persona = require("./persona")

const Pedido = sequelize.define(
    "pedido",
    {
        numero_pedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        precio_total: {
            type: DataTypes.FLOAT,
        },
        estado: {
            type: DataTypes.ENUM('CANCELADO','PEDIDO','ENVIADO','PAGADO','COMPLETADO'),
            allowNull: false,
        },
        razon_cancelado: {
            type: DataTypes.STRING,
            defaultValue: null
        }
    },
    {
        tableName: "pedido",
    }
)

Persona.hasMany(Pedido, { foreignKey: "persona_id" });

module.exports = Pedido;