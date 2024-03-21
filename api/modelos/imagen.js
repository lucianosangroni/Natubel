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
    },
    {
        tableName: "imagen",
    }
)

Articulo.hasMany(Imagen, { foreignKey: "articulo_id" });

module.exports = Imagen;