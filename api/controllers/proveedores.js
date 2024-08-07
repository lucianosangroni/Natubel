const { where } = require("sequelize");
const { personaModel, pedidoModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const proveedores = await personaModel.findAll( { where: {es_proveedor: true} } )
        res.status(200).send(proveedores)
    } catch (e) {
        console.log("Error al buscar los proveedores: ", e)
        res.status(500).json({ message: 'Error al buscar los proveedores' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { nombre, email, telefono, cuit_cuil, direccion } = req

        const nuevaPersona = await personaModel.create
        (
            {
                nombre,
                email,
                telefono,
                cuit_cuil,
                direccion,
                es_proveedor: true,
            }
        )

        res.status(201).json({ message: 'Proveedor creado con éxito', id: nuevaPersona.id });
    } catch(e) {
        console.log("Error al crear el proveedor: ", e)
        res.status(500).json({ message: 'Error al crear el proveedor' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const proveedor_id = req.id
        const { nombre, email, telefono, cuit_cuil, direccion } = req
        
        // Validar si el proveedor existe antes de intentar actualizarla
        const proveedorExiste = await personaModel.findByPk(proveedor_id);
        if (!proveedorExiste) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        await personaModel.update
        (
            {
                nombre,
                email,
                telefono,
                cuit_cuil,
                direccion
            }, 
            {
            where: { id: proveedor_id }
            }
        )

        res.status(200).json({ message: 'Proveedor editado con éxito' });
    } catch(e) {
        console.log("Error al editar el proveedor: ", e)
        res.status(500).json({ message: 'Error al editar el proveedor' });
    }
};

const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const proveedor_id = req.id

        // Validar si el proveedor existe antes de intentar actualizarlo
        const proveedorExiste = await personaModel.findByPk(proveedor_id);
        if (!proveedorExiste) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        const pedidoConProveedorExiste = await pedidoModel.findOne({ where: { persona_id: proveedor_id } });
        if (pedidoConProveedorExiste) {
            return res.status(200).json({ message: "No se puede eliminar el proveedor porque hay un pedido a su nombre" })
        }

        await personaModel.destroy({
            where: { id: proveedor_id },
            force: true
        });

        res.status(200).json({ message: 'Proveedor eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el proveedor: ", e)
        res.status(500).json({ message: 'Error al eliminar el proveedor' });
    }
};


module.exports = {getItems, createItem, updateItem, deleteItem};