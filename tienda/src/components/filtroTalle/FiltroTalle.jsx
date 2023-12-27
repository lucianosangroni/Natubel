import React, { useState } from 'react'
import "../categoriasLateral/categoriasLateral.css";
import { Link } from 'react-router-dom';

const FiltroTalle = () => {

    const [ filtroTalle, setFiltroTalle ] = useState();

    const handleFiltroTalle = (talle) => {
        setFiltroTalle(talle)
    }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Filtro color</p>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "S" ? "seleccionada" : ""}`}
            to='/catalogo/S'
            onClick={() => handleFiltroTalle("S")}
          >
            S
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "M" ? "seleccionada" : ""}`}
            to='/catalogo/M'
            onClick={() => handleFiltroTalle("M")}
          >
            M
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "L" ? "seleccionada" : ""}`}
            to='/catalogo/L'
            onClick={() => handleFiltroTalle("L")}
          >
            L
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "XL" ? "seleccionada" : ""}`}
            to='/catalogo/XL'
            onClick={() => handleFiltroTalle("XL")}
          >
            XL
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "XXL" ? "seleccionada" : ""}`}
            to='/catalogo/XXL'
            onClick={() => handleFiltroTalle("XXL")}
          >
            XXL
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "ESPECIALES" ? "seleccionada" : ""}`}
            to='/catalogo/ESPECIALES'
            onClick={() => handleFiltroTalle("ESPECIALES")}
          >
            ESPECIALES
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "1" ? "seleccionada" : ""}`}
            to='/catalogo/1'
            onClick={() => handleFiltroTalle("1")}
          >
            1
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroTalle === "2" ? "seleccionada" : ""}`}
            to='/catalogo/2'
            onClick={() => handleFiltroTalle("2")}
          >
            2
          </Link>
            </li>
        </ul>
    </div>
  )
}

export default FiltroTalle