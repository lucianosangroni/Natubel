const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Talle = sequelize.define(
    "talle",
    {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "talle",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Talle