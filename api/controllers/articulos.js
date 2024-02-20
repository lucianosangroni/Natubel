const { articuloModel, productoModel, categoriaXArticuloModel, imagenModel, categoriaModel } = require("../modelos");
const { matchedData } = require("express-validator");
const { sequelize } = require("../config/dbConnect")
const URL_PUBLIC = process.env.URL_PUBLIC || null;
const fs = require('fs');

const getItems = async (req, res) => {
    try {
        const articulos = await articuloModel.findAll(
            {
                include: 
                [
                    {
                        model: productoModel, 
                    },
                    {
                        model: imagenModel,
                    },
                    {
                        model: categoriaModel,
                    },
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
        const { numero_articulo, categorias: categoriasString, descripcion, precio_mayorista, precio_minorista, precio_distribuidor, talles: tallesString, colores: coloresString } = req.body
        const imagenes = req.files.map((file) => file.filename);
        const categorias = JSON.parse(categoriasString);
        const talles = JSON.parse(tallesString);
        const colores = JSON.parse(coloresString);

        const nuevoArticulo = await articuloModel.create
        (
            {
                numero_articulo,
                descripcion,
                precio_mayorista,
                precio_minorista,
                precio_distribuidor
            }
        )

        for (const categoria of categorias) {
            await categoriaXArticuloModel.create
            (
                {
                    articulo_id: nuevoArticulo.id,
                    categoria_id: categoria,
                }
            )
        }

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

        const imagenesNuevas = []
        console.log(URL_PUBLIC)
        console.log(imagenes)
        for(const imagen of imagenes) {
            const nuevaImagen = await imagenModel.create
            (
                {
                    url: `${URL_PUBLIC}/${imagen}`,
                    articulo_id: nuevoArticulo.id,
                }
            )

            imagenesNuevas.push(nuevaImagen)
        }

        res.status(201).json({ message: 'Articulo creado con éxito', id: nuevoArticulo.id, productos: productos.flat(), imagenes: imagenesNuevas });
    } catch(e) {
        console.log("Error al crear el articulo: ", e)
        res.status(500).json({ message: 'Error al crear el articulo' });
    }
};


const updateItem = async (req, res) => {
    try {
        const articulo_id = req.params.id
        const { numero_articulo, categorias: categoriasString, descripcion, precio_mayorista, precio_minorista, precio_distribuidor, productos: productosString, talles: tallesString, colores: coloresString, imagenesRemove: imagenesRemoveString } = req.body
        const imagenesAdd = req.files.map((file) => file.filename);
        const imagenesRemove = JSON.parse(imagenesRemoveString)
        const categorias = JSON.parse(categoriasString);
        const productos = JSON.parse(productosString);
        const talles = JSON.parse(tallesString);
        const colores = JSON.parse(coloresString);

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
                precio_mayorista,
                precio_minorista,
                precio_distribuidor
            }, 
            {
            where: { id: articulo_id }
            }
        )

        const categoriasActuales = await categoriaXArticuloModel.findAll({
            where: { articulo_id: articulo_id }
        });

        const categoriasActualesIds = categoriasActuales.map(categoria => categoria.categoria_id);

        const categoriasAdd = categorias.filter(categoria => !categoriasActualesIds.includes(categoria));

        const categoriasDelete = categoriasActualesIds.filter(categoria => !categorias.includes(categoria));

        await Promise.all(categoriasAdd.map(async categoria => {
            await categoriaXArticuloModel.create({
                articulo_id: articulo_id,
                categoria_id: categoria
            });
        }));

        await Promise.all(categoriasDelete.map(async categoria => {
            await categoriaXArticuloModel.destroy({ 
                where: { 
                    articulo_id: articulo_id, 
                    categoria_id: categoria 
                } 
            });
        }));

        const imagenesNuevas = []

        for(const imagen of imagenesAdd) {
            const nuevaImagen = await imagenModel.create
            (
                {
                    url: `${URL_PUBLIC}/${imagen}`,
                    articulo_id: articulo_id,
                }
            )

            imagenesNuevas.push(nuevaImagen)
        }

        await Promise.all(imagenesRemove.map(async imagenId => {
            const imagen = await imagenModel.findByPk(imagenId);
            if (imagen) {
                const filename = imagen.url.split('/').pop();
                const filePath = `${__dirname}/../storage/${filename}`;
                fs.unlinkSync(filePath);

                await imagen.destroy();
            }
        }));

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

        res.status(200).json({ message: 'Articulo editado con éxito', productos: updatedProducts, imagenesNuevas });
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