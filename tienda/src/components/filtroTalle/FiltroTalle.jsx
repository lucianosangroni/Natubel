import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroTalle = ({ onChangeTalle }) => {
    const [ filtroTalle, setFiltroTalle ] = useState(null);
    const { tallesData } = useData();

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
            {tallesData.map(talle => (
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