const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Color = sequelize.define(
    "color",
    {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "color"
    }
)

module.exports = Color