const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Marca = sequelize.define(
    "marca",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "marca",
    }
)

module.exports = Marca;