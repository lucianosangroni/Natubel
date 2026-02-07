const Articulo = require("./articulo")
const Producto = require("./producto")

Articulo.hasMany(Producto, { foreignKey: "articulo_id" })
Producto.belongsTo(Articulo, { foreignKey: "articulo_id" })