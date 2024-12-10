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

        const { monto, destino, persona_id } = req

        const nuevoPago = await pagoModel.create
        (
            {
                monto,
                destino,
                persona_id
            }
        )

        res.status(201).json({ message: 'Pago creado con éxito', id: nuevoPago.id });
    } catch(e) {
        console.log("Error al crear el pago: ", e)
        res.status(500).json({ message: 'Error al crear el pago' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pago_id = req.id
        const { monto, destino } = req
    
        // Validar si el articulo existe antes de intentar actualizarla
        const pagoExiste = await pagoModel.findByPk(pago_id);
        if (!pagoExiste) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        await pagoModel.update
        (
            {
                monto,
                destino
            }, 
            {
            where: { id: pago_id }
            }
        )

        res.status(200).json({ message: 'Pago editado con éxito' });
    } catch(e) {
        console.log("Error al editar el pago: ", e)
        res.status(500).json({ message: 'Error al editar el pago' });
    }
};

const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const pago_id = req.id

        // Validar si el articulo existe antes de intentar actualizarla
        const pagoExiste = await pagoModel.findByPk(pago_id);
        if (!pagoExiste) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        await pagoModel.destroy({
            where: { id: pago_id },
            force: true
        });

        res.status(200).json({ message: 'Pago eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el pago: ", e)
        res.status(500).json({ message: 'Error al eliminar el pago' });
    }
};

module.exports = {getItems, createItem, updateItem, deleteItem};