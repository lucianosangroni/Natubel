import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GrillaMayorista({ articulo }) {
    const tallesDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.talle)));
    const coloresDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.color)));
    const colores = coloresDesordenados.sort((a, b) => {
        if (a < b) {
            return -1
        }
        if (a > b) {
            return 1
        }
        return 0
    })
    const talles = tallesDesordenados.sort((a, b) => {
        const isNumberA = !isNaN(a);
        const isNumberB = !isNaN(b);
        const talleOrden = { 'UNICO': 1 ,'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7, 'XXXXL': 8, 'XXXXXL': 9 };

        if (isNumberA && isNumberB) {
            return a - b;
        }  else if (isNumberA || isNumberB) {
            return isNumberA ? 1 : -1;
        } else {
            const aMayus = a.toUpperCase()
            const bMayus = b.toUpperCase()
            return talleOrden[aMayus] - talleOrden[bMayus];
        }
    })

    const [cantidades, setCantidades] = useState({});
    const inputRefs = {};
    const { agregarAlCarrito } = useContext(CartContext);

    useEffect(() => {
        setCantidades({});
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

        if(parsedCantidad <= stock || parsedCantidad === "") {
            const newCantidades = {...cantidades, [productKey]: parsedCantidad}
            const filteredCantidades = filtrarDiccionario(newCantidades)
            setCantidades(filteredCantidades);
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
        for (const productoKey of Object.keys(cantidades)) {
            const cantidad = cantidades[productoKey];
            const [color, talle] = productoKey.split('-');
            agregarAlCarrito(articulo.numero_articulo, color, talle, cantidad)
        }

        toast.success("¡Agregado al carrito!", {
            position: "top-center",
            hideProgressBar: true,
            autoClose: 1000, 
            closeButton: false,
        });
    }

    return (
    <>
        <ToastContainer position="top-right" hideProgressBar={false}/>
        <table className="table-grilla">
            <thead >
                <tr >
                    <th id="articulo-grilla-elegido" >ART. {articulo.numero_articulo}</th>
                    {talles.map((talle, index) => (
                        <th key={index}>{talle.toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {colores.map((color, index) => (
                    <tr key={index}>
                        <td>{color.toUpperCase()}</td>
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

export default GrillaMayorista;