const { categoriaModel } = require("../modelos");
const { matchedData } = require("express-validator");
const { sequelize } = require("../config/dbConnect")

const getItems = async (req, res) => {
    try {
        const categorias = await categoriaModel.findAll()
        res.status(200).send(categorias)
    } catch (e) {
        console.log("Error al buscar las categorias: ", e)
        res.status(500).json({ message: 'Error al buscar las categorias' });
    }
};

const createItem = async (req, res) => {
    try {
        req = matchedData(req);

        const { nombre } = req

        const nuevaCategoria = await categoriaModel.create
        (
            {
                nombre
            }
        )

        res.status(201).json({ message: 'Categoria creada con éxito', id: nuevaCategoria.id });
    } catch(e) {
        console.log("Error al crear la categoria: ", e)
        res.status(500).json({ message: 'Error al crear la categoria' });
    }
};


const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const categoria_id = req.id
        const { nombre } = req
        
        // Validar si el articulo existe antes de intentar actualizarla
        const categoriaExiste = await categoriaModel.findByPk(categoria_id);
        if (!categoriaExiste) {
            return res.status(404).json({ message: 'Categoria no encontrada' });
        }

        await categoriaModel.update
        (
            {
                nombre
            }, 
            {
            where: { id: categoria_id }
            }
        )

        res.status(200).json({ message: 'Categoria editada con éxito' });
    } catch(e) {
        console.log("Error al editar la categoria: ", e)
        res.status(500).json({ message: 'Error al editar la categoria' });
    }
};


const deleteItem = async (req, res) => {

};

module.exports = {getItems, createItem, updateItem, deleteItem};