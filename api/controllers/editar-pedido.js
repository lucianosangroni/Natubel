const { pedidoModel, productoModel, productoXPedidoModel, clienteModel, articuloModel, facturaModel, remitoModel } = require("../modelos");

const updateItem = async (req, res) => {
    try {
        const pedido_id = req.params.id
        const { articulos, productosIniciales } = req.body
        
        // Validar si el pedido existe antes de intentar actualizarla
        const pedido = await pedidoModel.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const factura = await facturaModel.findOne({
            where: { pedido_id }
        });
        if (!factura) {
            res.status(404).json({ message: `Factura no encontrada para pedido: ${pedido_id}` });
        }

        const cliente = await clienteModel.findOne({
            where: {
                persona_id: pedido.dataValues.persona_id
            }
        });

        const tipoPrecio = cliente.dataValues.tipo_cliente

        const productosNada = []
        const productosSumarStock = []
        const productosRestarStock = []
        const productosAdd = []
        const productosRemove = []
        
        for(const articulo of articulos) {
            for(const [productKey, cantidad] of Object.entries(articulo.cantidades)) {
                const [color, talle] = productKey.split('-');
                
                const productoExistente = await productoModel.findOne({
                    where: {
                        articulo_id: articulo.id,
                        talle,
                        color
                    }
                });

                if(productoExistente) {
                    const producto = productosIniciales.find(prod => prod.id === productoExistente.id)
                    if(producto) {
                        if(cantidad === producto.cantidad) {
                            productosNada.push(producto.id)
                        } else if (cantidad > producto.cantidad) {
                            const prod = {
                                id: producto.id,
                                cantidad: cantidad - producto.cantidad,
                            }

                            productosRestarStock.push(prod)
                        } else if (cantidad < producto.cantidad) {
                            const prod = {
                                id: producto.id,
                                cantidad: producto.cantidad - cantidad
                            }

                            productosSumarStock.push(prod)
                        }
                    } else {
                        const prod = {
                            id: productoExistente.id,
                            cantidad: cantidad,
                            articulo_id: productoExistente.articulo_id
                        }

                        productosAdd.push(prod)
                    }
                }
            }
        }

        for(const productoInicial of productosIniciales) {
            const enProductosNada = productosNada.find(prod => prod === productoInicial.id)
            const enProductosSumarStock = productosSumarStock.find(prod => prod.id === productoInicial.id)
            const enProductosRestarStock = productosRestarStock.find(prod => prod.id === productoInicial.id)
            const enProductosAdd = productosAdd.find(prod => prod.id === productoInicial.id)

            if (!enProductosNada && !enProductosSumarStock && !enProductosRestarStock && !enProductosAdd) {
                productosRemove.push(productoInicial);
            }
        }

        await Promise.all(productosSumarStock.map(async producto => {
            const productoAActualizar = await productoModel.findByPk(producto.id)
            const nuevoStock = productoAActualizar.stock + producto.cantidad

            const productoXPedidoAActualizar = await productoXPedidoModel.findOne({
                where: {
                    producto_id: producto.id,
                    pedido_id: pedido_id
                }
            });
            const nuevaCantidad = productoXPedidoAActualizar.cantidad - producto.cantidad

            await productoModel.update({
                stock: nuevoStock,
            }, {
                where: { id: productoAActualizar.id }
            });

            await productoXPedidoModel.update(
                {
                    cantidad: nuevaCantidad
                },
                {
                    where: { pedido_id: pedido_id, producto_id: producto.id } 
                }
            )
        }));

        await Promise.all(productosRestarStock.map(async producto => {
            const productoAActualizar = await productoModel.findByPk(producto.id)
            const nuevoStock = productoAActualizar.stock - producto.cantidad

            const productoXPedidoAActualizar = await productoXPedidoModel.findOne({
                where: {
                    producto_id: producto.id,
                    pedido_id: pedido_id
                }
            });
            const nuevaCantidad = productoXPedidoAActualizar.cantidad + producto.cantidad

            await productoModel.update({
                stock: nuevoStock,
            }, {
                where: { id: productoAActualizar.id }
            });

            await productoXPedidoModel.update(
                {
                    cantidad: nuevaCantidad
                },
                {
                    where: { pedido_id: pedido_id, producto_id: producto.id } 
                }
            )
        }));

        await Promise.all(productosAdd.map(async producto => {
            const articulo = await articuloModel.findByPk(producto.articulo_id)
            const precio_unitario = tipoPrecio === "MINORISTA" ? articulo.precio_minorista : tipoPrecio === "MAYORISTA" ? articulo.precio_mayorista : articulo.precio_distribuidor

            await productoXPedidoModel.create
            (
                {
                    producto_id: producto.id,
                    cantidad: producto.cantidad,
                    pedido_id: pedido_id,
                    precio_unitario: precio_unitario
                }
            )

            const productoAActualizar = await productoModel.findByPk(producto.id)
            const nuevoStock = productoAActualizar.stock - producto.cantidad

            await productoModel.update({
                stock: nuevoStock,
            }, {
                where: { id: productoAActualizar.id }
            });
        }));
        
        await Promise.all(productosRemove.map(async producto => {
            await productoXPedidoModel.destroy({
                where: {
                    producto_id: producto.id,
                    pedido_id: pedido_id
                }
            });
            const productoAActualizar = await productoModel.findByPk(producto.id)
            const nuevoStock = productoAActualizar.stock + producto.cantidad

            await productoModel.update({
                stock: nuevoStock
            }, {
                where: { id: productoAActualizar.id }
            });
        }));

        let precioTotal = 0

        const productosFinales = await productoXPedidoModel.findAll({where: { pedido_id: pedido_id }})
        
        for(const productoFinal of productosFinales) {
            const precioProducto = productoFinal.dataValues.cantidad * productoFinal.dataValues.precio_unitario

            precioTotal += precioProducto
        }

        await pedidoModel.update({
            precio_total: precioTotal
        }, { 
            where: { numero_pedido: pedido_id}
        })

        let nuevoMontoFactura = precioTotal;

        const remitoExiste = await remitoModel.findOne({
            where: { pedido_id },
        });

        if (remitoExiste) {
            nuevoMontoFactura = precioTotal * (1 - remitoExiste.descuento / 100);
        }

        await facturaModel.update
        (
            {
                monto: nuevoMontoFactura
            },
            {
                where: { pedido_id }
            }
        )

        res.status(200).json({ message: 'Pedido editado con éxito' });
    } catch(e) {
        console.log("Error al editar el pedido: ", e)
        res.status(500).json({ message: 'Error al editar el pedido' });
    }
};

module.exports = {updateItem};