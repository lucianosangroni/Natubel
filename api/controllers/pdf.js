const { articuloModel, productoModel } = require("../modelos");
const PDFDocument = require('pdfkit');
const { sequelize } = require("../config/dbConnect");

const getStock = async (req, res) => {
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

            if(doc.y + (table.rows.length + 1) * cellHeight > 750) {
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
                    doc.fontSize(10).fillColor("black").text(header, tableStartX + firstCellWidth + (i-1) * cellWidth + 5, tableStartY + 6);
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
  
const getNotaPedido = (req, res) => {
// Lógica para el PDF de la Nota de Pedido
};

const getRemito = (req, res) => {
// Lógica para el PDF del Remito
};

module.exports = {getStock, getNotaPedido, getRemito};