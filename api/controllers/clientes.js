const { clienteModel, personaModel } = require("../modelos");

const getItems = (req, res) => {
    console.log("get clientes");
    res.send("clientes")
};

const createItem = async (req, res) => {
    try {
        //req = matchedData(req);
        const { nombre, email, telefono, direccion, es_proveedor, dni, cuit_cuil, tipo_cliente, forma_de_envio, codigo_postal, ciudad, provincia } = req.body

        const nuevaPersona = await personaModel.create(
            {
                nombre,
                email,
                telefono,
                direccion,
                es_proveedor,
            }
        )
        
        const nuevoCliente = await clienteModel.create(
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
        
        const data = {nuevaPersona, nuevoCliente}
        res.status(201).send({data})
    } catch(e) {
        console.log("Error al crear el cliente: ", e)
        res.status(500).send("ERROR")
    }
};

const updateItem = (req, res) => {
    console.log("put clientes");
    res.send("clientes")
};

const deleteItem = (req, res) => {
    console.log("delete clientes");
    res.send("clientes")
};


module.exports = {getItems, createItem, updateItem, deleteItem};