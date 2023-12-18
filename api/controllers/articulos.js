const { articuloModel, productoModel } = require("../modelos");
const { matchedData } = require("express-validator");
const { sequelize } = require("../config/dbConnect")

const getItems = async (req, res) => {
    try {
        const articulos = await articuloModel.findAll(
            {
                include: 
                [
                    {
                        model: productoModel,
                    }
                ],
                order: sequelize.literal("CAST(SUBSTRING_INDEX(numero_articulo, ' ', 1) AS UNSIGNED), SUBSTRING_INDEX(numero_articulo, ' ', -1) ASC")
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
        req = matchedData(req);

        const { numero_articulo, descripcion, precio_unitario, talles, colores } = req

        const nuevoArticulo = await articuloModel.create
        (
            {
                numero_articulo,
                descripcion,
                precio_unitario
            }
        )

        const productos = await Promise.all(talles.map(async (talle) => {
            return Promise.all(colores.map(async (color) => {
                const nuevoProducto = await productoModel.create({
                    stock: 0,
                    articulo_id: nuevoArticulo.id,
                    talle: talle,
                    color: color
                });

                return { id: nuevoProducto.id, stock: 0, talle, color };
            }));
        }));

        res.status(201).json({ message: 'Articulo creado con éxito', id: nuevoArticulo.id, productos: productos.flat() });
    } catch(e) {
        console.log("Error al crear el articulo: ", e)
        res.status(500).json({ message: 'Error al crear el articulo' });
    }
};


const updateItem = async (req, res) => {
    try {
        req = matchedData(req);

        const articulo_id = req.id
        const { numero_articulo, descripcion, precio_unitario, productos, talles, colores } = req
        
        // Validar si el articulo existe antes de intentar actualizarla
        const articuloExiste = await articuloModel.findByPk(articulo_id);
        if (!articuloExiste) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        await articuloModel.update
        (
            {
                numero_articulo,
                descripcion,
                precio_unitario
            }, 
            {
            where: { id: articulo_id }
            }
        )

        const productosViejos = productos.map(producto => ({ ...producto, eliminar: true }));

        const productosTotales = [];
        talles.forEach(talle => {
            colores.forEach(color => {
                productosTotales.push({ talle, color, yaExiste: false });
            });
        });

        productosTotales.forEach(productoNuevo => {
            productosViejos.forEach(productoViejo => {
                if(productoViejo.talle == productoNuevo.talle && productoViejo.color == productoNuevo.color) {
                    productoNuevo.yaExiste = true
                    productoViejo.eliminar = false
                }
            })
        })

        const productosACrear = productosTotales.filter(producto => !producto.yaExiste)

        const productosAEliminar = productosViejos.filter(producto => producto.eliminar)

        await Promise.all(productosACrear.map(async producto => {
            await productoModel.create({
                stock: 0,
                articulo_id: articulo_id,
                talle: producto.talle,
                color: producto.color
            });
        }));
        
        await Promise.all(productosAEliminar.map(async producto => {
            await productoModel.update(
                { 
                    flag_activo: false 
                },
                { 
                    where: { id: producto.producto_id } 
                } 
            );
        }));

        const updatedProducts = await productoModel.findAll({
            attributes: ['id', 'stock', 'talle', 'color'],
            where: { articulo_id: articulo_id, flag_activo: true },
        });

        res.status(200).json({ message: 'Articulo editado con éxito', productos: updatedProducts });
    } catch(e) {
        console.log("Error al editar el articulo: ", e)
        res.status(500).json({ message: 'Error al editar el articulo' });
    }
};


const deleteItem = async (req, res) => {
    try {
        req = matchedData(req);

        const articulo_id = req.id

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