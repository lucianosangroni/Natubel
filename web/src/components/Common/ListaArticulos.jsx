function ListaArticulos({ articulos, onArticuloClick, selectedArticulo }) {
    return (
        <>
        <div className="scrollable-list-container">
          <table className="table-productos">
            <thead>
                <tr className="table-header-productos">
                  <th className="table-header-articulos " >Artículos</th>
                </tr>
            </thead>
            <tbody>
                {articulos.map((articulo) => (
                <tr key={articulo.id} onClick={() => {
                    onArticuloClick(articulo)
                }}>
                    <td
                    className={`table-cell-productos ${
                        selectedArticulo && selectedArticulo.id === articulo.id ? "selected" : ""
                    }`}
                    >
                    {articulo.numero_articulo}
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
        </>
      );
    }
    
    export default ListaArticulos;