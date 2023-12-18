const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Persona = sequelize.define(
    "persona",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cuit_cuil: {
            type: DataTypes.STRING,
            unique: true
        },
        direccion: {
            type: DataTypes.STRING,
        },
        es_proveedor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "persona",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

module.exports = Persona;