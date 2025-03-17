const { pagoModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const pagos = await pagoModel.findAll()
        res.status(200).send(pagos)
    } catch (e) {
        console.log("Error al buscar los pagos: ", e)
        res.status(500).json({ message: 'Error al buscar los pagos' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { monto, destino, persona_id, fecha } = req

        const nuevoPago = await pagoModel.create
        (
            {
                monto,
                destino,
                persona_id,
                fecha
            }
        )

        res.status(201).json({ message: "Cobranza A/C creada con éxito", id: nuevoPago.id });
    } catch(e) {
        console.log("Error al crear el pago: ", e)
        res.status(500).json({ message: 'Error al crear la cobranza A/C' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pago_id = req.id
        const { monto, destino, fecha } = req

        // Validar si el articulo existe antes de intentar actualizarla
        const pagoExiste = await pagoModel.findByPk(pago_id);
        if (!pagoExiste) {
            return res.status(404).json({ message: 'Cobranza A/C no encontrada' });
        }

        await pagoModel.update
        (
            {
                monto,
                destino,
                fecha
            }, 
            {
            where: { id: pago_id }
            }
        )

        res.status(200).json({ message: 'Cobranza A/C editada con éxito' });
    } catch(e) {
        console.log("Error al editar el pago: ", e)
        res.status(500).json({ message: 'Error al editar la cobranza A/C' });
    }
};

const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pago_id = req.id

        // Validar si el articulo existe antes de intentar actualizarla
        const pagoExiste = await pagoModel.findByPk(pago_id);
        if (!pagoExiste) {
            return res.status(404).json({ message: 'Cobranza A/C no encontrada' });
        }

        await pagoModel.destroy({
            where: { id: pago_id },
            force: true
        });

        res.status(200).json({ message: "Cobranza A/C eliminada con éxito" });
    } catch(e) {
        console.log("Error al eliminar el pago: ", e)
        res.status(500).json({ message: 'Error al eliminar la cobranza A/C' });
    }
};

module.exports = {getItems, createItem, updateItem, deleteItem};