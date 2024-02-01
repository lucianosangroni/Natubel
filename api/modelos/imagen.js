const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Articulo = require("./articulo")

const Imagen = sequelize.define(
    "imagen",
    {
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "imagen",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

Articulo.hasMany(Imagen, { foreignKey: "articulo_id" });

module.exports = Imagen;