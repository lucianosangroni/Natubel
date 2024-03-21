const { configModel } = require("../modelos");

const getItem = async (req, res) => {
    try {
        const configuracion = await configModel.findOne();

        if (!configuracion) {
            return res.status(404).json({ message: "Configuración no encontrada" })
        }

        return res.status(200).json({ ...configuracion.dataValues });
    } catch (e) {
        console.log("Error al buscar la configuración: ", e)
        res.status(500).json({ message: 'Error al buscar la configuración' });
    }
}

const updateItem = async (req, res) => {
    try {
        const { montoMinimoMayorista, montoMinimoDistribuidor } = req.body

        const configuracion = await configModel.findOne();

        if (!configuracion) {
            return res.status(404).json({ message: "Configuración no encontrada" })
        }

        await configModel.update
        (
            {
                montoMinimoMayorista,
                montoMinimoDistribuidor
            },
            {
                where: { id: 1 }
            }
        )

        res.status(200).json({ message: 'Configuración editada con éxito' });
    } catch(e) {
        console.log("Error al editar la configuración: ", e)
        res.status(500).json({ message: 'Error al editar la configuración' });
    }
};

module.exports = { getItem, updateItem };