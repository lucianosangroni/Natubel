import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useData } from "../../context/DataContext";
import '../resumenDePedido/resumenDePedido.css'

function ResumenDePedido() {
    const [ articulos, setArticulos ] = useState([])
    const { articulosData } = useData();

    const {
        carrito
    } = useContext(CartContext);

    useEffect(() => {
        const nuevosArticulos = obtenerArticulos()
        setArticulos(nuevosArticulos)
    }, [carrito])

    const obtenerArticulos = () => {
        const nuevaListaArticulos = {};

        carrito.forEach(producto => {
            const numeroArticulo = producto.numero_articulo;

            if (!nuevaListaArticulos[numeroArticulo]) {
                nuevaListaArticulos[numeroArticulo] = {
                    numero_articulo: producto.numero_articulo,
                    productos: articulosData.find(articulo => articulo.numero_articulo === numeroArticulo).productos,
                    cantidades: {}
                };
            }

            const clave = `${producto.color.toUpperCase()}-${producto.talle.toUpperCase()}`;

            if (nuevaListaArticulos[numeroArticulo].cantidades[clave]) {
                nuevaListaArticulos[numeroArticulo].cantidades[clave] += producto.cantidad;
            } else {
                nuevaListaArticulos[numeroArticulo].cantidades[clave] = producto.cantidad;
            }
        });
        
        return Object.values(nuevaListaArticulos);
    }

    return (
        <>
            {articulos.length > 0 && (
                <div className="contenedor-resumen-pedido">
                    <h5 className="titulo-resumenPedido">Resumen de Pedido</h5>
                    {articulos.map((articulo, articuloIndex) => {
                            const tallesDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.talle.toUpperCase())));
                            const coloresDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.color.toUpperCase())));
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
                            const totalPedido = talles.reduce((total, talle) => {
                                const sumaTalle = colores.reduce((acc, color) => {
                                    const key = `${color}-${talle}`;
                                    return acc + (articulo.cantidades[key] || 0);
                                }, 0);
                                return total + sumaTalle;
                            }, 0);
                        return  (
                            <div className="contenedor-grilla-individual">
                                <table className="table-grilla-resumen">
                                    <thead>
                                        <tr>
                                            <th className="celda-resaltada">ART. {articulo.numero_articulo}</th>
                                            {talles.map((talle, index) => (
                                                <th key={index}>{talle}</th>
                                            ))}
                                            <th className="celda-resaltada">TOTAL</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colores.map((color, index) => (
                                            <tr key={index}>
                                                <td>{color}</td>
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
            )}
        </>
    );
}

export default ResumenDePedido;