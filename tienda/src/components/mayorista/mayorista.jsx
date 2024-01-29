import React, { useEffect, useState } from 'react';
import './mayorista.css';
import { pedirDatos } from "../../helpers/pedirDatos";
import GrillaMayorista from '../grillaMayorista/GrillaMayorista';
import '../grillaMayorista/grillaMayorista.css';

const Mayorista = () => {
  const [articulos, setArticulos] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState(null);

  useEffect(() => {
    pedirDatos().then((res) => {
      setArticulos(res)
      setSelectedArticulo(res[0])
    });
  }, []);

  if (!Array.isArray(articulos)) {
    return <p>No hay productos disponibles para mostrar.</p>;
  }

  const handleArticuloClick = (articulo) => {
    setSelectedArticulo(articulo);
  };

  const handleConfirmarProducto = (articulo) => {
    console.log(articulo)
  }

  const transformarArticulo = (articulo) => {
    let articuloTransformado = {
        id: articulo.id,
        numero_articulo: articulo.art,
        productos: [{
                color: "azul",
                id: 1,
                stock: 19,
                talle: "s"
            },
            {
                color: "rojo",
                id: 2,
                stock: 12,
                talle: "s"
            },
            {
                color: "azul",
                id: 3,
                stock: 1,
                talle: "m"
            },
            {
                color: "rojo",
                id: 4,
                stock: 25,
                talle: "m"
            },
        ]
    }

    return articuloTransformado
}

  return (
    <>
      <section className="contenedor-tabla-grilla">
        <table className="table-cargarPedido-contenedor">
          <thead>
            <tr className="table-header-productos">
              <th className="table-header-articulos">Artículos</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo.id} onClick={() => handleArticuloClick(articulo)}>
                <td
                  className={`table-cell-productos ${
                    selectedArticulo && selectedArticulo.id === articulo.id ? "selected" : ""
                  }`}
                >
                  {articulo.art}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedArticulo && (
          <GrillaMayorista
          articulo={transformarArticulo(selectedArticulo)}
          onConfirmarProducto={handleConfirmarProducto}
        />
        )}
      </section>
    </>
  );
};

export default Mayorista;
