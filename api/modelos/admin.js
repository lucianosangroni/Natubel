const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Admin = sequelize.define(
    "admin",
    {
        nombre_usuario: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "admin",
        timestamps: false
    }
)

module.exports = Admin