const { marcaModel, articuloModel } = require("../modelos");
const { matchedData } = require("express-validator");

const getItems = async (req, res) => {
    try {
        const marcas = await marcaModel.findAll()
        res.status(200).send(marcas)
    } catch (e) {
        console.log("Error al buscar las marcas: ", e)
        res.status(500).json({ message: 'Error al buscar las marcas' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { nombre } = req

        const nuevaMarca = await marcaModel.create
        (
            {
                nombre
            }
        )

        res.status(201).json({ message: 'Marca creada con éxito', id: nuevaMarca.id });
    } catch(e) {
        console.log("Error al crear la marca: ", e)
        res.status(500).json({ message: 'Error al crear la marca' });
    }
};


const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const marca_id = req.id
        const { nombre } = req
        
        // Validar si el articulo existe antes de intentar actualizarla
        const marcaExiste = await marcaModel.findByPk(marca_id);
        if (!marcaExiste) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        await marcaModel.update
        (
            {
                nombre
            }, 
            {
            where: { id: marca_id }
            }
        )

        res.status(200).json({ message: 'Marca editada con éxito' });
    } catch(e) {
        console.log("Error al editar la marca: ", e)
        res.status(500).json({ message: 'Error al editar la marca' });
    }
};

const deleteItem = async (req, res) => {
    try {
        console.log("a")

        req = matchedData(req);

        const marca_id = req.id

        // Validar si el articulo existe antes de intentar actualizarla
        const marcaExiste = await marcaModel.findByPk(marca_id);
        if (!marcaExiste) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        const articuloConMarcaExiste = await articuloModel.findOne({ where: {marca_id: marca_id} });

        if(articuloConMarcaExiste) {
            return res.status(200).json({ message: "No se puede eliminar la marca porque hay un artículo que la tiene" })
        }

        await marcaModel.destroy({
            where: { id: marca_id },
            force: true
        });

        res.status(200).json({ message: 'Marca eliminada con éxito' });
    } catch(e) {
        console.log("Error al eliminar la marca: ", e)
        res.status(500).json({ message: 'Error al eliminar la marca' });
    }
};

module.exports = {getItems, createItem, updateItem, deleteItem};