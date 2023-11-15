const { clienteModel, personaModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const clientes = await clienteModel.findAll({include: [{model: personaModel}]})
        res.status(200).send(clientes)
    } catch (e) {
        console.log("Error al buscar los clientes: ", e)
        res.status(500).json({ message: 'Error al buscar los clientes' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { nombre, email, telefono, direccion, dni, cuit_cuil, tipo_cliente, forma_de_envio, codigo_postal, ciudad, provincia } = req

        const nuevaPersona = await personaModel.create
        (
            {
                nombre,
                email,
                telefono,
                direccion,
                es_proveedor: false,
            }
        )
        
        const nuevoCliente = await clienteModel.create
        (
            {
                persona_id: nuevaPersona.id,
                dni,
                cuit_cuil,
                tipo_cliente,
                forma_de_envio,
                codigo_postal,
                ciudad,
                provincia
            }
        )
        
        res.status(201).json({ message: 'Cliente creado con éxito', id: nuevoCliente.id, persona_id: nuevaPersona.id });
    } catch(e) {
        console.log("Error al crear el cliente: ", e)
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
};

const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const cliente_id = req.id
        const { nombre, email, telefono, direccion, persona_id, dni, cuit_cuil, tipo_cliente, forma_de_envio, codigo_postal, ciudad, provincia } = req
        
        // Validar si la persona existe antes de intentar actualizarla
        const personaExiste = await personaModel.findByPk(persona_id);
        if (!personaExiste) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        // Validar si el cliente existe antes de intentar actualizarlo
        const clienteExiste = await clienteModel.findByPk(cliente_id);
        if (!clienteExiste) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await personaModel.update
        (
            {
                nombre,
                email,
                telefono,
                direccion
            }, 
            {
            where: { id: persona_id }
            }
        )

        await clienteModel.update
        (
            {
                dni,
                cuit_cuil,
                tipo_cliente,
                forma_de_envio,
                codigo_postal,
                ciudad,
                provincia
            },
            {
                where: { id: cliente_id }
            }
        )

        res.status(200).json({ message: 'Cliente editado con éxito' });
    } catch(e) {
        console.log("Error al editar el cliente: ", e)
        res.status(500).json({ message: 'Error al editar el cliente' });
    }
};

const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const cliente_id = req.id

        const cliente = await clienteModel.findByPk(cliente_id, {
            include: [{ model: personaModel, attributes: ['id'] }],
          });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await clienteModel.update
        (
            { 
                flag_activo: false 
            },
            { 
                where: { id: cliente_id } 
            }
        );

        await personaModel.update
        (
            {
                flag_activo: false
            },
            {
                where: { id: cliente.persona_id }
            }
        )

        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el cliente: ", e)
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};


module.exports = {getItems, createItem, updateItem, deleteItem};