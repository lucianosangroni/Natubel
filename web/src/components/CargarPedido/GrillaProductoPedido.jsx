import React, { useState, useEffect } from 'react';

function GrillaProductoPedido({ articulo, onConfirmarProducto, tipoPedidor, onBorrarConfirmarProducto, onSetCantidades }) {
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
    const [cantidades, setCantidades] = useState({});
    const inputRefs = {};

    useEffect(() => {
        setCantidades({});
        onSetCantidades({});
        const initialProductKey = `${colores[0]}-${talles[0]}`;
        inputRefs[initialProductKey].current.focus();
    }, [articulo]);

    const filtrarDiccionario = (diccionario) => {
        const claves = Object.keys(diccionario)
        const resultado = {}

        for(const clave of claves) {
            if(diccionario[clave] !== "") {
                resultado[clave] = diccionario[clave]
            }
        }

        return resultado
    }

    const handleCantidadChange = (productKey, stock, cantidad) => {
        const parsedCantidad = parseInt(cantidad) || ""

        if((tipoPedidor === "cliente" && parsedCantidad <= stock) || tipoPedidor === "proveedor" || parsedCantidad === "") {
            const newCantidades = {...cantidades, [productKey]: parsedCantidad}
            const filteredCantidades = filtrarDiccionario(newCantidades)
            setCantidades(filteredCantidades);
            onSetCantidades(filteredCantidades);
        }
    };

    const handleKeyDown = (e, productKey, stock) => {
        e.preventDefault()
        const key = e.key

        if(key >= '0' && key <= '9') {
            const newCantidad = (cantidades[productKey] || "") + key;
            handleCantidadChange(productKey, stock, newCantidad)
        } else if (key === "Delete") {
            handleCantidadChange(productKey, stock, "")
        } else if (key === "Backspace") {
            const newCantidad = (String(cantidades[productKey]) || "").slice(0, -1);
            handleCantidadChange(productKey, stock, newCantidad)
        } else if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowDown") {
            const rowIndex = colores.indexOf(productKey.split('-')[0]);
            const colIndex = talles.indexOf(productKey.split('-')[1]);
    
            let nextRowIndex, nextColIndex;
            if (key === "ArrowRight") {
                nextRowIndex = rowIndex;
                nextColIndex = colIndex + 1;
            } else if (key === "ArrowLeft") {
                nextRowIndex = rowIndex;
                nextColIndex = colIndex - 1;
            } else if (key === "ArrowUp") {
                nextRowIndex = rowIndex - 1;
                nextColIndex = colIndex;
            } else if (key === "ArrowDown") {
                nextRowIndex = rowIndex + 1;
                nextColIndex = colIndex;
            }
    
            if (colores[nextRowIndex] && talles[nextColIndex]) {
                const nextProductKey = `${colores[nextRowIndex]}-${talles[nextColIndex]}`;
                inputRefs[nextProductKey].current.focus();
            }
        }
    }

    const handleConfirmarProducto = () => {
        if (Object.keys(cantidades).length > 0) {
            onConfirmarProducto(articulo, cantidades)
        } else {
            onBorrarConfirmarProducto(articulo)
        }
    }

    return (
    <>
        <table className="table-grilla">
            <thead >
                <tr >
                    <th id="articulo-grilla-elegido" >ART. {articulo.numero_articulo}</th>
                    {talles.map((talle, index) => (
                        <th key={index}>{talle}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {colores.map((color, index) => (
                <tr key={index}>
                    <td>{color}</td>
                    {talles.map((talle, talleIndex) => {
                        const matchingProduct = articulo.productos.find(
                            (producto) => producto.color === color && producto.talle === talle
                        );
                        const stock = matchingProduct ? matchingProduct.stock : 0;
                        const productKey = `${color}-${talle}`;
                        const cantidad = cantidades[productKey] || "";

                        inputRefs[productKey] = React.createRef();

                        return (
                            <td key={talleIndex} className='table-grilla-input'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        defaultValue={cantidad}
                                        onKeyDown={(e) => handleKeyDown(e, productKey, stock)}
                                        ref={inputRefs[productKey]}
                                    />
                                    <span className="stock-label">&nbsp;({stock})</span>
                                </div>
                            </td>
                        );
                    })}
                </tr>
                ))}
            </tbody>
        </table>
        <button className="confirmarCargarPedido" onClick={handleConfirmarProducto}>Confirmar</button>
    </>
    );
}

export default GrillaProductoPedido;