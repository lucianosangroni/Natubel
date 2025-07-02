import { useEffect, useState } from "react";

function GrillasProductosConfirmados({ articulos, flag_resumen }) {
    const [precioMinorista, setPrecioMinorista] = useState(0);
    const [precioMayorista, setPrecioMayorista] = useState(0);
    const [precioDistribuidor, setPrecioDistribuidor] = useState(0);
    const [precioDeMarca, setPrecioDeMarca] = useState(0);
    
    useEffect(() => {
        let precioMinoristaActualizado = 0;
        let precioMayoristaActualizado = 0;
        let precioDistribuidorActualizado = 0;
        let precioDeMarcaActualizado = 0;

        for (const art of articulos) {
            const claves = Object.keys(art.cantidades);

            for (const clave of claves) {
                const cantidad = art.cantidades[clave];

                precioMinoristaActualizado += cantidad * art.precio_minorista
                precioMayoristaActualizado += cantidad * art.precio_mayorista
                precioDistribuidorActualizado += cantidad * art.precio_distribuidor
                precioDeMarcaActualizado += cantidad * art.precio_de_marca
            }
        }

        setPrecioMinorista(precioMinoristaActualizado)
        setPrecioMayorista(precioMayoristaActualizado)
        setPrecioDistribuidor(precioDistribuidorActualizado)
        setPrecioDeMarca(precioDeMarcaActualizado)
    }, [articulos]);

    const formatearNumero = (numero) => {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <>
            <div className="contenedor-resumen-pedido">
                {flag_resumen && (
                    <>
                        <h5 className="titulo-resumenPedido" style={{marginTop: "1rem", marginBottom: "0"}}>Resumen de Pedido</h5>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem"}}>
                            <div style={{display: "flex", justifyContent: "flex-start", gap: "1.5rem", color: "#000000", fontWeight: "bold"}}>
                                <span>Precio Minorista: </span>
                                <span>${formatearNumero(precioMinorista)}</span>
                            </div>
                            <div style={{display: "flex", justifyContent: "flex-start", gap: "1.5rem", color: "#000000", fontWeight: "bold"}}>
                                <span>Precio Mayorista: </span>
                                <span>${formatearNumero(precioMayorista)}</span>
                            </div>
                            <div style={{display: "flex", justifyContent: "flex-start", gap: "0.5rem", color: "#000000", fontWeight: "bold"}}>
                                <span>Precio Distribuidor: </span>
                                <span>${formatearNumero(precioDistribuidor)}</span>
                            </div>
                            <div style={{display: "flex", justifyContent: "flex-start", gap: "1.8rem", color: "#000000", fontWeight: "bold"}}>
                                <span>Precio de Marca: </span>
                                <span>${formatearNumero(precioDeMarca)}</span>
                            </div>
                        </div>
                    </>
                )}
                <div className="grillas-container-resumen">
                {articulos.map((articulo, articuloIndex) => {
                        const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
                        const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

                        const talles = tallesDesordenados.sort((a, b) => {
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
                            
                            if (!isNaN(a) && !isNaN(b)) {
                                return a - b;
                            } else if (rangoA && rangoB) {
                                return rangoA.start - rangoB.start;
                            }
                            
                            const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                            return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
                        });

                        const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

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
        </>
    );
}

export default GrillasProductosConfirmados;