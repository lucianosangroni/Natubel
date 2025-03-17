const { sequelize } = require("../config/dbConnect")
const { DataTypes, Sequelize } = require("sequelize")
const Persona = require("./persona")

const Pago = sequelize.define(
    "pago",
    {
        monto : {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        destino : {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        flag_imputado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fecha : {
            type: DataTypes.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        pago_padre_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "pago",
                key: "id",
            },
        },
    },
    {
        tableName: "pago",
    }
)

Persona.hasMany(Pago, { foreignKey: "persona_id" });
Pago.belongsTo(Pago, { foreignKey: "pago_padre_id" });

module.exports = Pago;