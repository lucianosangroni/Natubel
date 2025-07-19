const { articuloModel, productoModel, pedidoModel, personaModel, productoXPedidoModel, remitoModel, clienteModel, marcaModel, pagoModel, facturaModel, imputacionModel, cuponModel } = require("../modelos");
const PDFDocument = require('pdfkit');
const { sequelize } = require("../config/dbConnect");

const getStockAdmin = async (req, res) => {
    try {
        const marca = req.query.marca;
        const flagSinStock = req.query.flagSinStock;

        const filtros = {};
        let marcaNombre = "";

        if (marca && marca !== "todas") {
            filtros.marca_id = marca;

            const marcaDB = await marcaModel.findByPk(marca)
            marcaNombre = marcaDB.nombre
        }

        const articulos = await articuloModel.findAll(
            {
                where: filtros,
                include: 
                [
                    {
                        model: productoModel,
                    }
                ],
                order: sequelize.literal("CAST(SUBSTRING_INDEX(numero_articulo, ' ', 1) AS UNSIGNED), SUBSTRING_INDEX(numero_articulo, ' ', -1) ASC")
            }
        )

        const articulosDataSinFiltrar = articulos.map((articulo) => {
            const articuloData = articulo.dataValues;
        
            if (articuloData.productos) {
                articuloData.productos = articuloData.productos.map((producto) => producto.dataValues);
            }
        
            return articuloData;
        });

        let articulosData;

        if (flagSinStock !== "false") {
            articulosData = articulosDataSinFiltrar;
        } else {
            const articulosConStock = articulosDataSinFiltrar.filter(art => 
                art.productos.some(prod => prod.stock > 0)
            )

            articulosData = articulosConStock.map(articulo => {
                const coloresValidos = new Set();
                const tallesValidos = new Set();
        
                articulo.productos.forEach(producto => {
                    if (producto.stock > 0) {
                        coloresValidos.add(producto.color);
                        tallesValidos.add(producto.talle);
                    }
                });
        
                const productosFiltrados = articulo.productos.filter((producto) => 
                    coloresValidos.has(producto.color) && tallesValidos.has(producto.talle)
                );
        
                return {...articulo, productos: productosFiltrados};
            });
        }

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;

        const nombreArchivo = `Stock adm ${marcaNombre} ${fechaFormateada.replace(/\//g, '-')}.pdf`;

        const doc = new PDFDocument({ margin: 0 });

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.fontSize(15).fillColor('black').font('Helvetica-Bold').text(`STOCK ${marcaNombre.toUpperCase()}`, 30, 20);
        
        doc.fontSize(12).text(fechaFormateada, 540, 22);

        doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
        doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
        doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
        doc.moveTo(20, 40).lineTo(592, 40).stroke('black');

        doc.y = 45;
        let segunda_columna = false;

        articulosData.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.stock, 0);

            const talles = tallesDesordenados.sort((a, b) => {
                const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;

                const parseRango = (x) => {
                    const match = x.match(rangoRegex);
                    if (!match) return null;
                    return {
                        start: parseInt(match[1]),
                        end: parseInt(match[2]),
                        texto: x.substring(match[0].length).trim()
                    };
                };

                const rangoA = parseRango(a);
                const rangoB = parseRango(b);

                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
                } else if (rangoA && rangoB) {
                    return rangoA.start - rangoB.start;
                }
                
                const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
            });

            const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

            const table = {
                headers: [`ART. ${articulo.numero_articulo}`, ...talles],
                rows: [],
            };

            colores.forEach((color) => {
                const row = [color];

                talles.forEach((talle) => {
                    const stock = articulo.productos.find((producto) => producto.talle === talle && producto.color === color).stock
                    if (stock === 0) {
                        row.push(" ")
                    } else {
                        row.push(stock)
                    }
                })
                
                table.rows.push(row);
            });

            let tableStartX = segunda_columna ? 309 : 20;
            let tableStartY = doc.y;
            const firstCellWidth = 68;
            const cellWidth = 215/table.headers.length;
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > 740) {
                if (segunda_columna) {
                    doc.addPage();

                    doc.fontSize(15).fillColor('black').font('Helvetica-Bold').text('NATUBEL STOCK', 30, 20);

                    const fechaDeHoy = new Date();
                    const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                    doc.fontSize(12).text(fechaFormateada, 540, 22);

                    doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
                    doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
                    doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
                    doc.moveTo(20, 40).lineTo(592, 40).stroke('black');

                    tableStartX = 20;

                    segunda_columna = false;
                } else {
                    tableStartX = 309;

                    segunda_columna = true;
                }

                doc.y = 45;
                tableStartY = doc.y;
            } 

            table.headers.forEach((header, i) => {
                if (i === 0){
                    doc.rect(tableStartX, tableStartY, firstCellWidth, cellHeight).fillAndStroke('black', 'black');
                    doc.fontSize(10).fillColor("white").text(header, tableStartX + 5, tableStartY + 6);
                } else {
                    doc.rect(tableStartX + firstCellWidth + (i-1) * cellWidth, tableStartY, cellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                    doc.fontSize(10).fillColor("black").text(header.toString().toUpperCase(), tableStartX + firstCellWidth + (i-1) * cellWidth + 5, tableStartY + 6);
                }
            });

            doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY, cellWidth, cellHeight).fillAndStroke('lightgray', 'black')
            doc.fontSize(10).fillColor("black").text("Total", tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth + 5, tableStartY + 6)
            doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY + cellHeight, cellWidth, cellHeight).fillAndStroke('black', 'black');
            doc.fontSize(10).fillColor("white").text(total, tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth + 5, tableStartY + cellHeight + 6)

            table.rows.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (j === 0) {
                        doc.rect(tableStartX, tableStartY + (i + 1) * cellHeight, firstCellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } else {
                        doc.rect(tableStartX  + firstCellWidth + (j-1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('white', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + firstCellWidth + (j-1) * cellWidth + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } 
                });

                if(i > 0) {
                    doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                }
            });

            doc.y = doc.y + 5;
        });

        doc.end();
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getStockCliente = async (req, res) => {
    try {
        const marca = req.query.marca;
        const flagSinStock = req.query.flagSinStock;

        const filtros = {};
        let marcaNombre = "";

        if (marca && marca !== "todas") {
            filtros.marca_id = marca;

            const marcaDB = await marcaModel.findByPk(marca)
            marcaNombre = marcaDB.nombre
        }

        const articulos = await articuloModel.findAll(
            {
                where: filtros,
                include: 
                [
                    {
                        model: productoModel,
                    }
                ],
                order: sequelize.literal("CAST(SUBSTRING_INDEX(numero_articulo, ' ', 1) AS UNSIGNED), SUBSTRING_INDEX(numero_articulo, ' ', -1) ASC")
            }
        )

        const articulosDataSinFiltrar = articulos.map((articulo) => {
            const articuloData = articulo.dataValues;
        
            if (articuloData.productos) {
                articuloData.productos = articuloData.productos.map((producto) => producto.dataValues);
            }
        
            return articuloData;
        });

        let articulosData;

        if (flagSinStock !== "false") {
            articulosData = articulosDataSinFiltrar;
        } else {
            const articulosConStock = articulosDataSinFiltrar.filter(art => 
                art.productos.some(prod => prod.stock > 0)
            )

            articulosData = articulosConStock.map(articulo => {
                const coloresValidos = new Set();
                const tallesValidos = new Set();
        
                articulo.productos.forEach(producto => {
                    if (producto.stock > 0) {
                        coloresValidos.add(producto.color);
                        tallesValidos.add(producto.talle);
                    }
                });
        
                const productosFiltrados = articulo.productos.filter((producto) => 
                    coloresValidos.has(producto.color) && tallesValidos.has(producto.talle)
                );
        
                return {...articulo, productos: productosFiltrados};
            });
        }

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;

        const nombreArchivo = `Stock ${marcaNombre} ${fechaFormateada.replace(/\//g, '-')}.pdf`;

        const doc = new PDFDocument({ margin: 0 });

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.fontSize(15).fillColor('black').font('Helvetica-Bold').text(`STOCK ${marcaNombre.toUpperCase()}`, 30, 20);

        doc.fontSize(12).text(fechaFormateada, 540, 22);

        doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
        doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
        doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
        doc.moveTo(20, 40).lineTo(592, 40).stroke('black');

        doc.y = 45;
        let segunda_columna = false;

        articulosData.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

            const talles = tallesDesordenados.sort((a, b) => {
                const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;

                const parseRango = (x) => {
                    const match = x.match(rangoRegex);
                    if (!match) return null;
                    return {
                        start: parseInt(match[1]),
                        end: parseInt(match[2]),
                        texto: x.substring(match[0].length).trim()
                    };
                };

                const rangoA = parseRango(a);
                const rangoB = parseRango(b);

                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
                } else if (rangoA && rangoB) {
                    return rangoA.start - rangoB.start;
                }
                
                const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
            });

            const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

            const table = {
                headers: [`ART. ${articulo.numero_articulo}`, ...talles],
                rows: [],
            };

            colores.forEach((color) => {
                const row = [color];

                talles.forEach((talle) => {
                    const stock = articulo.productos.find((producto) => producto.talle === talle && producto.color === color).stock
                    if (stock > 0) {
                        row.push("X")
                    } else {
                        row.push(" ")
                    }
                })
                
                table.rows.push(row);
            });
            
            let tableStartX = segunda_columna ? 309 : 20;
            let tableStartY = doc.y;
            const firstCellWidth = 68;
            const cellWidth = 215/ (table.headers.length - 1);
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > 740) {
                if (segunda_columna) {
                    doc.addPage();

                    doc.fontSize(15).fillColor('black').font('Helvetica-Bold').text('NATUBEL STOCK', 30, 20);

                    const fechaDeHoy = new Date();
                    const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                    doc.fontSize(12).text(fechaFormateada, 540, 22);

                    doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
                    doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
                    doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
                    doc.moveTo(20, 40).lineTo(592, 40).stroke('black');

                    tableStartX = 20;

                    segunda_columna = false;
                } else {
                    tableStartX = 309;

                    segunda_columna = true;
                }

                doc.y = 45;
                tableStartY = doc.y;
            } 

            table.headers.forEach((header, i) => {
                if (i === 0){
                    doc.rect(tableStartX, tableStartY, firstCellWidth, cellHeight).fillAndStroke('black', 'black');
                    doc.fontSize(10).fillColor("white").text(header, tableStartX + 5, tableStartY + 6);
                } else {
                    doc.rect(tableStartX + firstCellWidth + (i-1) * cellWidth, tableStartY, cellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                    doc.fontSize(10).fillColor("black").text(header.toString().toUpperCase(), tableStartX + firstCellWidth + (i-1) * cellWidth + (cellWidth/2) - (doc.widthOfString(header.toString().toUpperCase())/2), tableStartY + 6);
                }
            });

            table.rows.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (j === 0) {
                        doc.rect(tableStartX, tableStartY + (i + 1) * cellHeight, firstCellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } else {
                        doc.rect(tableStartX  + firstCellWidth + (j-1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('white', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + firstCellWidth + (j-1) * cellWidth + (cellWidth/2) - (doc.widthOfString(cell)/2), tableStartY + (i + 1) * cellHeight + 6);
                    } 
                });
            });

            doc.y = doc.y + 5;
        });

        doc.end();
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getNotaPedido = async (req, res) => {
    try {
        const pedido_id = req.params.id

        const pedido = await pedidoModel.findByPk(pedido_id, {
            include: [
                {
                    model: productoModel,
                    through: {
                        model: productoXPedidoModel,
                        attributes: ['cantidad', 'precio_unitario'],
                    },
                },
            ],
        });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const persona = await personaModel.findByPk(pedido.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const cliente = await clienteModel.findOne({where: {persona_id: pedido.persona_id}})

        const articulosDelPedido = Array.from(new Set(pedido.productos.map((producto) => producto.articulo_id)))

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

        const articulosAMostrar = articulos.map((articulo) => {
            if(articulosDelPedido.includes(articulo.id)) {
                const productos = articulo.productos.map((producto) => {
                    let cantidad = 0;

                    const productoCoincidencia = pedido.productos.find((productoPedido) => productoPedido.id === producto.id)
                    if(productoCoincidencia) {
                        cantidad = productoCoincidencia.productos_x_pedido.cantidad
                    }

                    const newProduct = {
                        color: producto.color,
                        talle: producto.talle,
                        cantidad
                    }

                    return newProduct
                })

                const coloresValidos = new Set();
                const tallesValidos = new Set();

                productos.forEach((producto) => {
                    if (producto.cantidad > 0) {
                        coloresValidos.add(producto.color);
                        tallesValidos.add(producto.talle);
                    }
                });

                const productosFiltrados = productos.filter(
                    (producto) => coloresValidos.has(producto.color) && tallesValidos.has(producto.talle)
                );

                const newArticulo = {
                    numero_articulo: articulo.numero_articulo,
                    productos: productosFiltrados
                }

                return newArticulo;
            } else return null
        }).filter((articulo) => articulo !== null)

        const cantArticulos = articulosAMostrar.length;
        const cantUnidades = articulosAMostrar.reduce((total, articulo) => {
            return total + articulo.productos.reduce((articuloTotal, producto) => {
                return articuloTotal + producto.cantidad;
            }, 0);
        }, 0);

        const nombreArchivo = `${persona.nombre} Pedido N°${pedido_id}.pdf`;

        const doc = new PDFDocument({ margin: 0 });

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res);

        doc.fontSize(15).fillColor('black').font('Helvetica-Bold').text('NOTA DE PEDIDO', 30, 20);
        doc.fontSize(15).fillColor('black').text("N° " + pedido_id, 162, 20)

        const fechaDeHoy = new Date(pedido.createdAt);
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
        doc.fontSize(12).text(fechaFormateada, 452, 22);

        doc.fontSize(7).fillColor('black').text("Cliente:", 25, 43)
        doc.fontSize(10).fillColor('black').text(persona.nombre, 30, 55)
        doc.fontSize(7).fillColor('black').text("Email:", 360, 43)
        doc.fontSize(10).fillColor('black').text(persona.email, 365, 55)
        doc.fontSize(7).fillColor('black').text("Dir Entrega:", 25, 73)
        doc.fontSize(10).fillColor('black').text(persona.direccion, 30, 85)
        doc.fontSize(7).fillColor('black').text("Teléfono:", 360, 73)
        doc.fontSize(10).fillColor('black').text(persona.telefono, 365, 85)
        doc.fontSize(7).fillColor('black').text("Envío:", 25, 103)
        if(cliente)doc.fontSize(10).fillColor('black').text(cliente.forma_de_envio, 30, 115)
        doc.fontSize(7).fillColor('black').text("Cuit/Cuil:", 360, 103)
        doc.fontSize(10).fillColor('black').text(persona.cuit_cuil, 365, 115)
        doc.fontSize(7).fillColor('black').text("Ciudad:", 25, 133)
        if(cliente)doc.fontSize(10).fillColor('black').text(cliente.ciudad, 30, 145)
        doc.fontSize(7).fillColor('black').text("Código Postal:", 360, 133)
        if(cliente)doc.fontSize(10).fillColor('black').text(cliente.codigo_postal, 365, 145)
        doc.fontSize(7).fillColor('black').text("Provincia:", 25, 163)
        if(cliente)doc.fontSize(10).fillColor('black').text(cliente.provincia, 30, 175)
        doc.fontSize(7).fillColor('black').text("Tipo:", 360, 163)
        if(cliente)doc.fontSize(10).fillColor('black').text(cliente.tipo_cliente, 365, 175)
        doc.fontSize(7).fillColor('black').text("Total:", 25, 193)
        doc.fontSize(10).fillColor('black').text(cantArticulos + " Artículos  -  " + cantUnidades + " Unidades.", 30, 205)
        doc.fontSize(7).fillColor('black').text("Precio:", 360, 193)
        doc.fontSize(10).fillColor('black').text("$" + pedido.precio_total, 365, 205)

        doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
        doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
        doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
        doc.moveTo(20, 40).lineTo(592, 40).stroke('black');
        doc.moveTo(20, 40).lineTo(20, 70).stroke('black');
        doc.moveTo(20, 70).lineTo(592, 70).stroke('black');
        doc.moveTo(592, 40).lineTo(592, 70).stroke('black');
        doc.moveTo(20, 70).lineTo(20, 100).stroke('black');
        doc.moveTo(20, 70).lineTo(592, 70).stroke('black');
        doc.moveTo(592, 70).lineTo(592, 100).stroke('black');
        doc.moveTo(20, 100).lineTo(592, 100).stroke('black');
        doc.moveTo(20, 100).lineTo(20, 130).stroke('black');
        doc.moveTo(20, 100).lineTo(592, 100).stroke('black');
        doc.moveTo(592, 100).lineTo(592, 130).stroke('black');
        doc.moveTo(20, 130).lineTo(592, 130).stroke('black');
        doc.moveTo(20, 130).lineTo(20, 160).stroke('black');
        doc.moveTo(20, 130).lineTo(592, 130).stroke('black');
        doc.moveTo(592, 130).lineTo(592, 160).stroke('black');
        doc.moveTo(20, 160).lineTo(592, 160).stroke('black');
        doc.moveTo(20, 160).lineTo(20, 190).stroke('black');
        doc.moveTo(20, 160).lineTo(592, 160).stroke('black');
        doc.moveTo(592, 160).lineTo(592, 190).stroke('black');
        doc.moveTo(20, 190).lineTo(592, 190).stroke('black');
        doc.moveTo(20, 190).lineTo(20, 220).stroke('black');
        doc.moveTo(20, 190).lineTo(592, 190).stroke('black');
        doc.moveTo(592, 190).lineTo(592, 220).stroke('black');
        doc.moveTo(20, 220).lineTo(592, 220).stroke('black');
        doc.moveTo(350, 10).lineTo(350, 220).stroke('black');

        doc.fontSize(10).fillColor('black').text('PREPARÓ', 30, 643);
        doc.fontSize(10).fillColor('black').text('CONTROLÓ', 30, 693);
        doc.fontSize(10).fillColor('black').text('GUARDÓ', 30, 743);
        doc.fontSize(7).fillColor('black').text('FIRMA:', 105, 624);
        doc.fontSize(7).fillColor('black').text('FIRMA:', 105, 674);
        doc.fontSize(7).fillColor('black').text('FIRMA:', 105, 724);
        doc.fontSize(7).fillColor('black').text('ACLARACIÓN:', 270, 624);
        doc.fontSize(7).fillColor('black').text('ACLARACIÓN:', 270, 674);
        doc.fontSize(7).fillColor('black').text('ACLARACIÓN:', 270, 724);
        doc.fontSize(7).fillColor('black').text('CANTIDAD DE CAJAS:', 488, 624);

        doc.moveTo(20, 621).lineTo(20, 771).stroke('black');
        doc.moveTo(100, 621).lineTo(100, 771).stroke('black');
        doc.moveTo(265, 621).lineTo(265, 771).stroke('black');
        doc.moveTo(450, 621).lineTo(450, 771).stroke('black');
        doc.moveTo(592, 621).lineTo(592, 771).stroke('black');
        doc.moveTo(20, 621).lineTo(592, 621).stroke('black');
        doc.moveTo(20, 671).lineTo(450, 671).stroke('black');
        doc.moveTo(20, 721).lineTo(450, 721).stroke('black');
        doc.moveTo(20, 771).lineTo(592, 771).stroke('black');
        
        doc.y = 225
        let maxHeightPage = 616;
        let segunda_columna = false;
        let primer_pagina = true;

        articulosAMostrar.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.cantidad, 0);

            const talles = tallesDesordenados.sort((a, b) => {
                const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;

                const parseRango = (x) => {
                    const match = x.match(rangoRegex);
                    if (!match) return null;
                    return {
                        start: parseInt(match[1]),
                        end: parseInt(match[2]),
                        texto: x.substring(match[0].length).trim()
                    };
                };

                const rangoA = parseRango(a);
                const rangoB = parseRango(b);

                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
                } else if (rangoA && rangoB) {
                    return rangoA.start - rangoB.start;
                }
                
                const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
            });

            const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

            const table = {
                headers: [`ART. ${articulo.numero_articulo}`, ...talles],
                rows: [],
            };

            colores.forEach((color) => {
                const row = [color];

                talles.forEach((talle) => {
                    const cantidad = articulo.productos.find((producto) => producto.talle === talle && producto.color === color).cantidad
                    if (cantidad === 0) {
                        row.push(" ")
                    } else {
                        row.push(cantidad)
                    }
                })
                
                table.rows.push(row);
            });

            let tableStartX = segunda_columna ? 309 : 20;
            let tableStartY = doc.y;
            const firstCellWidth = 68;
            const cellWidth = 215/table.headers.length;
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > maxHeightPage) {   
                if(segunda_columna) {
                    doc.addPage();

                    doc.fontSize(15).fillColor('black').text('NOTA DE PEDIDO', 30, 20);
                    doc.fontSize(15).fillColor('black').text("N° " + pedido_id, 162, 20)

                    const fechaDeHoy = new Date(pedido.createdAt);
                    const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                    doc.fontSize(12).fillColor('black').text(fechaFormateada, 452, 22);

                    doc.moveTo(20, 10).lineTo(592, 10).stroke('black');
                    doc.moveTo(20, 10).lineTo(20, 40).stroke('black');
                    doc.moveTo(592, 10).lineTo(592, 40).stroke('black');
                    doc.moveTo(20, 40).lineTo(592, 40).stroke('black');
                    doc.moveTo(350, 10).lineTo(350, 40).stroke('black');

                    doc.y = 45;

                    maxHeightPage = 771;

                    tableStartX = 20;
                    tableStartY = doc.y;

                    segunda_columna = false;
                    primer_pagina = false;
                } else {
                    doc.y = primer_pagina ? 225 : 45;

                    tableStartX = 309;
                    tableStartY = doc.y;

                    segunda_columna = true;
                }  
            }

            table.headers.forEach((header, i) => {
                if (i === 0){
                    doc.rect(tableStartX, tableStartY, firstCellWidth, cellHeight).fillAndStroke('black', 'black');
                    doc.fontSize(10).fillColor("white").text(header, tableStartX + 5, tableStartY + 6);
                } else {
                    doc.rect(tableStartX + firstCellWidth + (i-1) * cellWidth, tableStartY, cellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                    doc.fontSize(10).fillColor("black").text(header.toString().toUpperCase(), tableStartX + firstCellWidth + (i-1) * cellWidth + 5, tableStartY + 6);
                }
            });

            doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY, cellWidth, cellHeight).fillAndStroke('lightgray', 'black')
            doc.fontSize(10).fillColor("black").text("Total", tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth + 5, tableStartY + 6)
            doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY + cellHeight, cellWidth, cellHeight).fillAndStroke('black', 'black');
            doc.fontSize(10).fillColor("white").text(total, tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth + 5, tableStartY + cellHeight + 6)

            table.rows.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (j === 0) {
                        doc.rect(tableStartX, tableStartY + (i + 1) * cellHeight, firstCellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } else {
                        doc.rect(tableStartX  + firstCellWidth + (j-1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('white', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + firstCellWidth + (j-1) * cellWidth + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } 
                });

                if(i > 0) {
                    doc.rect(tableStartX + firstCellWidth + (table.headers.length - 1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                }
            });

            doc.y = doc.y + 5;
        });

        doc.end();
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getRemitoNatubel = async (req, res) => {
    try {
        const pedido_id = req.params.id

        const remito = await remitoModel.findOne({ where: {pedido_id: pedido_id}} )
        if (!remito) {
            return res.status(404).json({ message: 'Remito no encontrado' });
        }

        const pedido = await pedidoModel.findByPk(pedido_id, {
            include: [
                {
                  model: productoModel,
                  through: {
                    model: productoXPedidoModel,
                    attributes: ['cantidad', 'precio_unitario'],
                  },
                },
              ],
        });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }  

        const cupon = await cuponModel.findByPk(pedido.cupon_id);

        const persona = await personaModel.findByPk(pedido.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const articulosDelPedido = Array.from(new Set(pedido.productos.map((producto) => producto.articulo_id)))

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

        const articulosAMostrar = articulos.map((articulo) => {
            if(articulosDelPedido.includes(articulo.id)) {
                let cantidad = 0;
                let precio = 0;

                for (const producto of articulo.productos) {
                    const productoCoincidencia = pedido.productos.find((productoPedido) => productoPedido.id === producto.id)
                    if(productoCoincidencia) {
                        cantidad += productoCoincidencia.productos_x_pedido.cantidad
                        precio = productoCoincidencia.productos_x_pedido.precio_unitario
                    }
                }

                const newArticulo = {
                    numero_articulo: articulo.numero_articulo,
                    descripcion: articulo.descripcion,
                    cantidad,
                    precio
                }

                return newArticulo;
            } else return null
        }).filter((articulo) => articulo !== null)

        const nombreArchivo = `${persona.nombre} Remito N°${remito.numero_remito}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(10).fillColor("black").text('RAZON SOCIAL:', 15, 15)
        doc.fontSize(10).fillColor("black").text(persona.nombre, 102, 15)
        doc.moveTo(100, 25).lineTo(300, 25).stroke('black');
        doc.fontSize(10).fillColor("black").text('CUIT:', 15, 45)
        doc.fontSize(10).fillColor("black").text(persona.cuit_cuil, 102, 45)
        doc.moveTo(100, 55).lineTo(300, 55).stroke('black');
        doc.fontSize(10).fillColor("black").text('Direc. de Entrega:', 15, 75)
        doc.fontSize(10).fillColor("black").text(persona.direccion, 102, 75)
        doc.moveTo(100, 85).lineTo(300, 85).stroke('black');

        doc.rect(380, 14, 200, 15).fillAndStroke('dimgray', 'black');
        doc.fontSize(8).fillColor("white").text('DOCUMENTO NO VALIDO COMO FACTURA', 399, 19);
        doc.fontSize(8).fillColor("black").text('Remito N°: ' + remito.numero_remito, (580 - 380 - doc.widthOfString('Remito N°: ' + remito.numero_remito)) / 2 + 380, 37);
        doc.rect(380, 49, 200, 15).fillAndStroke('dimgray', 'black');
        doc.fontSize(8).fillColor("white").text('FECHA', 416, 54);
        doc.fontSize(8).fillColor("white").text('VENCIMIENTO', 502, 54);
        const fechaPedido = new Date(pedido.createdAt);
        const fechaPedidoFormateada = `${fechaPedido.getDate()}/${fechaPedido.getMonth() + 1}/${fechaPedido.getFullYear() % 100}`;
        doc.fontSize(8).fillColor("black").text(fechaPedidoFormateada, 414, 72);
        const fechaVencimiento = new Date(fechaPedido.getTime() + remito.dias_vencimiento * 24 * 60 * 60 * 1000);
        const fechaVencimientoFormateada = `${fechaVencimiento.getDate()}/${fechaVencimiento.getMonth() + 1}/${fechaVencimiento.getFullYear() % 100}`;
        doc.fontSize(8).fillColor("black").text(fechaVencimientoFormateada, 517, 72);
        doc.moveTo(380, 14).lineTo(380, 83).stroke('black');
        doc.moveTo(580, 14).lineTo(580, 83).stroke('black');
        doc.moveTo(480, 49).lineTo(480, 83).stroke('black');
        doc.moveTo(380, 83).lineTo(580, 83).stroke('black');

        doc.moveTo(0, 105).lineTo(612, 105).stroke('black');

        doc.fontSize(10).fillColor("black").text('PEDIDO N°: ' + pedido.numero_pedido, 15, 117);

        for (let i = 0; i <= 31; i++) {
            doc.moveTo(18, 140 + 17 * i).lineTo(570, 140 + 17 * i).stroke('black');
        }
        doc.moveTo(18, 140).lineTo(18, 667).stroke('black');
        doc.moveTo(570, 140).lineTo(570, 667).stroke('black');
        doc.moveTo(68, 140).lineTo(68, 667).stroke('black');
        doc.moveTo(358, 140).lineTo(358, 667).stroke('black');
        doc.moveTo(418, 140).lineTo(418, 667).stroke('black');
        doc.moveTo(498, 140).lineTo(498, 667).stroke('black');
        doc.fontSize(10).fillColor("black").text('Articulo', 20, 145);
        doc.fontSize(10).fillColor("black").text('Descripcion', 70, 145);
        doc.fontSize(10).fillColor("black").text('Cantidad', 360, 145);
        doc.fontSize(10).fillColor("black").text('Precio', 420, 145);
        doc.fontSize(10).fillColor("black").text('Total', 500, 145);

        let articuloHeight = 163;
        let lineStartHeight = 157;
        let lineEndHeight = 174;
        const subtotal = cupon ? pedido.precio_total / (1 - cupon.descuento / 100) : pedido.precio_total;

        for (const articulo of articulosAMostrar) {
            doc.fontSize(10).fillColor("black").text(articulo.numero_articulo, 20, articuloHeight);
            const descripcion = articulo.descripcion
            if (descripcion === "") {
                doc.fontSize(10).fillColor("black").text("-", 210, articuloHeight);
            } else {
                if (doc.widthOfString(descripcion) > 285) {
                    let lengthThatFits = 0;
                    let currentWidth = 0;
                    while (currentWidth < 285 && lengthThatFits < descripcion.length) {
                        currentWidth += doc.widthOfString(descripcion[lengthThatFits]);
                        lengthThatFits++;
                    }
                    doc.fontSize(10).fillColor("black").text(descripcion.substring(0, lengthThatFits - 3) + '...', 70, articuloHeight);
                } else {
                    doc.fontSize(10).fillColor("black").text(descripcion, 70, articuloHeight);
                }
            }
            doc.fontSize(10).fillColor("black").text(articulo.cantidad, 360, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + articulo.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 420, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + (articulo.cantidad * articulo.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, articuloHeight);

            articuloHeight += 17;
            lineStartHeight += 17;
            lineEndHeight += 17;
        }
    
        doc.rect(50, 700, 122, 17).fillAndStroke('dimgray', 'black');
        doc.moveTo(50, 700).lineTo(50, 770).stroke('black');
        doc.moveTo(172, 700).lineTo(172, 770).stroke('black');
        doc.moveTo(50, 770).lineTo(172, 770).stroke('black');
        doc.fontSize(10).fillColor("white").text('CANTIDAD DE CAJAS', 60, 705);
        doc.fontSize(40).fillColor("black").text(remito.cantidad_cajas, (122 - doc.widthOfString(remito.cantidad_cajas.toString())) / 2 + 50, 730);

        doc.rect(370, 675, 100, 92).fillAndStroke('lightgrey', 'lightgrey');
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('SUBTOTAL', 375, 680);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 680);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Cupón:         ' + (cupon? cupon.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + "%", 375, 695);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (cupon? (subtotal * cupon.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + ")", 480, 695);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 375, 710);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + pedido.precio_total.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 710);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Descuento:  ' + remito.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) + "%", 375, 725);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (pedido.precio_total * remito.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) + ")", 480, 725);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 375, 740);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 740);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('IVA Insc.:       0,00%', 375, 755);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$0,00', 480, 755);
        doc.rect(370, 766, 100, 15).fillAndStroke('black', 'black');
        doc.fontSize(10).fillColor("white").font('Helvetica-Bold').text('TOTAL', 404, 770);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 770);
        doc.moveTo(370, 675).lineTo(565, 675).stroke('black');
        doc.moveTo(370, 691).lineTo(565, 691).stroke('black');
        doc.moveTo(370, 705).lineTo(565, 705).stroke('black');
        doc.moveTo(370, 721).lineTo(565, 721).stroke('black');
        doc.moveTo(370, 736).lineTo(565, 736).stroke('black');
        doc.moveTo(370, 751).lineTo(565, 751).stroke('black');
        doc.moveTo(370, 766).lineTo(565, 766).stroke('black');
        doc.moveTo(370, 781).lineTo(565, 781).stroke('black');
        doc.moveTo(370, 675).lineTo(370, 781).stroke('black');
        doc.moveTo(565, 675).lineTo(565, 781).stroke('black');
        doc.moveTo(470, 675).lineTo(470, 781).stroke('black');

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getRemitoLody = async (req, res) => {
    try {
        const pedido_id = req.params.id

        const remito = await remitoModel.findOne({ where: {pedido_id: pedido_id}} )
        if (!remito) {
            return res.status(404).json({ message: 'Remito no encontrado' });
        }

        const pedido = await pedidoModel.findByPk(pedido_id, {
            include: [
                {
                  model: productoModel,
                  through: {
                    model: productoXPedidoModel,
                    attributes: ['cantidad', 'precio_unitario'],
                  },
                },
              ],
        });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }  

        const cupon = await cuponModel.findByPk(pedido.cupon_id);

        const persona = await personaModel.findByPk(pedido.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const articulosDelPedido = Array.from(new Set(pedido.productos.map((producto) => producto.articulo_id)))

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

        const articulosAMostrar = articulos.map((articulo) => {
            if(articulosDelPedido.includes(articulo.id)) {
                let cantidad = 0;
                let precio = 0;

                for (const producto of articulo.productos) {
                    const productoCoincidencia = pedido.productos.find((productoPedido) => productoPedido.id === producto.id)
                    if(productoCoincidencia) {
                        cantidad += productoCoincidencia.productos_x_pedido.cantidad
                        precio = productoCoincidencia.productos_x_pedido.precio_unitario
                    }
                }

                const newArticulo = {
                    numero_articulo: articulo.numero_articulo,
                    descripcion: articulo.descripcion,
                    cantidad,
                    precio
                }

                return newArticulo;
            } else return null
        }).filter((articulo) => articulo !== null)

        const nombreArchivo = `${persona.nombre} Remito N°${remito.numero_remito}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(8).fillColor("black").text('DOCUMENTO NO VALIDO COMO FACTURA', 440, 5);
        doc.moveTo(430, 15).lineTo(612, 15).stroke('black');
        doc.moveTo(430, 0).lineTo(430, 15).stroke('black');

        doc.fontSize(10).fillColor("black").text('REMITO N°: ' + remito.numero_remito, 15, 10);
        doc.fontSize(10).fillColor("black").text('PEDIDO N°: ' + pedido.numero_pedido, 100, 10);
        doc.fontSize(10).fillColor("black").text('RAZON SOCIAL: ' + persona.nombre, 15, 40)
        doc.fontSize(10).fillColor("black").text('Direc. de Entrega: ' + persona.direccion, 15, 70)
        doc.fontSize(10).fillColor("black").text('CUIT: ' + persona.cuit_cuil, 15, 100)

        const subtotal = cupon ? pedido.precio_total / (1 - cupon.descuento / 100) : pedido.precio_total;

        doc.rect(350, 40, 120, 17).fillAndStroke('dimgray', 'black');
        doc.moveTo(350, 40).lineTo(350, 113).stroke('black');
        doc.moveTo(350, 113).lineTo(470, 113).stroke('black');
        doc.moveTo(470, 40).lineTo(470, 113).stroke('black');
        doc.fontSize(10).fillColor("white").text('CANTIDAD DE CAJAS', 358, 45);
        doc.fontSize(40).fillColor("black").text(remito.cantidad_cajas, (120 - doc.widthOfString(remito.cantidad_cajas.toString())) / 2 + 350, 70);

        const fechaPedido = new Date(pedido.createdAt);
        const fechaPedidoFormateada = `${fechaPedido.getDate()}/${fechaPedido.getMonth() + 1}/${fechaPedido.getFullYear() % 100}`;
        doc.fontSize(10).fillColor("black").text(`FECHA`, 525, 50);
        doc.fontSize(10).fillColor("black").text(`${fechaPedidoFormateada}`, 525, 62);
        const fechaVencimiento = new Date(fechaPedido.getTime() + remito.dias_vencimiento * 24 * 60 * 60 * 1000);
        const fechaVencimientoFormateada = `${fechaVencimiento.getDate()}/${fechaVencimiento.getMonth() + 1}/${fechaVencimiento.getFullYear() % 100}`;
        doc.fontSize(10).fillColor("black").text(`VENCIMIENTO`, 510, 80);
        doc.fontSize(10).fillColor("black").text(`${fechaVencimientoFormateada}`, 525, 92);

        doc.fontSize(10).fillColor("black").font('Helvetica').text('Articulo', 20, 145);
        doc.fontSize(10).fillColor("black").text('Descripcion', 70, 145);
        doc.fontSize(10).fillColor("black").text('Cantidad', 360, 145);
        doc.fontSize(10).fillColor("black").text('Precio', 420, 145);
        doc.fontSize(10).fillColor("black").text('Total', 500, 145);
        doc.moveTo(18, 157).lineTo(570, 157).stroke('black');
        doc.moveTo(65, 140).lineTo(65, 667).stroke('black');
        doc.moveTo(355, 140).lineTo(355, 667).stroke('black');
        doc.moveTo(415, 140).lineTo(415, 667).stroke('black');
        doc.moveTo(495, 140).lineTo(495, 667).stroke('black');

        let articuloHeight = 163;

        for (const articulo of articulosAMostrar) {
            doc.fontSize(10).fillColor("black").text(articulo.numero_articulo, 20, articuloHeight);
            const descripcion = articulo.descripcion
            if (descripcion === "") {
                doc.fontSize(10).fillColor("black").text("-", 70, articuloHeight);
            } else {
                if (doc.widthOfString(descripcion) > 285) {
                    let lengthThatFits = 0;
                    let currentWidth = 0;
                    while (currentWidth < 285 && lengthThatFits < descripcion.length) {
                        currentWidth += doc.widthOfString(descripcion[lengthThatFits]);
                        lengthThatFits++;
                    }
                    doc.fontSize(10).fillColor("black").text(descripcion.substring(0, lengthThatFits - 3) + '...', 70, articuloHeight);
                } else {
                    doc.fontSize(10).fillColor("black").text(descripcion, 70, articuloHeight);
                }
            }
            doc.fontSize(10).fillColor("black").text(articulo.cantidad, 360, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + articulo.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 420, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + (articulo.cantidad * articulo.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, articuloHeight);

            articuloHeight += 17;
        }

        let totalesHeight = 680;

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Cupón: ' + (cupon? cupon.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + "%", 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (cupon? (subtotal * cupon.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + ")", 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + pedido.precio_total.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Descuento ' + remito.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) + "%", 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (pedido.precio_total * remito.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) + ")", 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('IVA Insc. 0,00%', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$0,00', 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('TOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
}

const getRemitoMaxima = async (req, res) => {
    try {
        const pedido_id = req.params.id

        const remito = await remitoModel.findOne({ where: {pedido_id: pedido_id}} )
        if (!remito) {
            return res.status(404).json({ message: 'Remito no encontrado' });
        }

        const pedido = await pedidoModel.findByPk(pedido_id, {
            include: [
                {
                  model: productoModel,
                  through: {
                    model: productoXPedidoModel,
                    attributes: ['cantidad', 'precio_unitario'],
                  },
                },
              ],
        });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }  

        const cupon = await cuponModel.findByPk(pedido.cupon_id);

        const persona = await personaModel.findByPk(pedido.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const articulosDelPedido = Array.from(new Set(pedido.productos.map((producto) => producto.articulo_id)))

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

        const articulosAMostrar = articulos.map((articulo) => {
            if(articulosDelPedido.includes(articulo.id)) {
                let cantidad = 0;
                let precio = 0;

                for (const producto of articulo.productos) {
                    const productoCoincidencia = pedido.productos.find((productoPedido) => productoPedido.id === producto.id)
                    if(productoCoincidencia) {
                        cantidad += productoCoincidencia.productos_x_pedido.cantidad
                        precio = productoCoincidencia.productos_x_pedido.precio_unitario
                    }
                }

                const newArticulo = {
                    numero_articulo: articulo.numero_articulo,
                    descripcion: articulo.descripcion,
                    cantidad,
                    precio
                }

                return newArticulo;
            } else return null
        }).filter((articulo) => articulo !== null)

        const nombreArchivo = `${persona.nombre} Remito N°${remito.numero_remito}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(8).fillColor("black").text('DOCUMENTO NO VALIDO COMO FACTURA', 15, 11);
        doc.fontSize(10).fillColor("black").text('REMITO N°: ' + remito.numero_remito, 200, 10);
        doc.fontSize(10).fillColor("black").text('PEDIDO N°: ' + pedido.numero_pedido, 285, 10);
        const fechaPedido = new Date(pedido.createdAt);
        const fechaPedidoFormateada = `${fechaPedido.getDate()}/${fechaPedido.getMonth() + 1}/${fechaPedido.getFullYear() % 100}`;
        doc.fontSize(10).fillColor("black").text(`FECHA: ${fechaPedidoFormateada}`, 380, 10);
        const fechaVencimiento = new Date(fechaPedido.getTime() + remito.dias_vencimiento * 24 * 60 * 60 * 1000);
        const fechaVencimientoFormateada = `${fechaVencimiento.getDate()}/${fechaVencimiento.getMonth() + 1}/${fechaVencimiento.getFullYear() % 100}`;
        doc.fontSize(10).fillColor("black").text(`VENCIMIENTO: ${fechaVencimientoFormateada}`, 470, 10);

        doc.moveTo(0, 25).lineTo(612, 25).stroke('black');

        doc.fontSize(10).fillColor("black").text('RAZON SOCIAL:', 15, 40)
        doc.fontSize(10).fillColor("black").text(persona.nombre, 102, 40)
        doc.moveTo(100, 50).lineTo(300, 50).stroke('black');
        doc.fontSize(10).fillColor("black").text('CUIT:', 15, 70)
        doc.fontSize(10).fillColor("black").text(persona.cuit_cuil, 102, 70)
        doc.moveTo(100, 80).lineTo(300, 80).stroke('black');
        doc.fontSize(10).fillColor("black").text('Direc. de Entrega:', 15, 100)
        doc.fontSize(10).fillColor("black").text(persona.direccion, 102, 100)
        doc.moveTo(100, 110).lineTo(300, 110).stroke('black');

        const subtotal = cupon ? pedido.precio_total / (1 - cupon.descuento / 100) : pedido.precio_total;

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text(`CANTIDAD DE CAJAS: ${remito.cantidad_cajas}`, 380, 73);

        doc.moveTo(0, 130).lineTo(612, 130).stroke('black');

        doc.fontSize(10).fillColor("black").font('Helvetica').text('Articulo', 20, 145);
        doc.fontSize(10).fillColor("black").text('Descripcion', 70, 145);
        doc.fontSize(10).fillColor("black").text('Cantidad', 360, 145);
        doc.fontSize(10).fillColor("black").text('Precio', 420, 145);
        doc.fontSize(10).fillColor("black").text('Total', 500, 145);
        doc.moveTo(18, 157).lineTo(570, 157).stroke('black');

        let articuloHeight = 163;

        for (const articulo of articulosAMostrar) {
            doc.fontSize(10).fillColor("black").text(articulo.numero_articulo, 20, articuloHeight);
            const descripcion = articulo.descripcion
            if (descripcion === "") {
                doc.fontSize(10).fillColor("black").text("-", 70, articuloHeight);
            } else {
                if (doc.widthOfString(descripcion) > 285) {
                    let lengthThatFits = 0;
                    let currentWidth = 0;
                    while (currentWidth < 285 && lengthThatFits < descripcion.length) {
                        currentWidth += doc.widthOfString(descripcion[lengthThatFits]);
                        lengthThatFits++;
                    }
                    doc.fontSize(10).fillColor("black").text(descripcion.substring(0, lengthThatFits - 3) + '...', 70, articuloHeight);
                } else {
                    doc.fontSize(10).fillColor("black").text(descripcion, 70, articuloHeight);
                }
            }
            doc.fontSize(10).fillColor("black").text(articulo.cantidad, 360, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + articulo.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 420, articuloHeight);
            doc.fontSize(10).fillColor("black").text('$' + (articulo.cantidad * articulo.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, articuloHeight);

            articuloHeight += 17;
        }

        let totalesHeight = 680;

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Cupón: ' + (cupon? cupon.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + "%", 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (cupon? (subtotal * cupon.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00") + ")", 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + pedido.precio_total.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Descuento ' + remito.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) + "%", 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (pedido.precio_total * remito.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) + ")", 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica').text('IVA Insc. 0,00%', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$0,00', 500, totalesHeight);
        totalesHeight+=15;
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('TOTAL', 400, totalesHeight);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + (pedido.precio_total - (pedido.precio_total * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 500, totalesHeight);

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
}

const getCuentaCorriente = async (req, res) => {
    try {
        const persona = await personaModel.findByPk(req.params.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const pagos = await pagoModel.findAll({
            where: {
                persona_id: persona.id,
                flag_imputado: false
            },
            order: [['fecha', 'ASC']]
        });

        const facturasInit = await facturaModel.findAll({
            where: {
                flag_imputada: false,
                flag_cancelada: false,
                persona_id: persona.id
            },
            order: [['pedido_id', 'ASC']]
        });

        const pedidoIds = facturasInit.map(f => f.pedido_id);

        const remitos = await remitoModel.findAll({
            where: {
                pedido_id: pedidoIds
            }
        });

        const remitosMap = new Map();
        remitos.forEach(remito => {
            remitosMap.set(remito.pedido_id, remito);
        });

        const facturasConRemitos = facturasInit.map(factura => {
            const remito = remitosMap.get(factura.pedido_id);
            const descuento = remito?.descuento || 0;

            return {
                numero_pedido: factura.numero_factura? factura.numero_factura : factura.pedido_id,
                numero_remito: remito?.numero_remito || null,
                monto: factura.monto,
                descuento: descuento,
                fecha: factura.fecha
            };  
        });

        const facturasPorMes = agruparPorMes(facturasConRemitos)

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;

        const nombreArchivo = `Cuenta Corriente de ${persona.nombre} ${fechaFormateada.replace(/\//g, '-')}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(20).fillColor("black").font('Helvetica-Bold').text('Reporte de Cuenta (Actual)', 0, 15, {
            align: 'center',
            width: doc.page.width
        });

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cliente:", 15, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.nombre, 65, 50)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Fecha:", 15, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(fechaFormateada, 65, 70)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Dirección:", 321, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.direccion, 385, 50)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cuit/Cuil:", 321, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.cuit_cuil, 385, 70)   

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cobranzas A/C", 15, 100)

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número", 15, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Fecha", 90, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Sobrante", 160, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Total", 230, 120)

        let primerPago = true
        let y = 130

        pagos.forEach(pago => {
            if(y + 50 > 792) {
                doc.moveTo(15, y - 3).lineTo(300, y - 3).stroke('black');

                doc.addPage()
                primerPago = true
                doc.y = 45;
                y = 45;
            }

            if(!primerPago) doc.moveTo(15, y - 3).lineTo(300, y - 3).stroke('black');
            doc.fontSize(10).fillColor("black").font('Helvetica').text(pago.id, 15, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(formatearFechaPago(pago.fecha), 80, y) 
            doc.fontSize(10).fillColor("black").font('Helvetica').text(pago.pago_padre_id === null ? "NO" : "SI", 175, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text("$" + formatearMonto(pago.monto), 230, y) 

            primerPago = false;
            y += 12;
        })

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Cobranzas A/C: Acreedor,", 70, y)
        const totalMontoPagos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoPagos), 230, y)

        y += 25

        Object.entries(facturasPorMes).map(([mesAnio, facturas]) => {
            if(y + 160 > 792) {
                doc.addPage()
                doc.y = 45;
                y = 45;
            }

            doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text(obtenerNombreMes(mesAnio), 15, y)

            y += 20

            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número Pedido", 15, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número Remito", 120, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Fecha", 230, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Total", 290, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Descuento", 360, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("A Pagar", 440, y)

            let primeraFactura = true
            y += 10

            facturas.forEach(factura => {
                if(y + 110 > 792) {
                    doc.moveTo(15, y - 3).lineTo(510, y - 3).stroke('black');

                    doc.addPage()
                    primeraFactura = true
                    doc.y = 45;
                    y = 45;
                }

                if(!primeraFactura) doc.moveTo(15, y - 3).lineTo(510, y - 3).stroke('black'); 
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_pedido, 15, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? factura.numero_remito : "-", 120, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(formatearFechaPago(factura.fecha), 220, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? "$" + formatearMonto(factura.monto / (1 - factura.descuento / 100)) : "$" + formatearMonto(factura.monto), 290, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.descuento + "%", 380, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text("$" + formatearMonto(factura.monto), 440, y)

                primeraFactura = false;
                y += 12
            })

            const texto = "Saldo " + obtenerNombreMes(mesAnio) + ": Deudor,";
            const textWidth = doc.widthOfString(texto);
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text(texto, 425 - textWidth, y)
            const totalMontoFacturasDelMes = facturas.reduce((sum, pago) => sum + pago.monto, 0);
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoFacturasDelMes), 440, y)

            y += 25
        })

        const totalMontoFacturas = facturasInit.reduce((sum, pago) => sum + pago.monto, 0);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo de Todos los Meses: Deudor,", 265, y)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoFacturas), 440, y)

        y += 20

        const totalMonto = totalMontoFacturas - totalMontoPagos
        if (totalMonto >= 0) {
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Total De la Cuenta: Deudor,", 275, y)
        } else {
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Total De la Cuenta: Acreedor,", 265, y)
        }
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(Math.abs(totalMonto)), 440, y)

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al generar pdf' });
    }
};

