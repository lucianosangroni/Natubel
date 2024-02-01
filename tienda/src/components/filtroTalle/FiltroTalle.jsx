import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";

const FiltroTalle = ({ onChangeTalle }) => {
    const [ filtroTalle, setFiltroTalle ] = useState(null);

    const handleFiltroTalle = (talle) => {
        setFiltroTalle(talle)
        onChangeTalle(talle)
    }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Filtro color</p>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "s" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("s")}
          >
            S
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "m" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("m")}
          >
            M
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "l" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("l")}
          >
            L
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "xl" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("xl")}
          >
            XL
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "xxl" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("xxl")}
          >
            XXL
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "especiales" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("especiales")}
          >
            ESPECIALES
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "1" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("1")}
          >
            1
          </Link>
            </li>
            <li className="textoCategorias">
            <Link
            className={`menu-link ${filtroTalle === "2" ? "seleccionada" : ""}`}
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