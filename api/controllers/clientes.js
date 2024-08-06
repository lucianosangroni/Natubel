const { clienteModel, personaModel, pedidoModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItem = async (req, res) => {
    try {
        const { email, cuit_cuil, dni, nombre } = req.body

        const persona = await personaModel.findOne({ where: { email } });

        if (persona) {
            const cliente = await clienteModel.findOne({ where: { persona_id: persona.id }, include: [{model: personaModel}] });

            if (cliente) {
                if (cuit_cuil !== "" && cuit_cuil !== null) {
                    const existingPersonaCuit = await personaModel.findOne({ where: { cuit_cuil: cuit_cuil } });
                    if (existingPersonaCuit &&  existingPersonaCuit.id !== parseInt(persona.id)) {
                        return res.status(200).json({ message: 'Ya existe una persona con el mismo CUIT/CUIL' });
                    }
                }
                
                if (dni !== "" && dni !== null) {
                    const existingPersonaDni = await clienteModel.findOne({ where: { dni: dni } });
                    if (existingPersonaDni && existingPersonaDni.id !== parseInt(cliente.id)) {
                        return res.status(200).json({ message: 'Ya existe una persona con el mismo DNI' });
                    }
                }
        
                const existingPersonaNombre = await personaModel.findOne({ where: { nombre: nombre } });
                if (existingPersonaNombre && existingPersonaNombre.id !== parseInt(persona.id)) {
                    return res.status(200).json({ message: 'Ya existe una persona con el mismo nombre' });
                }

                res.status(200).send({ message: "Cliente encontrado con éxito", cliente });
            } else {
                return res.status(200).send({ message: "Ya existe una persona con el mismo email" });
            }
        } else {
            if (cuit_cuil !== "" && cuit_cuil !== null) {
                const existingPersonaCuit = await personaModel.findOne({ where: { cuit_cuil: cuit_cuil } });
                if(existingPersonaCuit) {
                    return res.status(200).json({ message: 'Ya existe una persona con el mismo CUIT/CUIL' });
                }
            }

            if (dni !== "" && dni !== null) {
                const existingPersonaDni = await clienteModel.findOne({ where: { dni: dni } });
                if(existingPersonaDni) {
                    return res.status(200).json({ message: 'Ya existe una persona con el mismo DNI' });
                }
            }

            const existingPersonaNombre = await personaModel.findOne({ where: { nombre: nombre } });
            if(existingPersonaNombre) {
                return res.status(200).json({ message: 'Ya existe una persona con el mismo nombre' });
            }

            return res.status(200).send({ message: "Persona no encontrada" });
        }
    } catch (e) {
        console.log("Error al buscar los clientes: ", e)
        res.status(500).json({ message: 'Error al buscar los clientes' });
    }
}

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

        const { nombre, email, telefono, direccion, dni, cuit_cuil, tipo_cliente, tipo_envio, forma_de_envio, codigo_postal, ciudad, provincia } = req

        if (cuit_cuil !== "" && cuit_cuil !== null) {
            const existingPersonaCuit = await personaModel.findOne({ where: { cuit_cuil: cuit_cuil } });
            if (existingPersonaCuit) {
                return res.status(200).json({ message: 'Ya existe una persona con el mismo CUIT/CUIL' });
            }
        }
        
        if (dni !== "" && dni !== null) {
            const existingPersonaDni = await clienteModel.findOne({ where: { dni: dni } });
            if (existingPersonaDni) {
                return res.status(200).json({ message: 'Ya existe una persona con el mismo DNI' });
            }
        }

        const existingPersonaNombre = await personaModel.findOne({ where: { nombre: nombre } });
        if (existingPersonaNombre) {
            return res.status(200).json({ message: 'Ya existe una persona con el mismo nombre' });
        }

        const nuevaPersona = await personaModel.create
        (
            {
                nombre,
                email,
                telefono,
                cuit_cuil,
                direccion,
                es_proveedor: false,
            }
        )
        
        console.log(nuevaPersona)

        const nuevoCliente = await clienteModel.create
        (
            {
                persona_id: nuevaPersona.id,
                dni,
                tipo_cliente,
                tipo_envio,
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
        const { nombre, email, telefono, direccion, persona_id, dni, cuit_cuil, tipo_cliente, tipo_envio, forma_de_envio, codigo_postal, ciudad, provincia } = req
        
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

        if (cuit_cuil !== "" && cuit_cuil !== null) {
            const existingPersonaCuit = await personaModel.findOne({ where: { cuit_cuil: cuit_cuil } });
            if (existingPersonaCuit && existingPersonaCuit.id !== parseInt(persona_id)) {
                return res.status(200).json({ message: 'Ya existe una persona con el mismo CUIT/CUIL' });
            }
        }
        
        if (dni !== "" && dni !== null) {
            const existingPersonaDni = await clienteModel.findOne({ where: { dni: dni } });
            if (existingPersonaDni && existingPersonaDni.id !== parseInt(cliente_id)) {
                return res.status(200).json({ message: 'Ya existe una persona con el mismo DNI' });
            }
        }

        const existingPersonaNombre = await personaModel.findOne({ where: { nombre: nombre } });
        if (existingPersonaNombre && existingPersonaNombre.id !== parseInt(persona_id)) {
            return res.status(200).json({ message: 'Ya existe una persona con el mismo nombre' });
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
            where: { id: persona_id }
            }
        )

        await clienteModel.update
        (
            {
                dni,
                tipo_cliente,
                tipo_envio,
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

        const persona_id = cliente.persona_id

        const pedidoConClienteExiste = await pedidoModel.findOne({ where: { persona_id: persona_id } });
        if (pedidoConClienteExiste) {
            return res.status(200).json({ message: "No se puede eliminar el cliente porque hay un pedido a su nombre" })
        }

        await clienteModel.destroy({
            where: { id: cliente_id },
            force: true
        });

        await personaModel.destroy({
            where: { id: persona_id },
            force: true
        });

        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el cliente: ", e)
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};


module.exports = { getItem, getItems, createItem, updateItem, deleteItem };