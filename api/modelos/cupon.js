const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")

const Cupon = sequelize.define(
    "cupon",
    {
        clave: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        descuento: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
                min: 0,
                max: 100,
            },
        },
        fecha_fin: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        flag_eliminado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "cupon",
        paranoid: true,
        deletedAt: "flag_eliminado",
    }
)

module.exports = Cupon;