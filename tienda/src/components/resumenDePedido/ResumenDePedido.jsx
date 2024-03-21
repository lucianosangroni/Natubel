import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";

function ResumenDePedido() {
    const [ articulos, setArticulos ] = useState([])
    const [ cantidades, setCantidades ] = useState({})

    const {
        carrito
    } = useContext(CartContext);

    useEffect(() => {
        carrito.forEach(producto => {
            
        })
    }, [carrito])

    /**
     * cantidad: 2
     * color: "azul"
     * id: 1
     * numero_articulo: "1"
     * talle: "s"
     */

    return (
        <>
            {articulos.length > 0 && (
                <div className="contenedor-resumen-pedido">
                    <h5 className="titulo-resumenPedido">Resumen de Pedido</h5>
                    <div className="grillas-container-resumen">
                    {carrito.map((articulo, articuloIndex) => {
                            const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
                            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

                            const totalPedido = talles.reduce((total, talle) => {
                                const sumaTalle = colores.reduce((acc, color) => {
                                    const key = `${color}-${talle}`;
                                    return acc + (articulo.cantidades[key] || 0);
                                }, 0);
                                return total + sumaTalle;
                            }, 0);

                        return  (
                            <div key={articuloIndex} className="grillas-container-resumen">
                                <table className="table-grilla-resumen">
                                    <thead>
                                        <tr className="table-header-grilla">
                                            <th id="listado-articulo-grilla">ART. {articulo.numero_articulo}</th>
                                            {talles.map((talle, index) => (
                                                <th key={index}>{talle}</th>
                                            ))}
                                            <th id="listado-articulo-grilla">TOTAL</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colores.map((color, index) => (
                                            <tr key={index}>
                                                <td className="table-cell-grilla">{color}</td>
                                                {talles.map((talle, talleIndex) => {
                                                    const key = `${color}-${talle}`;
                                                    const cantidad = articulo.cantidades[key] || "";
                                                    return (
                                                        <td key={talleIndex}>
                                                            {cantidad}
                                                        </td>
                                                    );
                                                })}
                                                <td>{index === 0 ? totalPedido : ""}</td> 
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                    </div>
                </div>
            )}
        </>
    );
}

export default ResumenDePedido;