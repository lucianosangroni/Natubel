const { articuloModel } = require("../modelos");

const updateItems = async (req, res) => {
    try {
        const articulosCambiados = req.body

        for (const articulo of articulosCambiados) {
            const articuloExiste = await articuloModel.findByPk(articulo.id)

            if(articuloExiste) {
                await articuloModel.update
                (
                    {
                        precio_minorista: articulo.precio_minorista,
                        precio_mayorista: articulo.precio_mayorista,
                        precio_distribuidor: articulo.precio_distribuidor
                    }, 
                    {
                        where: { id: articulo.id }
                    }
                )
            }
        }

        res.status(200).json({ message: 'Precios editados con éxito' });
    } catch(e) {
        console.log("Error al editar los precios: ", e)
        res.status(500).json({ message: 'Error al editar los precios' });
    }
};

module.exports = {updateItems};