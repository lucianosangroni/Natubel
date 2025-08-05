const { porcentajeModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const porcentajes = await porcentajeModel.findAll()
        res.status(200).send(porcentajes)
    } catch (e) {
        console.log("Error al buscar los porcentajes: ", e)
        res.status(500).json({ message: 'Error al buscar los porcentajes' });
    }
};

const createItem = async (req, res) => {
    try {
        const { porcentajes } = req.body

        for (const marcaId in porcentajes) {
            const datos = porcentajes[marcaId];

            for (const [tipo_precioKey, valor] of Object.entries(datos)) {
                let ganancia = parseFloat(valor);
                if (isNaN(ganancia)) ganancia = 0;
                const tipo_precio = tipo_precioKey.toLowerCase() === "cinco" ? "5%" : tipo_precioKey.toLowerCase() === "diez" ? "10%" : tipo_precioKey.toLowerCase() === "demarca" ? "DE MARCA" : tipo_precioKey.toUpperCase();
                
                const registroExistente = await porcentajeModel.findOne({
                    where: { marca_id: marcaId, tipo_precio },
                });

                if (registroExistente) {
                    await porcentajeModel.update(
                        {
                            ganancia
                        },
                        {
                            where: {id: registroExistente.id}
                        }
                    );
                } else {
                    await porcentajeModel.create(
                        {
                            marca_id: marcaId,
                            tipo_precio,
                            ganancia,
                        }
                    );
                }
            }
        }

        res.status(201).json({ message: "Porcentajes actualizados con éxito" });
    } catch(e) {
        console.log("Error al actualizar los porcentajes: ", e)
        res.status(500).json({ message: 'Error al actualizar los porcentajes' });
    }
};

module.exports = {getItems, createItem};