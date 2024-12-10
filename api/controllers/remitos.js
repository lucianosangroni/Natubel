const { remitoModel, facturaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const remitos = await remitoModel.findAll()
        res.status(200).send(remitos)
    } catch (e) {
        console.log("Error al buscar los remitos: ", e)
        res.status(500).json({ message: 'Error al buscar los remitos' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { descuento, dias_vencimiento, cantidad_cajas, pedido_id } = req

        const factura = await facturaModel.findOne({
            where: { pedido_id }
        });

        if (!factura) {
            res.status(404).json({ message: `Factura no encontrada para pedido: ${pedido_id}` });
        }

        const nuevoMonto = factura.monto * (1 - descuento / 100);

        await facturaModel.update
        (
            {
                monto: nuevoMonto
            },
            {
                where: { pedido_id }
            }
        )

        const nuevoRemito = await remitoModel.create
        (
            {
                descuento,
                dias_vencimiento,
                cantidad_cajas,
                pedido_id
            }
        )

        res.status(201).json({ message: 'Remito creado con éxito', numero_remito: nuevoRemito.numero_remito });
    } catch(e) {
        console.log("Error al crear el remito: ", e)
        res.status(500).json({ message: 'Error al crear el remito' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pedido_id = req.id
        const { descuento, dias_vencimiento, cantidad_cajas } = req

        const factura = await facturaModel.findOne({
            where: { pedido_id }
        });

        if (!factura) {
            res.status(404).json({ message: `Factura no encontrada para pedido: ${pedido_id}` });
        }

        const remito = await remitoModel.findOne({
            where: { pedido_id },
        });

        if (!remito) {
            return res.status(404).json({ message: `Remito no encontrado para pedido: ${pedido_id}` });
        }
    
        const descuentoPrevio = remito.descuento;
        const montoOriginal =  factura.monto / (1 - descuentoPrevio / 100);
        const nuevoMonto = montoOriginal * (1 - descuento / 100);

        await facturaModel.update
        (
            {
                monto: nuevoMonto
            },
            {
                where: { pedido_id }
            }
        )

        await remitoModel.update
        (
            {
                descuento,
                dias_vencimiento,
                cantidad_cajas
            },
            {
                where: { pedido_id: pedido_id }
            }
        )

        res.status(201).json({ message: 'Remito editado con éxito', nuevoMonto });
    } catch(e) {
        console.log("Error al crear el remito: ", e)
        res.status(500).json({ message: 'Error al crear el remito' });
    }
};

module.exports = {getItems, createItem, updateItem};