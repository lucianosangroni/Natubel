const { articuloModel, productoModel, pedidoModel, personaModel, productoXPedidoModel } = require("../modelos");
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
            const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.stock, 0);

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

            if(doc.y + (table.rows.length + 1) * cellHeight > 740) {
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
            const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

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

            if(doc.y + (table.rows.length + 1) * cellHeight > 740) {
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

        let maxHeightPage = 550;
        let footerHecho = false;

        articulosAMostrar.forEach((articulo) => {
            const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const total = articulo.productos.reduce((sum, producto) => sum + producto.cantidad, 0);

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

                maxHeightPage = 740;

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

const getRemito = (req, res) => {
    // Lógica para el PDF del Remito
};

module.exports = {getStockAdmin, getStockCliente, getNotaPedido, getRemito};