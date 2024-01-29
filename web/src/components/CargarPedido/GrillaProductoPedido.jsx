import { useState, useEffect } from 'react';

function GrillaProductoPedido({ articulo, onConfirmarProducto, tipoPedidor, onBorrarConfirmarProducto }) {
    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
    const [cantidades, setCantidades] = useState({});

    useEffect(() => {
        setCantidades({});
        console.log(articulo)
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
        <button className="confirmarCargarPedido" onClick={handleConfirmarProducto}>Confirmar</button>
      </>
    );
  }

export default GrillaProductoPedido;