const { sequelize } = require("../config/dbConnect")
const Articulo = require("./articulo")
const Categoria = require("./categoria")

const Categoria_X_Articulo = sequelize.define(
    "categoria_x_articulo",
    {},
    {
        tableName: "categoria_x_articulo",
    }
)

Articulo.belongsToMany(Categoria, {
    through: Categoria_X_Articulo,
    foreignKey: "articulo_id",
});

Categoria.belongsToMany(Articulo, {
    through: Categoria_X_Articulo,
    foreignKey: "categoria_id",
});

module.exports = Categoria_X_Articulo;