function GrillasProductosConfirmados({ articulos, flag_resumen }) {
    return (
        <>
            <div className="contenedor-resumen-pedido">
                {flag_resumen && (
                    <h5 className="titulo-resumenPedido" style={{marginTop: "1rem", marginBottom: "0"}}>Resumen de Pedido</h5>
                )}
                <div className="grillas-container-resumen">
                {articulos.map((articulo, articuloIndex) => {
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