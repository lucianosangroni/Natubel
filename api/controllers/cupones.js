const { cuponModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const cupones = await cuponModel.findAll()
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

};

const deleteItem = async (req, res) => {

};


module.exports = { getItems, createItem, updateItem, cambiarActivacionItem, deleteItem };