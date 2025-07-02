import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GrillaMayorista({ articulo }) {
    const [ talles, setTalles] = useState([]);
    const [ colores, setColores] = useState([]);
    const [ cantidades, setCantidades] = useState({});
    const { agregarAlCarrito } = useContext(CartContext);

    useEffect(() => {
        const tallesDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.talle)));
        const coloresDesordenados = Array.from(new Set(articulo.productos.filter((producto) => producto.stock > 0).map((producto) => producto.color)));
        const coloresInit = coloresDesordenados.sort((a, b) => {
            if (a < b) {
                return -1
            }
            if (a > b) {
                return 1
            }
            return 0
        })
        const tallesInit = tallesDesordenados.sort((a, b) => {
            const isNumberA = !isNaN(a);
            const isNumberB = !isNaN(b);
            const talleOrden = { 'UNICO': 1 ,'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7, 'XXXXL': 8, 'XXXXXL': 9 };
            const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;
            const parseRango = (x) => {
                const match = x.match(rangoRegex);
                if (!match) return null;
                return {
                    start: parseInt(match[1]),
                    end: parseInt(match[2]),
                    texto: x.substring(match[0].length).trim(),
                };
            };
            
            const rangoA = parseRango(a);
            const rangoB = parseRango(b);
            
            if (isNumberA && isNumberB) {
                return a - b;
            }  else if (isNumberA || isNumberB) {
                return isNumberA ? 1 : -1;
            } else if (rangoA && rangoB) {
                return rangoA.start - rangoB.start;
            } else {
                const aMayus = a.toUpperCase()
                const bMayus = b.toUpperCase()
                return talleOrden[aMayus] - talleOrden[bMayus];
            }
        })

        const inicializarCantidades = {};
        coloresInit.forEach(color => {
            tallesInit.forEach(talle => {
                const productKey = `${color}-${talle}`;
                inicializarCantidades[productKey] = 0;
            });
        });

        setTalles(tallesInit);
        setColores(coloresInit);
        setCantidades(inicializarCantidades);
    }, [articulo]);

    const handleConfirmarProducto = () => {
        const cantidadesConStock = Object.entries(cantidades).filter(([key, cant]) => cant > 0);

        for (const parProducto of cantidadesConStock) {
            const cantidad = parProducto[1];
            const [color, talle] = parProducto[0].split('-');
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
                            const cantidad = cantidades[productKey] || 0;
                            
                            const handleBotonMenos = () => {
                                if (cantidad > 0) {
                                    setCantidades((prevCantidades) => ({
                                        ...prevCantidades,
                                        [productKey]: prevCantidades[productKey] - 1,
                                    }));
                                }
                            };
            
                            const handleBotonMas = () => {
                                if (cantidad < stock) {
                                    setCantidades((prevCantidades) => ({
                                        ...prevCantidades,
                                        [productKey]: prevCantidades[productKey] + 1,
                                    }));
                                }
                            };

                            return (
                                <td key={talleIndex} className='table-grilla-input'>
                                    {stock > 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: "1rem", margin: ".3rem" }}>
                                            <button className="item-count-button" onClick={handleBotonMenos}>-</button>
                                            <p className='item-count-cantidad'>{cantidad}</p>
                                            <button className="item-count-button" onClick={handleBotonMas}>+</button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span
                                                style={{
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                    width: '1em',
                                                    height: '1em',
                                                }}
                                            >
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '2px',
                                                    backgroundColor: 'black',
                                                    transform: 'rotate(45deg)',
                                                    top: '50%',
                                                    left: '0',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '2px',
                                                    backgroundColor: 'black',
                                                    transform: 'rotate(-45deg)',
                                                    top: '50%',
                                                    left: '0',
                                                }}
                                            />
                                            </span>
                                        </div>
                                    )}
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