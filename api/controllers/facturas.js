const { facturaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const facturas = await facturaModel.findAll()
        res.status(200).send(facturas)
    } catch (e) {
        console.log("Error al buscar las facturas: ", e)
        res.status(500).json({ message: 'Error al buscar las facturas' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { monto, pedido_id, persona_id, fecha } = req

        const nuevaFactura = await facturaModel.create
        (
            {
                monto,
                pedido_id,
                persona_id,
                fecha
            }
        )

        res.status(201).json({ message: "Factura creada con éxito", id: nuevaFactura.id });
    } catch(e) {
        console.log("Error al crear la factura: ", e)
        res.status(500).json({ message: 'Error al crear la factura' });
    }
}

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const factura_id = req.id
        const { monto, fecha, pedido_id } = req
    
        // Validar si el articulo existe antes de intentar actualizarla
        const facturaExiste = await facturaModel.findByPk(factura_id);
        if (!facturaExiste) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        await facturaModel.update
        (
            {
                monto,
                fecha,
                pedido_id
            }, 
            {
            where: { id: factura_id }
            }
        )

        res.status(200).json({ message: 'Factura editada con éxito' });
    } catch(e) {
        console.log("Error al editar la factura: ", e)
        res.status(500).json({ message: 'Error al editar la factura' });
    }
};

const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const factura_id = req.id

        const factura = await facturaModel.findByPk(factura_id)

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        await facturaModel.destroy({
            where: { id: factura_id },
            force: true
        });

        res.status(200).json({ message: 'Factura eliminada con éxito' });
    } catch(e) {
        console.log("Error al eliminar la factura: ", e)
        res.status(500).json({ message: 'Error al eliminar la factura' });
    }
};

module.exports = {getItems, createItem, updateItem, deleteItem};