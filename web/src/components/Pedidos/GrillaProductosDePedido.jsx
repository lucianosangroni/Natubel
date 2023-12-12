function GrillaProductosDePedido({ articulo, productos }) {

    return (
      <>
      <table className="table-grilla">
            <thead>
                <tr className="table-header-grilla">
                    <th id="listado-articulo-grilla">ART. {articulo.numero_articulo}</th>
                    {articulo.talles.map((talle, index) => (
                        <th key={index}>{talle}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {articulo.colores.map((color, index) => (
                  <tr key={index}>
                    <td className="table-cell-grilla">{color}</td>
                    {articulo.talles.map((talle, talleIndex) => {
                        const matchingProduct = productos.find(
                        (producto) => producto.color === color && producto.talle === talle && producto.articulo_id === articulo.id
                        );
                        const cantidad = matchingProduct ? matchingProduct.productos_x_pedido.cantidad : "";
                        return <td key={talleIndex}>{cantidad}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
        </table>
      </>
    );
  }

export default GrillaProductosDePedido;