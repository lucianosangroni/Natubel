const { articuloModel, productoModel } = require("../modelos");
const { getTokenMl } = require("../controllers/mercadolibre")

const updateItems = async (req, res) => {
    try {
        const articulosCambiados = req.body

        const tokenML = await getTokenMl()

        for (const articulo of articulosCambiados) {
            const articuloExiste = await articuloModel.findByPk(articulo.id)

            if(articuloExiste.ml_item_id !== null && articuloExiste.precio_ml !== articulo.precio_ml) {
                const productos = await productoModel.findAll({
                    where: { articulo_id: articulo.id }
                })

                for (const p of productos) {
                    if (!p.ml_product_id) continue

                    const response = await fetch(
                        `https://api.mercadolibre.com/items/${p.ml_product_id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${tokenML}`,
                            },
                            body: JSON.stringify({
                                price: articulo.precio_ml
                            })
                        }
                    )
                
                    if (!response.ok) {
                        const err = await response.text()
                        console.log("Error actualizando precio ML:", err)
                        return res.status(500).json({ message: 'Error al editar los precios de MercadoLibre' });
                    }
                }
            }

            if(articuloExiste) {
                await articuloModel.update
                (
                    {
                        precio_minorista: articulo.precio_minorista,
                        precio_mayorista: articulo.precio_mayorista,
                        precio_distribuidor: articulo.precio_distribuidor,
                        precio_de_marca: articulo.precio_de_marca,
                        precio_ml: articulo.precio_ml
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