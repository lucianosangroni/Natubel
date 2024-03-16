import React, { useEffect, useState } from 'react';
import './mayorista.css';
import GrillaMayorista from '../grillaMayorista/GrillaMayorista';
import '../grillaMayorista/grillaMayorista.css';
import { useData } from "../../context/DataContext";

const Mayorista = () => {
  const { articulosData } = useData();
  const [ selectedArticulo, setSelectedArticulo ] = useState(null);

  useEffect(() => {
    setSelectedArticulo(articulosData[0])
  }, [articulosData]);

  const handleArticuloClick = (articulo) => {
    setSelectedArticulo(articulo);
  };

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
            {articulosData.map((articulo) => (
              <tr key={articulo.id} onClick={() => handleArticuloClick(articulo)}>
                <td
                  className={`table-cell-productos ${
                    selectedArticulo && selectedArticulo.id === articulo.id ? "selected" : ""
                  }`}
                >
                ART. {articulo.numero_articulo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedArticulo && (
          <GrillaMayorista
          articulo={selectedArticulo}
        />
        )}
      </section>
    </>
  );
};

export default Mayorista;
