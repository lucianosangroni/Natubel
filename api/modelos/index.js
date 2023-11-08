const modelos = {
    articuloModel: require("./articulo"),
    talleModel: require("./talle"),
    colorModel: require("./color"),
    productoModel: require("./producto"),
    personaModel: require("./persona"),
    clienteModel: require("./cliente"),
    pedidoModel: require("./pedido"),
    pedidoCanceladoModel: require("./pedido_cancelado"),
    productoXPedidoModel: require("./producto_x_pedido"),
}

module.exports = modelos