const getHistorial = async (req, res) => {
    try {
        const persona = await personaModel.findByPk(req.params.persona_id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }

        const pagos = await pagoModel.findAll({
            where: {
                persona_id: persona.id,
                pago_padre_id: null
            },
            order: [['fecha', 'ASC']]
        });

        const facturasInit = await facturaModel.findAll({
            where: {
                flag_cancelada: false,
                persona_id: persona.id
            },
            order: [['pedido_id', 'ASC']]
        });

        const pedidoIds = facturasInit.map(f => f.pedido_id);

        const remitos = await remitoModel.findAll({
            where: {
                pedido_id: pedidoIds
            }
        });

        const remitosMap = new Map();
        remitos.forEach(remito => {
            remitosMap.set(remito.pedido_id, remito);
        });

        const facturasConRemitos = facturasInit.map(factura => {
            const remito = remitosMap.get(factura.pedido_id);
            const descuento = remito?.descuento || 0;

            return {
                numero_pedido: factura.numero_factura? factura.numero_factura : factura.pedido_id,
                numero_remito: remito?.numero_remito || null,
                monto: factura.monto,
                descuento: descuento,
                fecha: factura.fecha
            };  
        });

        const facturasPorMes = agruparPorMes(facturasConRemitos)

        const nombreArchivo = `Historial de cuenta de ${persona.nombre}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(20).fillColor("black").font('Helvetica-Bold').text('Reporte de Cuenta (Histórico)', 0, 15, {
            align: 'center',
            width: doc.page.width
        });

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cliente:", 15, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.nombre, 65, 50)

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Fecha:", 15, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(fechaFormateada, 65, 70)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Dirección:", 321, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.direccion, 385, 50)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cuit/Cuil:", 321, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.cuit_cuil, 385, 70)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cobranzas A/C", 15, 100)

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número", 15, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Fecha", 90, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Total", 160, 120)

        let primerPago = true
        let y = 130

        pagos.forEach(pago => {
            if(y + 50 > 792) {
                doc.moveTo(15, y - 3).lineTo(230, y - 3).stroke('black');

                doc.addPage()
                primerPago = true
                doc.y = 45;
                y = 45;
            }

            if(!primerPago) doc.moveTo(15, y - 3).lineTo(230, y - 3).stroke('black');
            doc.fontSize(10).fillColor("black").font('Helvetica').text(pago.id, 15, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(formatearFechaPago(pago.fecha), 80, y) 
            doc.fontSize(10).fillColor("black").font('Helvetica').text("$" + formatearMonto(pago.monto), 160, y) 

            primerPago = false;
            y += 12;
        })

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Cobranzas A/C: Acreedor,", 15, y)
        const totalMontoPagos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoPagos), 175, y)

        y += 25

        Object.entries(facturasPorMes).map(([mesAnio, facturas]) => {
            if(y + 160 > 792) {
                doc.addPage()
                doc.y = 45;
                y = 45;
            } 

            doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text(obtenerNombreMes(mesAnio), 15, y)

            y += 20

            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número Pedido", 15, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número Remito", 120, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Fecha", 230, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Total", 290, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Descuento", 360, y)
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("A Pagar", 440, y)

            let primeraFactura = true
            y += 10

            facturas.forEach(factura => {
                if(y + 110 > 792) {
                    doc.moveTo(15, y - 3).lineTo(510, y - 3).stroke('black');
    
                    doc.addPage()
                    primeraFactura = true
                    doc.y = 45;
                    y = 45;
                }
    
                if(!primeraFactura) doc.moveTo(15, y - 3).lineTo(510, y - 3).stroke('black'); 
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_pedido, 15, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? factura.numero_remito : "-", 120, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(formatearFechaPago(factura.fecha), 220, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? "$" +  formatearMonto(factura.monto / (1 - factura.descuento / 100)) : "$" + formatearMonto(factura.monto), 290, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.descuento + "%", 380, y)
                doc.fontSize(10).fillColor("black").font('Helvetica').text("$" + formatearMonto(factura.monto), 440, y)
    
                primeraFactura = false;
                y += 12
            })

            const texto = "Saldo " + obtenerNombreMes(mesAnio) + ": Deudor,";
            const textWidth = doc.widthOfString(texto);
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text(texto, 425 - textWidth, y)
            const totalMontoFacturasDelMes = facturas.reduce((sum, pago) => sum + pago.monto, 0);
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoFacturasDelMes), 440, y)

            y += 25
        })

        const totalMontoFacturas = facturasInit.reduce((sum, pago) => sum + pago.monto, 0);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo de Todos los Meses: Deudor,", 265, y)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(totalMontoFacturas), 440, y)

        y += 20

        const totalMonto = totalMontoFacturas - totalMontoPagos
        if (totalMonto >= 0) {
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Total De la Cuenta: Deudor,", 275, y)
        } else {
            doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Saldo Total De la Cuenta: Acreedor,", 265, y)
        }
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("$" + formatearMonto(Math.abs(totalMonto)), 440, y)

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al generar pdf' });
    }
};

const agruparPorMes = (facturas) => {
    const facturasAgrupadas = {};

    facturas.forEach((factura) => {
        const fecha = new Date(factura.fecha);

        const mesAño = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`;

        if (!facturasAgrupadas[mesAño]) {
            facturasAgrupadas[mesAño] = [];
        }

        facturasAgrupadas[mesAño].push(factura);
    });

    return facturasAgrupadas;
};

