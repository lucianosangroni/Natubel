function GrillasProductosConfirmados({ articulos }) {
    return (
        <>
            <h5 className="titulo-resumenPedido">Resumen de pedido</h5>
            <div className="grillas-container-resumen">
            {articulos.map((articulo, articuloIndex) => {
                    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
                    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

                return  (
                    <div key={articuloIndex} className="grillas-container-resumen">
                        <table className="table-grilla-resumen">
                            <thead>
                                <tr className="table-header-grilla">
                                    <th className="articulo-grilla">{articulo.numero_articulo}</th>
                                    {talles.map((talle, index) => (
                                        <th key={index}>Talle {talle}</th>
                                    ))}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            })}
            </div>
        </>
    );
}

export default GrillasProductosConfirmados;