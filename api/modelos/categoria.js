const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Categoria = sequelize.define(
    "categoria",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "categoria",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)


module.exports = Categoria;