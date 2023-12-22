const { pedidoModel, productoXPedidoModel, productoModel, personaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
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
          })
          
        for (const pedido of pedidos) {
            const persona = await personaModel.findOne({
                where: { id: pedido.persona_id },
            });

            pedido.dataValues.persona = persona;
        }
        
        res.status(200).send(pedidos)
    } catch (e) {
        console.log("Error al buscar los pedidos: ", e)
        res.status(500).json({ message: 'Error al buscar los pedidos' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        console.log("REQ: ", req)

        const { persona_id, precio_total, es_proveedor, productos, creador } = req

        const nuevoPedido = await pedidoModel.create
        (
            {
                persona_id,
                precio_total,
                estado: "PEDIDO",
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
        
        res.status(201).json({ message: 'Pedido creado con éxito' });
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
                if (productoAActualizar) {
                    const nuevoStock = productoAActualizar.stock + producto.cantidad;
                    await productoModel.update(
                        { stock: nuevoStock },
                        { where: { id: productoAActualizar.id } }
                    );
                }
            }
        }

        res.status(200).json({ message: 'Pedido editado con éxito' });
    } catch(e) {
        console.log("Error al editar el pedido: ", e)
        res.status(500).json({ message: 'Error al editar el pedido' });
    }
};

module.exports = {getItems, createItem, updateItem};