const obtenerNombreMes = (mesAnyo) => {
    const [mes, anyo] = mesAnyo.split("-");
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${meses[parseInt(mes) - 1]} ${anyo}`;
};

const getImputacion = async (req, res) => {
    try {
        const filasImputacion = await imputacionModel.findAll({
            where: {
                numero_imputacion: req.params.numero_imputacion
            }
        });

        const pagosUnicosID = Array.from(new Set(filasImputacion.map(filaImputacion => filaImputacion.pago_id)));
        
        const pagos = await pagoModel.findAll({
            where: {
                id: pagosUnicosID
            }
        })

        const facturasUnicasID = Array.from(new Set(filasImputacion.map(filaImputacion => filaImputacion.factura_id)));

        const facturas = await facturaModel.findAll({
            where: {
                id: facturasUnicasID
            }
        })

        const pedidoIds = facturas.map(f => f.pedido_id);

        const remitos = await remitoModel.findAll({
            where: {
                pedido_id: pedidoIds
            }
        });

        const remitosMap = new Map();
        remitos.forEach(remito => {
            remitosMap.set(remito.pedido_id, remito);
        });

        const facturasConRemitos = facturas.map(factura => {
            const remito = remitosMap.get(factura.pedido_id);
            const descuento = remito?.descuento || 0;

            return {
                numero_pedido: factura.numero_factura? factura.numero_factura : factura.pedido_id,
                numero_remito: remito?.numero_remito || null,
                monto: factura.monto,
                descuento: descuento,
                fecha: factura.fecha
            };  
        }).sort((a, b) => a.numero_pedido - b.numero_pedido);

        const persona = await personaModel.findByPk(facturas[0]?.persona_id);

        const totalMontoFacturas = facturas.reduce((sum, pago) => sum + pago.monto, 0);
        const totalMontoPagos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
        const totalMontoSobrante = totalMontoPagos - totalMontoFacturas

        const nombreArchivo = `Cobranza N°${req.params.numero_imputacion} ${persona.nombre}.pdf`

        const doc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${nombreArchivo}"`,
        });

        doc.pipe(res)

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(20).fillColor("black").font('Helvetica-Bold').text('Cobranza N°' + req.params.numero_imputacion, 0, 15, {
            align: 'center',
            width: doc.page.width
        });

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Cliente:", 15, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(persona.nombre, 65, 50)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Fecha:", 15, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text(formatearFechaImputacion(filasImputacion[0]?.createdAt), 65, 70)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Total Facturas:", 321, 50)
        doc.fontSize(12).fillColor("black").font('Helvetica').text("$" + formatearMonto(totalMontoFacturas), 450, 50)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Total Cobranzas A/C:", 321, 70)
        doc.fontSize(12).fillColor("black").font('Helvetica').text("$" + formatearMonto(totalMontoPagos), 450, 70)

        doc.fontSize(12).fillColor("black").font('Helvetica-Bold').text("Monto Sobrante:", 321, 90)
        doc.fontSize(12).fillColor("black").font('Helvetica').text("$" + formatearMonto(totalMontoSobrante), 450, 90)

        doc.fontSize(8).fillColor("black").font('Helvetica').text("Se cancelan los siguientes comprobantes:", 15, 100)

        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Tipo", 15, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Número", 65, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Remito", 115, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Fecha", 170, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Total", 220, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("Descuento", 300, 120)
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text("A Pagar", 370, 120)

        let primerRenglon = true
        let y = 130

        facturasConRemitos.forEach(factura => {
            if(y + 20 > 792) {
                doc.moveTo(15, y - 3).lineTo(440, y - 3).stroke('black');

                doc.addPage()
                primerRenglon = true
                doc.y = 45
                y = 45
            }

            if(!primerRenglon) doc.moveTo(15, y - 3).lineTo(440, y - 3).stroke('black');
            doc.fontSize(10).fillColor("black").font('Helvetica').text("FAC", 15, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_pedido, 65, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? factura.numero_remito : "-", 115, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(formatearFechaPago(factura.fecha), 160, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.numero_remito? "$" +  formatearMonto(factura.monto / (1 - factura.descuento / 100)) : "$" + formatearMonto(factura.monto), 220, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text(factura.descuento + "%", 300, y)
            doc.fontSize(10).fillColor("black").font('Helvetica').text("$" + formatearMonto(factura.monto), 370, y)

            primerRenglon = false
            y += 12
        })

        pagos.forEach(pago => {
            if(y + 20 > 792) {
                doc.moveTo(15, y - 3).lineTo(440, y - 3).stroke('black');

                doc.addPage()
                primerRenglon = true
                doc.y = 45
                y = 45
            }

            if(!primerRenglon) doc.moveTo(15, y - 3).lineTo(440, y - 3).stroke('black');
            doc.fontSize(10).fillColor("red").font('Helvetica').text("COB A/C", 15, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text(pago.id, 65, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text("-", 115, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text(formatearFechaPago(pago.fecha), 160, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text("-", 220, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text("-", 300, y)
            doc.fontSize(10).fillColor("red").font('Helvetica').text("$" + formatearMonto(pago.monto), 370, y)

            y += 12
        })

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al generar pdf' });
    }
};

const formatearFechaPago = (fechaDateOnly) => {
    const [anio, mes, dia] = fechaDateOnly.split('-');
    
    return `${dia}/${mes}/${anio}`;
};

const formatearFechaImputacion = (fechaDateTime) => {
    const fecha = new Date(fechaDateTime);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
};

const formatearMonto = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toFixed(2).toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};

module.exports = {getStockAdmin, getStockCliente, getNotaPedido, getRemitoNatubel, getRemitoLody, getRemitoMaxima, getCuentaCorriente, getHistorial, getImputacion};