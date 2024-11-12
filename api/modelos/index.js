const modelos = {
    articuloModel: require("./articulo"),
    categoriaModel: require("./categoria"),
    categoriaXArticuloModel: require("./categoria_x_articulo"),
    imagenModel: require("./imagen"),
    productoModel: require("./producto"),
    personaModel: require("./persona"),
    clienteModel: require("./cliente"),
    pedidoModel: require("./pedido"),
    productoXPedidoModel: require("./producto_x_pedido"),
    remitoModel: require("./remito"),
    adminModel: require("./admin"),
    configModel: require("./config"),
    marcaModel: require("./marca")
}

module.exports = modelos