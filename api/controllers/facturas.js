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

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const factura_id = req.id
        const { monto } = req
    
        // Validar si el articulo existe antes de intentar actualizarla
        const facturaExiste = await facturaModel.findByPk(factura_id);
        if (!facturaExiste) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        await facturaModel.update
        (
            {
                monto
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

module.exports = {getItems, updateItem};