const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Talle = sequelize.define(
    "talle",
    {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "talle"
    }
)

module.exports = Talle