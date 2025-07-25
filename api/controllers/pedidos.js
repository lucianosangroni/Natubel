const { where } = require("sequelize");
const { pedidoModel, productoXPedidoModel, productoModel, personaModel, articuloModel, facturaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        let { limit, offset } = req.query;
        limit = limit ? parseInt(limit) : 10;
        offset = offset ? parseInt(offset) : 0;

        const pedidos = await pedidoModel.findAll({
            include: [
                {
                    model: productoModel,
                    through: {
                        model: productoXPedidoModel,
                        attributes: ['cantidad', 'precio_unitario'],
                    },
                },
            ],
            limit,
            offset,
            order: [["numero_pedido", "DESC"]]
        })
        
        res.status(200).send(pedidos)
    } catch (e) {
        console.log("Error al buscar los pedidos: ", e)
        res.status(500).json({ message: 'Error al buscar los pedidos' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { persona_id, precio_total, es_proveedor, productos, cupon_id, flag_de_marca, creador, numero_factura, monto_factura, fecha_factura, tipo_precio } = req

        if(!es_proveedor) {
            for (const producto of productos) {
                const productoExistente = await productoModel.findOne({ where: { id: producto.producto_id }} )
    
                if(!productoExistente || productoExistente.stock < producto.cantidad) {
                    return res.status(200).json({ message: 'No hay suficiente stock para realizar el pedido' });
                }
            }
        }

        const nuevoPedido = await pedidoModel.create
        (
            {
                persona_id,
                precio_total,
                estado: "PEDIDO",
                cupon_id,
                flag_de_marca,
                tipo_precio,
                creador
            }
        )
        
        for (const producto of productos) {
            await productoXPedidoModel.create
            (
                {
                    producto_id: producto.producto_id,
                    pedido_id: nuevoPedido.numero_pedido,
                    cantidad: producto.cantidad,
                    precio_unitario: producto.precio_unitario
                }
            )

            const productoAActualizar = await productoModel.findOne({
                where: { id: producto.producto_id }
            });

            if (productoAActualizar) {
                const nuevoStock = es_proveedor
                    ? productoAActualizar.stock + producto.cantidad
                    : productoAActualizar.stock - producto.cantidad;

                await productoModel.update
                (
                    {
                        stock: nuevoStock
                    },
                    {
                        where: { id: productoAActualizar.id }
                    }
                )
            }
        };
        
        if(!es_proveedor) {
            facturaModel.create
            (
                {
                    persona_id,
                    monto: precio_total,
                    pedido_id: nuevoPedido.numero_pedido
                }
            )
        } else {
            if(numero_factura.trim() !== "" && monto_factura.trim() !== "") {
                const montoValido = parseFloat(monto_factura);
                const numeroFacturaValido = parseInt(numero_factura);

                if (!isNaN(numeroFacturaValido) && !isNaN(montoValido) && numeroFacturaValido > 0 && montoValido > 0) {
                    facturaModel.create
                    (
                        {
                            persona_id,
                            monto: montoValido,
                            pedido_id: 9,
                            fecha: fecha_factura,
                            numero_factura: numeroFacturaValido
                        }
                    )
                }
            }
        }

        res.status(201).json({ message: 'Pedido creado con éxito', numero_pedido: nuevoPedido.numero_pedido });
    } catch(e) {
        console.log("Error al crear el pedido: ", e)
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pedido_id = req.id
        const { estado, razon_cancelado, productos } = req
        
        // Validar si el pedido existe antes de intentar actualizarla
        const pedido = await pedidoModel.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        if (pedido.estado === 'CANCELADO') {
            return res.status(400).json({ message: 'El pedido ya está cancelado' });
        }

        await pedidoModel.update
        (
            {
                estado,
                razon_cancelado
            }, 
            {
            where: { numero_pedido: pedido_id }
            }
        )

        if (estado === "CANCELADO") {
            for (const producto of productos) {
                const productoAActualizar = await productoModel.findByPk(producto.producto_id);
                const articuloDelProducto = await articuloModel.findByPk(productoAActualizar.dataValues.articulo_id)
                if (productoAActualizar && articuloDelProducto.dataValues.flag_mostrar) {
                    const nuevoStock = productoAActualizar.stock + producto.cantidad;
                    await productoModel.update(
                        { stock: nuevoStock },
                        { where: { id: productoAActualizar.id } }
                    );
                }
            }

            await facturaModel.update
            (
                {
                    flag_cancelada: true
                },
                {
                    where: {pedido_id: pedido_id}
                }
            )
        }

        res.status(200).json({ message: 'Pedido editado con éxito' });
    } catch(e) {
        console.log("Error al editar el pedido: ", e)
        res.status(500).json({ message: 'Error al editar el pedido' });
    }
};

module.exports = {getItems, createItem, updateItem};