function GrillaMayorista({ articulo, onConfirmarProducto }) {
    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));


    const handleConfirmarProducto = () => {
        onConfirmarProducto(articulo.numero_articulo)
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

                        return (
                            <td key={talleIndex} className='table-grilla-input'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        defaultValue={0}
                                    />
                                    <span className="stock-label">&nbsp;({stock})</span>
                                </div>
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