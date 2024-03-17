import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroTalle = ({ articulos, onChangeTalle }) => {
    const [ filtroTalle, setFiltroTalle ] = useState(null);
    const [ tallesHabilitados, setTallesHabilitados ] = useState([]);
    const { tallesData } = useData();

    useEffect(() => {
      setFiltroTalle(null)

      if(articulos) {
        const tallesFiltrados = tallesData.filter(talle => articulos.some(articulo => articulo.productos.some(producto => producto.talle === talle && producto.stock > 0)))
        setTallesHabilitados(tallesFiltrados)
      } else {
        setTallesHabilitados(tallesData)
      }
    }, [articulos])

    const handleFiltroTalle = (talle) => {
      if(filtroTalle === talle) {
        setFiltroTalle(null)
        onChangeTalle(null)
      } else {
        setFiltroTalle(talle)
        onChangeTalle(talle)
      }
    }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Talles</p>
            {tallesHabilitados.map(talle => (
              <li className="textoCategorias" key={talle}>
                <Link
                  className={`menu-link ${filtroTalle === talle ? "seleccionada" : ""}`}
                  onClick={() => handleFiltroTalle(talle)}
                >
                  {talle}
                </Link>
              </li>
            ))}
        </ul>
    </div>
  )
}

export default FiltroTalle