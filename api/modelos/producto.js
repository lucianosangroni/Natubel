const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Articulo = require("./articulo")

const Producto = sequelize.define(
    "producto",
    {
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isPositive: function(value) {
                    if(value < 0) {
                        throw new Error("No se puede tener stock negativo")
                    }
                }
            }
        },
        talle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "producto",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

Articulo.hasMany(Producto, {foreignKey: "articulo_id"})

module.exports = Producto;