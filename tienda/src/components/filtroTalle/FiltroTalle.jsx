import React, { useState } from 'react'
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
            <li>
            <button
            className={`menu-link ${filtroTalle === "s" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("s")}
          >
            S
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "m" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("m")}
          >
            M
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "l" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("l")}
          >
            L
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "xl" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("xl")}
          >
            XL
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "xxl" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("xxl")}
          >
            XXL
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "especiales" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("especiales")}
          >
            ESPECIALES
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "1" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("1")}
          >
            1
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroTalle === "2" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroTalle("2")}
          >
            2
          </button>
            </li>
        </ul>
    </div>
  )
}

export default FiltroTalle