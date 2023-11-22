import ModalProductoEditar from "./ModalProductoEditar";

function GrillaProducto({ onEditProducto, onDeleteProducto, articulo }) {
    const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
    const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
 
    const handleEditArticulo = (editArticulo) => {
        onEditProducto(editArticulo)
    }

    const handleDeleteArticulo = () => {
        onDeleteProducto(articulo)
    }

    return (
      <>
        <table className="table-grilla">
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
                        const matchingProduct = articulo.productos.find(
                        (producto) => producto.color === color && producto.talle === talle
                        );
                        const stock = matchingProduct ? matchingProduct.stock : 0;
                        return <td key={talleIndex}>{stock}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
        </table>
        <ModalProductoEditar onEditProducto={handleEditArticulo} articulo={articulo}/>
        <button onClick={() => handleDeleteArticulo()}  className="agregar-producto-grilla"> 
            Eliminar Articulo
        </button>
      </>
    );
  }

export default GrillaProducto;