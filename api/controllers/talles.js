const { talleModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const talles = await talleModel.findAll()
        res.status(200).send(talles)
    } catch (e) {
        console.log("Error al buscar los talles: ", e)
        res.status(500).json({ message: 'Error al buscar los talles' });
    }
};

const createItem = async (req, res) => {
    try {
        //req = matchedData(req);
        const { descripcion } = req.body

        await talleModel.create
        (
            {
                descripcion
            }
        )
        
        res.status(201).json({ message: 'Talle creado con éxito' });
    } catch(e) {
        console.log("Error al crear el talle: ", e)
        res.status(500).json({ message: 'Error al crear el talle' });
    }
};

const updateItem = async (req, res) => {
    try {
        talle_id = req.params.id
        const { descripcion } = req.body
        
        // Validar si el talle existe antes de intentar actualizarla
        const talleExiste = await talleModel.findByPk(talle_id);
        if (!talleExiste) {
            return res.status(404).json({ message: 'Talle no encontrado' });
        }

        await talleModel.update
        (
            {
                descripcion
            }, 
            {
            where: { id: talle_id }
            }
        )

        res.status(200).json({ message: 'Talle editado con éxito' });
    } catch(e) {
        console.log("Error al editar el talle: ", e)
        res.status(500).json({ message: 'Error al editar el talle' });
    }
};

const deleteItem = async (req, res) => {
    try {
        talle_id = req.params.id

        // Validar si el talle existe antes de intentar actualizarlo
        const talleExiste = await talleModel.findByPk(talle_id);
        if (!talleExiste) {
            return res.status(404).json({ message: 'Talle no encontrado' });
        }

        await talleModel.update
        (
            { 
                flag_activo: false 
            },
            { 
                where: { id: talle_id } 
            }
        );

        res.status(200).json({ message: 'Talle eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el talle: ", e)
        res.status(500).json({ message: 'Error al eliminar el talle' });
    }
    
    


};


module.exports = {getItems, createItem, updateItem, deleteItem};