const { articuloModel, productoModel } = require("../modelos");

const getItems = async (req, res) => {
    try {
        const articulos = await articuloModel.findAll(
            {
                include: 
                [
                    {
                        model: productoModel,
                    }
                ]
            }
        )

        res.status(200).send(articulos)
    } catch (e) {
        console.log("Error al buscar los articulos: ", e)
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const createItem = async (req, res) => {
    try {
        //req = matchedData(req);
        const { numero_articulo, nombre, descripcion, precio_unitario, talles, colores } = req.body

        const nuevoArticulo = await articuloModel.create
        (
            {
                numero_articulo,
                nombre,
                descripcion,
                precio_unitario
            }
        )

        console.log(talles)

        talles.forEach(talle => {
            colores.forEach(async color => {
                await productoModel.create
                (
                    {
                        stock: 0,
                        articulo_id: nuevoArticulo.id,
                        talle_id: talle.talle_id,
                        color_id: color.color_id
                    }
                )
            });
        });
        
        res.status(201).json({ message: 'Articulo creado con éxito' });
    } catch(e) {
        console.log("Error al crear el articulo: ", e)
        res.status(500).json({ message: 'Error al crear el articulo' });
    }
};


const updateItem = async (req, res) => {
    try {
        articulo_id = req.params.id
        const { numero_articulo, nombre, descripcion, precio_unitario, productos, talles, colores } = req.body
        
        // Validar si el articulo existe antes de intentar actualizarla
        const articuloExiste = await articuloModel.findByPk(articulo_id);
        if (!articuloExiste) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        await articuloModel.update
        (
            {
                numero_articulo,
                nombre,
                descripcion,
                precio_unitario
            }, 
            {
            where: { id: articulo_id }
            }
        )

        const productosViejos = productos.map(producto => ({ ...producto, eliminar: true }));
        const talles_ids = talles.map(talle => talle.talle_id)
        const colores_ids = colores.map(color => color.color_id)

        const productosTotales = [];
        talles_ids.forEach(talle_id => {
            colores_ids.forEach(color_id => {
                productosTotales.push({ talle_id, color_id, yaExiste: false });
            });
        });

        console.log(productosTotales)

        productosTotales.forEach(productoNuevo => {
            productosViejos.forEach(productoViejo => {
                if(productoViejo.talle_id == productoNuevo.talle_id && productoViejo.color_id == productoNuevo.color_id) {
                    productoNuevo.yaExiste = true
                    productoViejo.eliminar = false
                }
            })
        })

        const productosACrear = productosTotales.filter(producto => !producto.yaExiste)

        const productosAEliminar = productosViejos.filter(producto => producto.eliminar)

        productosACrear.forEach(async producto => {
            await productoModel.create
                (
                    {
                        stock: 0,
                        articulo_id: articulo_id,
                        talle_id: producto.talle_id,
                        color_id: producto.color_id
                    }
                )
        })

        productosAEliminar.forEach(async producto => {
            await productoModel.update
            (
                { 
                    flag_activo: false 
                },
                { 
                    where: { id: producto.producto_id } 
                } 
            )
        })

        res.status(200).json({ message: 'Articulo editado con éxito' });
    } catch(e) {
        console.log("Error al editar el articulo: ", e)
        res.status(500).json({ message: 'Error al editar el articulo' });
    }
};


const deleteItem = async (req, res) => {
    try {
        articulo_id = req.params.id

        // Validar si el articulo existe antes de intentar actualizarlo
        const articuloExiste = await articuloModel.findByPk(articulo_id);
        if (!articuloExiste) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        await articuloModel.update
        (
            { 
                flag_activo: false 
            },
            { 
                where: { id: articulo_id } 
            }
        );

        await productoModel.update
        (
            {
                flag_activo: false 
            },
            {
                where: { articulo_id }
            }
        )

        res.status(200).json({ message: 'Articulo eliminado con éxito' });
    } catch(e) {
        console.log("Error al eliminar el articulo: ", e)
        res.status(500).json({ message: 'Error al eliminar el articulo' });
    }
    
    


};

module.exports = {getItems, createItem, updateItem, deleteItem};