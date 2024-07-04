const { articuloModel, productoModel, pedidoModel, personaModel, productoXPedidoModel, remitoModel } = require("../modelos");
const PDFDocument = require('pdfkit');
const { sequelize } = require("../config/dbConnect");

const getStockAdmin = async (req, res) => {
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

        const articulosData = articulos.map((articulo) => {
            const articuloData = articulo.dataValues;
        
            if (articuloData.productos) {
                articuloData.productos = articuloData.productos.map((producto) => producto.dataValues);
            }
        
            return articuloData;
        });

        const doc = new PDFDocument();

        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=stock.pdf`,
        });

        doc.on('data', (data) => {stream.write(data)})
        doc.on('end', () => {stream.end()})

        doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

        doc.fontSize(20).text('Natubel Stock', 50, 57);

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
        doc.fontSize(15).text(fechaFormateada, 480, 60);

        doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
        doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
        doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
        doc.moveTo(45, 85).lineTo(567, 85).stroke('black');

        doc.y = 125;

        articulosData.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.stock, 0);

            const talles = tallesDesordenados.sort((a, b) => {
                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
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

            const tableStartX = 50;
            let tableStartY = doc.y;
            const cellWidth = 40;
            const firstCellWidth = 68;
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > 720) {
                doc.addPage();

                doc.fontSize(20).text('Natubel Stock', 50, 57);

                const fechaDeHoy = new Date();
                const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                doc.fontSize(15).text(fechaFormateada, 480, 60);

                doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
                doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
                doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
                doc.moveTo(45, 85).lineTo(567, 85).stroke('black');

                doc.y = 125;

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

            doc.moveDown();
        });

        doc.end();
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getStockCliente = async (req, res) => {
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

        const articulosData = articulos.map((articulo) => {
            const articuloData = articulo.dataValues;
        
            if (articuloData.productos) {
                articuloData.productos = articuloData.productos.map((producto) => producto.dataValues);
            }
        
            return articuloData;
        });

        const doc = new PDFDocument();

        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=stock.pdf`,
        });

        doc.on('data', (data) => {stream.write(data)})
        doc.on('end', () => {stream.end()})

        doc.fontSize(20).text('Natubel Stock', 50, 57);

        const fechaDeHoy = new Date();
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
        doc.fontSize(15).text(fechaFormateada, 480, 60);

        doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
        doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
        doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
        doc.moveTo(45, 85).lineTo(567, 85).stroke('black');

        doc.y = 125;

        articulosData.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

            const talles = tallesDesordenados.sort((a, b) => {
                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
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

            const tableStartX = 50;
            let tableStartY = doc.y;
            const cellWidth = 40;
            const firstCellWidth = 68;
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > 720) {
                doc.addPage();

                doc.fontSize(20).text('Natubel Stock', 50, 57);

                const fechaDeHoy = new Date();
                const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                doc.fontSize(15).text(fechaFormateada, 480, 60);

                doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
                doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
                doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
                doc.moveTo(45, 85).lineTo(567, 85).stroke('black');

                doc.y = 125;

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

            table.rows.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (j === 0) {
                        doc.rect(tableStartX, tableStartY + (i + 1) * cellHeight, firstCellWidth, cellHeight).fillAndStroke('lightgray', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + 5, tableStartY + (i + 1) * cellHeight + 6);
                    } else {
                        doc.rect(tableStartX  + firstCellWidth + (j-1) * cellWidth, tableStartY + (i + 1) * cellHeight, cellWidth, cellHeight).fillAndStroke('white', 'black');
                        doc.fontSize(10).fillColor("black").text(cell, tableStartX + firstCellWidth + (j-1) * cellWidth + 16, tableStartY + (i + 1) * cellHeight + 6);
                    } 
                });
            });

            doc.moveDown();
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

                const newArticulo = {
                    numero_articulo: articulo.numero_articulo,
                    productos
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

        const doc = new PDFDocument();

        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=nota-pedido.pdf`,
        });

        doc.on('data', (data) => {stream.write(data)})
        doc.on('end', () => {stream.end()})

        doc.fontSize(20).fillColor('black').text('NOTA DE PEDIDO', 50, 57);
        doc.fontSize(20).fillColor('black').text("N° " + pedido_id, 250, 57)

        const fechaDeHoy = new Date(pedido.createdAt);
        const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
        doc.fontSize(15).text(fechaFormateada, 440, 60);

        doc.fontSize(9).fillColor('black').text("Cliente:", 50, 90)
        doc.fontSize(17).fillColor('black').text(persona.nombre, 100, 107)
        doc.fontSize(9).fillColor('black').text("Dir Entrega:", 360, 90)
        doc.fontSize(17).fillColor('black').text(persona.direccion, 400, 107)
        doc.rect(45, 145, 522, 20).fillAndStroke('lightgray', 'black');
        doc.fontSize(10).fillColor('black').text(cantArticulos + " Artículos, " + cantUnidades + " Unidades.", 245, 152)

        doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
        doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
        doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
        doc.moveTo(45, 85).lineTo(567, 85).stroke('black');
        doc.moveTo(45, 85).lineTo(45, 145).stroke('black');
        doc.moveTo(45, 145).lineTo(567, 145).stroke('black');
        doc.moveTo(567, 85).lineTo(567, 145).stroke('black');
        doc.moveTo(350,45).lineTo(350,145).stroke('black');

        doc.y = 205;

        let maxHeightPage = 540;
        let footerHecho = false;

        articulosAMostrar.forEach((articulo) => {
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.cantidad, 0);

            const talles = tallesDesordenados.sort((a, b) => {
                if (!isNaN(a) && !isNaN(b)) {
                    return a - b;
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

            const tableStartX = 50;
            let tableStartY = doc.y;
            const cellWidth = 40;
            const firstCellWidth = 68;
            const cellHeight = 20;

            if(doc.y + (table.rows.length + 1) * cellHeight > maxHeightPage) {
                if(!footerHecho) {
                    doc.fontSize(10).fillColor('black').text('PREPARÓ', 52, 558);
                    doc.fontSize(10).fillColor('black').text('CONTROLÓ', 50, 633);
                    doc.fontSize(10).fillColor('black').text('GUARDÓ', 52, 708);
                    doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 555);
                    doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 630);
                    doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 705);
                    doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 555);
                    doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 630);
                    doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 705);
                    doc.fontSize(7).fillColor('black').text('CANTIDAD DE CAJAS:', 466, 555);

                    doc.moveTo(115, 550).lineTo(115, 775).stroke('black');
                    doc.moveTo(280, 550).lineTo(280, 775).stroke('black');
                    doc.moveTo(445, 550).lineTo(445, 775).stroke('black');
                    doc.moveTo(45, 550).lineTo(567, 550).stroke('black');
                    doc.moveTo(45, 550).lineTo(45, 775).stroke('black');
                    doc.moveTo(45, 625).lineTo(445, 625).stroke('black');
                    doc.moveTo(45, 700).lineTo(445, 700).stroke('black');
                    doc.moveTo(567, 550).lineTo(567, 775).stroke('black');
                    doc.moveTo(45, 775).lineTo(567, 775).stroke('black');

                    footerHecho = true;
                }
                
                doc.addPage();

                doc.fontSize(20).fillColor('black').text('NOTA DE PEDIDO', 50, 57);
                doc.fontSize(20).fillColor('black').text("N° " + pedido_id, 250, 57)

                const fechaDeHoy = new Date(pedido.createdAt);
                const fechaFormateada = `${fechaDeHoy.getDate()}/${fechaDeHoy.getMonth() + 1}/${fechaDeHoy.getFullYear() % 100}`;
                doc.fontSize(15).fillColor('black').text(fechaFormateada, 440, 60);

                doc.fontSize(9).fillColor('black').text("Cliente:", 50, 90)
                doc.fontSize(17).fillColor('black').text(persona.nombre, 100, 107)
                doc.fontSize(9).fillColor('black').text("Dir Entrega:", 360, 90)
                doc.fontSize(17).fillColor('black').text(persona.direccion, 400, 107)
                doc.rect(45, 145, 522, 20).fillAndStroke('lightgray', 'black');
                doc.fontSize(10).fillColor('black').text(cantArticulos + " Artículos, " + cantUnidades + " Unidades.", 245, 152)

                doc.moveTo(45, 45).lineTo(567, 45).stroke('black');
                doc.moveTo(45, 45).lineTo(45, 85).stroke('black');
                doc.moveTo(567, 45).lineTo(567, 85).stroke('black');
                doc.moveTo(45, 85).lineTo(567, 85).stroke('black');
                doc.moveTo(45, 85).lineTo(45, 145).stroke('black');
                doc.moveTo(45, 145).lineTo(567, 145).stroke('black');
                doc.moveTo(567, 85).lineTo(567, 145).stroke('black');
                doc.moveTo(350,45).lineTo(350,145).stroke('black');

                doc.y = 205;

                maxHeightPage = 720;

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

            doc.moveDown();
        });

        if(!footerHecho) {
            doc.fontSize(10).fillColor('black').text('PREPARÓ', 52, 558);
            doc.fontSize(10).fillColor('black').text('CONTROLÓ', 50, 633);
            doc.fontSize(10).fillColor('black').text('GUARDÓ', 52, 708);
            doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 555);
            doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 630);
            doc.fontSize(9).fillColor('black').text('FIRMA:', 120, 705);
            doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 555);
            doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 630);
            doc.fontSize(9).fillColor('black').text('ACLARACIÓN:', 285, 705);
            doc.fontSize(7).fillColor('black').text('CANTIDAD DE CAJAS:', 466, 555);

            doc.moveTo(115, 550).lineTo(115, 775).stroke('black');
            doc.moveTo(280, 550).lineTo(280, 775).stroke('black');
            doc.moveTo(445, 550).lineTo(445, 775).stroke('black');
            doc.moveTo(45, 550).lineTo(567, 550).stroke('black');
            doc.moveTo(45, 550).lineTo(45, 775).stroke('black');
            doc.moveTo(45, 625).lineTo(445, 625).stroke('black');
            doc.moveTo(45, 700).lineTo(445, 700).stroke('black');
            doc.moveTo(567, 550).lineTo(567, 775).stroke('black');
            doc.moveTo(45, 775).lineTo(567, 775).stroke('black');
        }

        doc.end();
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

const getRemito = async (req, res) => {
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

        const doc = new PDFDocument();

        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=remito.pdf`,
        });

        doc.on('data', (data) => {stream.write(data)})
        doc.on('end', () => {stream.end()})

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

        for (let i = 0; i <= 32; i++) {
            doc.moveTo(18, 140 + 17 * i).lineTo(570, 140 + 17 * i).stroke('black');
        }
        doc.moveTo(18, 140).lineTo(18, 684).stroke('black');
        doc.moveTo(570, 140).lineTo(570, 684).stroke('black');
        doc.moveTo(68, 140).lineTo(68, 684).stroke('black');
        doc.moveTo(358, 140).lineTo(358, 684).stroke('black');
        doc.moveTo(418, 140).lineTo(418, 684).stroke('black');
        doc.moveTo(498, 140).lineTo(498, 684).stroke('black');
        doc.fontSize(10).fillColor("black").text('Articulo', 20, 145);
        doc.fontSize(10).fillColor("black").text('Descripcion', 70, 145);
        doc.fontSize(10).fillColor("black").text('Cantidad', 360, 145);
        doc.fontSize(10).fillColor("black").text('Precio', 420, 145);
        doc.fontSize(10).fillColor("black").text('Total', 500, 145);

        let articuloHeight = 163;
        let lineStartHeight = 157;
        let lineEndHeight = 174;
        let subtotal = 0;

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

            subtotal += articulo.cantidad * articulo.precio
        }
    
        doc.rect(50, 700, 122, 17).fillAndStroke('dimgray', 'black');
        doc.moveTo(50, 700).lineTo(50, 770).stroke('black');
        doc.moveTo(172, 700).lineTo(172, 770).stroke('black');
        doc.moveTo(50, 770).lineTo(172, 770).stroke('black');
        doc.fontSize(10).fillColor("white").text('CANTIDAD DE CAJAS', 60, 705);
        doc.fontSize(40).fillColor("black").text(remito.cantidad_cajas, (122 - doc.widthOfString(remito.cantidad_cajas.toString())) / 2 + 50, 730);

        doc.rect(370, 695, 100, 62).fillAndStroke('lightgrey', 'lightgrey');
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('SUBTOTAL', 375, 700);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 700);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('Descuento:  ' + remito.descuento.toLocaleString('es-AR', { minimumFractionDigits: 2 }) + "%", 375, 715);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('($' + (subtotal * remito.descuento / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 }) + ")", 480, 715);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('SUBTOTAL', 375, 730);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$' + (subtotal - (subtotal * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 730);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('IVA Insc.:       0.00%', 375, 745);
        doc.fontSize(10).fillColor("black").font('Helvetica').text('$0,00', 480, 745);
        doc.rect(370, 756, 100, 15).fillAndStroke('black', 'black');
        doc.fontSize(10).fillColor("white").font('Helvetica-Bold').text('TOTAL', 404, 760);
        doc.fontSize(10).fillColor("black").font('Helvetica-Bold').text('$' + (subtotal - (subtotal * remito.descuento / 100)).toLocaleString('es-AR', { minimumFractionDigits: 2 }), 480, 760);
        doc.moveTo(370, 695).lineTo(565, 695).stroke('black');
        doc.moveTo(370, 711).lineTo(565, 711).stroke('black');
        doc.moveTo(370, 726).lineTo(565, 726).stroke('black');
        doc.moveTo(370, 741).lineTo(565, 741).stroke('black');
        doc.moveTo(370, 756).lineTo(565, 756).stroke('black');
        doc.moveTo(370, 771).lineTo(565, 771).stroke('black');
        doc.moveTo(370, 695).lineTo(370, 771).stroke('black');
        doc.moveTo(565, 695).lineTo(565, 771).stroke('black');
        doc.moveTo(470, 695).lineTo(470, 771).stroke('black');

        doc.end();
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error al buscar los articulos' });
    }
};

module.exports = {getStockAdmin, getStockCliente, getNotaPedido, getRemito};