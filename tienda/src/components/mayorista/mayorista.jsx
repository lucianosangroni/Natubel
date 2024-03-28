import React, { useEffect, useState } from 'react';
import './mayorista.css';
import GrillaMayorista from '../grillaMayorista/GrillaMayorista';
import '../grillaMayorista/grillaMayorista.css';
import { useData } from "../../context/DataContext";
import ResumenDePedido from '../resumenDePedido/ResumenDePedido';

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
      <div className='contenedor-inicial'>
        <h1 className='explicacion-inicial'>SI YA SABES LO QUE BUSCAS REALIZA TU PEDIDO MÁS RÁPIDAMENTE</h1>
      </div>
      <section className="contenedor-tabla-grilla">
        <div className='scrollable-list-container'>
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
        </div>

        {selectedArticulo && (
          <GrillaMayorista
          articulo={selectedArticulo}
        />
        )}
      </section>
      <ResumenDePedido/>
    </>
  );
};

export default Mayorista;
