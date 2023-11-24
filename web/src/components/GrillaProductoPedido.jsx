import { useState, useEffect } from 'react';

function GrillaProductoPedido({ articulo, onConfirmarProducto, tipoPedidor }) {
    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
    const [cantidades, setCantidades] = useState({});

    useEffect(() => {
        setCantidades({});
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
        }
    }

    const handleConfirmarProducto = () => {
        onConfirmarProducto(articulo, cantidades)
    }

    return (
      <>
        <table className="table-grilla">
            <thead >
                <tr >
                    <th id="articulo-grilla-elegido" >{articulo.numero_articulo}</th>
                    {talles.map((talle, index) => (
                        <th key={index}>Talle{talle}</th>
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

                        return (
                        <td key={talleIndex} className='table-grilla-input'>
                            <input
                            type="text"
                            defaultValue={cantidad}
                            onKeyDown={(e) => handleKeyDown(e, productKey, stock)}
                            />
                            ({stock})
                        </td>
                        );
                    })}
                  </tr>
                ))}
              </tbody>
        </table>
        <button className="confirmar" onClick={handleConfirmarProducto}>Confirmar</button>
      </>
    );
  }

export default GrillaProductoPedido;