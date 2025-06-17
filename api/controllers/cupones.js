const { cuponModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const cupones = await cuponModel.findAll({
            where: { flag_eliminado: false }
        })
        res.status(200).send(cupones)
    } catch (e) {
        console.log("Error al buscar los cupones: ", e)
        res.status(500).json({ message: 'Error al buscar los cupones' });
    }
};

const createItem = async (req, res) => {
    try {
        const { clave, descuento, dias_validez } = req.body
        
        let fecha_fin = null

        if(dias_validez !== 0) {
            const hoy = new Date();
            hoy.setDate(hoy.getDate() + parseInt(dias_validez));
            fecha_fin = hoy.toISOString().split('T')[0];
        }

        const nuevoCupon = await cuponModel.create
        (
            {
                clave,
                descuento,
                fecha_fin,
            }
        )

        res.status(201).json({ message: 'Cupon creado con éxito', id: nuevoCupon.id });
    } catch(e) {
        console.log("Error al crear el cupon: ", e)
        res.status(500).json({ message: 'Error al crear el cupon' });
    }
};

const updateItem = async (req, res) => {

};

const cambiarActivacionItem = async (req, res) => {
    try {
        const cupon_id = req.params.id

        const cuponExiste = await cuponModel.findByPk(cupon_id);
        if (!cuponExiste) {
            return res.status(404).json({ message: 'Cupon no encontrado' });
        }

        await cuponModel.update
            (
                {
                    flag_activo: !cuponExiste.flag_activo
                }, 
                {
                where: { id: cupon_id }
                }
            )

        res.status(200).json({ message: 'Cupon editado con éxito' });
    } catch(e) {
        console.log("Error al editar el cupon: ", e)
        res.status(500).json({ message: 'Error al editar el cupon' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const cupon_id = req.params.id

        // Validar si el articulo existe antes de intentar actualizarla
        const cuponExiste = await cuponModel.findByPk(cupon_id);
        if (!cuponExiste) {
            return res.status(404).json({ message: 'Cupon no encontrado' });
        }

        await cuponModel.update
            (
                {
                    flag_eliminado: true
                }, 
                {
                    where: { id: cupon_id }
                }
            )

        res.status(200).json({ message: 'Cupon eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el cupon: ", e)
        res.status(500).json({ message: 'Error al eliminar el cupon' });
    }
};


module.exports = { getItems, createItem, updateItem, cambiarActivacionItem, deleteItem };