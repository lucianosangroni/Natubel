const { clientesModel } = require("../modelos");

const getItems = (req, res) => {
    console.log("get clientes");
    res.send("clientes")
};

const createItem = async (req, res) => {
    try {
        //req = matchedData(req);
        console.log(req.body)
        const data = await clientesModel.create(req.body)
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