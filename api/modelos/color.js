const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Color = sequelize.define(
    "color",
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
        tableName: "color",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Color