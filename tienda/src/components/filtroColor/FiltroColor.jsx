import React, { useState } from 'react'
import "../categoriasLateral/categoriasLateral.css";

const FiltroColor = ({ onChangeColor }) => {
  const [filtroColor, setFiltroColor] = useState(null)

  const handleFiltroColor = (color) => {
      setFiltroColor(color)
      onChangeColor(color)
  }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Filtro color</p>
            <li>
            <button
            className={`menu-link ${filtroColor === "blanco" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("blanco")}
          >
            blanco
            </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "negro" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("negro")}
          >
            negro
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "azul" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("azul")}
          >
            azul
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "violeta" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("violeta")}
          >
            violeta
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "rojo" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("rojo")}
          >
            rojo
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "verde" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("verde")}
          >
            verde
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "natural" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("natural")}
          >
            natural
          </button>
            </li>
            <li>
            <button
            className={`menu-link ${filtroColor === "rosa" ? "seleccionada" : ""}`}
            onClick={() => handleFiltroColor("rosa")}
          >
            rosa
          </button>
            </li>
        </ul>
    </div>
  )
}

export default FiltroColor