const { colorModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const colores = await colorModel.findAll()
        res.status(200).send(colores)
    } catch (e) {
        console.log("Error al buscar los colores: ", e)
        res.status(500).json({ message: 'Error al buscar los colores' });
    }
};

const createItem = async (req, res) => {
    try {
        //req = matchedData(req);
        const { descripcion } = req.body

        await colorModel.create
        (
            {
                descripcion
            }
        )
        
        res.status(201).json({ message: 'Color creado con éxito' });
    } catch(e) {
        console.log("Error al crear el color: ", e)
        res.status(500).json({ message: 'Error al crear el color' });
    }
};

const updateItem = async (req, res) => {
    try {
        color_id = req.params.id
        const { descripcion } = req.body
        
        // Validar si el color existe antes de intentar actualizarla
        const colorExiste = await colorModel.findByPk(color_id);
        if (!colorExiste) {
            return res.status(404).json({ message: 'Color no encontrado' });
        }

        await colorModel.update
        (
            {
                descripcion
            }, 
            {
            where: { id: color_id }
            }
        )

        res.status(200).json({ message: 'Color editado con éxito' });
    } catch(e) {
        console.log("Error al editar el color: ", e)
        res.status(500).json({ message: 'Error al editar el color' });
    }
};

const deleteItem = async (req, res) => {
    try {
        color_id = req.params.id

        // Validar si el color existe antes de intentar actualizarlo
        const colorExiste = await colorModel.findByPk(color_id);
        if (!colorExiste) {
            return res.status(404).json({ message: 'Color no encontrado' });
        }

        await colorModel.update
        (
            { 
                flag_activo: false 
            },
            { 
                where: { id: color_id } 
            }
        );

        res.status(200).json({ message: 'Color eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el color: ", e)
        res.status(500).json({ message: 'Error al eliminar el color' });
    }
    
    


};


module.exports = {getItems, createItem, updateItem, deleteItem};