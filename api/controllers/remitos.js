const { remitoModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pedido_id = req.id

        const remito = await remitoModel.findOne({ where: {pedido_id: pedido_id}} )

        if (remito) {
            res.status(200).json( { message: 'Remito encontrado', remito })
        } else {
            res.status(200).json( { message: 'Remito no encontrado' });
        }
    } catch (e) {
        console.log("Error al buscar el remito: ", e)
        res.status(500).json({ message: 'Error al buscar el remito' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { descuento, dias_vencimiento, cantidad_cajas, pedido_id } = req

        await remitoModel.create
        (
            {
                descuento,
                dias_vencimiento,
                cantidad_cajas,
                pedido_id
            }
        )
        
        res.status(201).json({ message: 'Remito creado con éxito' });
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

        res.status(201).json({ message: 'Remito editado con éxito' });
    } catch(e) {
        console.log("Error al crear el remito: ", e)
        res.status(500).json({ message: 'Error al crear el remito' });
    }
};

module.exports = {getItem, createItem, updateItem};