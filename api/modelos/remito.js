const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Pedido = require("./pedido")

const Remito = sequelize.define(
    "remito",
    {
        numero_remito: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descuento: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
                min: 0,
                max: 100,
            },
        },
        dias_vencimiento: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cantidad_cajas: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "remito",
    }
)

Remito.belongsTo(Pedido, { foreignKey: 'pedido_id' });

module.exports = Remito;