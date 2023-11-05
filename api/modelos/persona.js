const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Persona = sequelize.define(
    "persona",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        es_proveedor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "persona"
    }
)

module.exports = Persona;