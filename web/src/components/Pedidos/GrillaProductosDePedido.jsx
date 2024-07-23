function GrillaProductosDePedido({ articulo, productos }) {
  const totalPedido = articulo.talles.reduce((total, talle) => {
    const sumaTalle = productos.reduce((acc, producto) => {
        if (producto.talle === talle && producto.articulo_id === articulo.id) {
            return acc + producto.productos_x_pedido.cantidad;
        }
        return acc;
    }, 0);
    return total + sumaTalle;
  }, 0);

    return (
      <>
      <div className="table-width-container">
        <table className="table-grilla">
            <thead>
                <tr className="table-header-grilla">
                    <th id="listado-articulo-grilla">ART. {articulo.numero_articulo}</th>
                    {articulo.talles.map((talle, index) => (
                        <th key={index}>{talle}</th>
                    ))}
                    <th id="listado-articulo-grilla">TOTAL</th> 
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
                    <td>{index === 0 ? totalPedido : ""}</td>
                  </tr>
                ))}
            </tbody>
        </table>
      </div>
      </>
    );
  }

export default GrillaProductosDePedido;