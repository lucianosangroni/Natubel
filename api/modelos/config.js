const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Config = sequelize.define(
    "config",
    {
        montoMinimoMayorista: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        montoMinimoDistribuidor: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
    },
    {
        tableName: "config",
        timestamps: false
    }
)

module.exports = Config;