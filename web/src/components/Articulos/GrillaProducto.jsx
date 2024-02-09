import ModalProductoEditar from "./ModalProductoEditar";

function GrillaProducto({ onEditProducto, onDeleteProducto, articulo, categorias }) {
    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
 
    const totalStock = talles.reduce((total, talle) => {
      const sumaTalle = articulo.productos.reduce((acc, producto) => {
          if (producto.talle === talle) {
              return acc + producto.stock;
          }
          return acc;
      }, 0);
      return total + sumaTalle;
    }, 0);

    const handleEditArticulo = (editArticulo) => {
        onEditProducto(editArticulo)
    }

    const handleDeleteArticulo = () => {
        onDeleteProducto(articulo)
    }

    return (
      <>
      <div className="table-container">
        <div className="table-width-container">
          <table className="table-grilla">
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
                          const matchingProduct = articulo.productos.find(
                          (producto) => producto.color === color && producto.talle === talle
                          );
                          const stock = matchingProduct && matchingProduct.stock !== 0  ? matchingProduct.stock : " ";
                          return <td key={talleIndex}>{stock}</td>;
                      })}
                      <td>{index === 0 ? totalStock : "" }</td>
                    </tr>
                  ))}
                </tbody>
          </table>
        </div>
        <ModalProductoEditar onEditProducto={handleEditArticulo} articulo={articulo} categorias={categorias}/>
        <button onClick={() => handleDeleteArticulo()}  className="agregar-producto-grilla" style={{ marginTop: '2rem' }}> 
            Eliminar Articulo
        </button>
      </div>
      </>
    );
  }

export default GrillaProducto;