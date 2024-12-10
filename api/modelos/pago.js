const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
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
        }
    },
    {
        tableName: "pago",
    }
)

Persona.hasMany(Pago, { foreignKey: "persona_id" });

module.exports = Pago;