import ModalProductoEditar from "./ModalProductoEditar";

function GrillaProducto({ onEditProducto, onDeleteProducto, onPublicarEnMl, articulo, categorias, marcas }) {
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

    const handlePublicarEnMl = () => {
      onPublicarEnMl(articulo)
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
        <ModalProductoEditar onEditProducto={handleEditArticulo} articulo={articulo} categorias={categorias} marcas={marcas}/>
        <button onClick={() => handleDeleteArticulo()}  className="agregar-producto-grilla" style={{ marginTop: '2rem' }}> 
            Eliminar Articulo
        </button>
        {articulo.ml_item_id ? (
          <button disabled className="agregar-producto-grilla" style={{ marginTop: '2rem', cursor: "default", color: "green"}}>
            Publicado en Mercado Libre
          </button>
        ) : (
          <button onClick={() => handlePublicarEnMl()}  className="agregar-producto-grilla" style={{ marginTop: '2rem' }}> 
            Publicar en Mercado Libre
          </button>
        )}
      </div>
      </>
    );
  }

export default GrillaProducto;