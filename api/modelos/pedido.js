const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Persona = require("./persona");
const Cupon = require("./cupon");

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
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('CANCELADO','PEDIDO','ENVIADO','PAGADO','COMPLETADO'),
            allowNull: false,
        },
        razon_cancelado: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        flag_de_marca: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        tipo_precio: {
            type: DataTypes.ENUM('MINORISTA', 'MAYORISTA', 'DISTRIBUIDOR'),
            defaultValue: null
        },
        creador: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "pedido",
    }
)

Persona.hasMany(Pedido, { foreignKey: "persona_id" });
Cupon.hasMany(Pedido, { foreignKey: "cupon_id" })

module.exports = Pedido;