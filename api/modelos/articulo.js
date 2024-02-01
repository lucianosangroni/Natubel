const { sequelize } = require("../config/dbConnect")
const { DataTypes } = require("sequelize")
const Categoria = require("./categoria");

const Articulo = sequelize.define(
    "articulo",
    {
        numero_articulo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        precio_mayorista: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        precio_minorista: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        precio_distribuidor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        flag_activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "articulo",
        paranoid: true,
        deletedAt: "flag_activo",
    }
)

Articulo.belongsToMany(Categoria, {
    through: "categoria_x_articulo",
    foreignKey: "articulo_id",
});
Categoria.belongsToMany(Articulo, {
    through: "categoria_x_articulo",
    foreignKey: "categoria_id",
});

module.exports = Articulo;