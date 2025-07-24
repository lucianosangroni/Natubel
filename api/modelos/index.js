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
    marcaModel: require("./marca"),
    facturaModel: require("./factura"),
    pagoModel: require("./pago"),
    imputacionModel: require("./imputacion"),
    cuponModel: require("./cupon"),
    porcentajeModel: require("./porcentaje")
}

module.exports = modelos