const Articulo = require("./articulo")
const Producto = require("./producto")
const Marca = require("./marca")

Articulo.hasMany(Producto, { foreignKey: "articulo_id" })
Producto.belongsTo(Articulo, { foreignKey: "articulo_id" })

Marca.hasMany(Articulo, { foreignKey: "marca_id" })
Articulo.belongsTo(Marca, { foreignKey: "marca_id" })