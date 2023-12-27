import React, { useState } from 'react'
import "../categoriasLateral/categoriasLateral.css";
import { Link } from 'react-router-dom';

const FiltroColor = () => {

    const [ filtroColor, setFiltroColor ] = useState();

    const handleFiltroColor = (color) => {
        setFiltroColor(color)
    }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Filtro color</p>
            <li>
            <Link
            className={`menu-link ${filtroColor === "blanco" ? "seleccionada" : ""}`}
            to='/catalogo/blanco'
            onClick={() => handleFiltroColor("blanco")}
          >
            blanco
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "negro" ? "seleccionada" : ""}`}
            to='/catalogo/negro'
            onClick={() => handleFiltroColor("negro")}
          >
            negro
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "azul" ? "seleccionada" : ""}`}
            to='/catalogo/azul'
            onClick={() => handleFiltroColor("azul")}
          >
            azul
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "violeta" ? "seleccionada" : ""}`}
            to='/catalogo/violeta'
            onClick={() => handleFiltroColor("violeta")}
          >
            violeta
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "rojo" ? "seleccionada" : ""}`}
            to='/catalogo/rojo'
            onClick={() => handleFiltroColor("rojo")}
          >
            rojo
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "verde" ? "seleccionada" : ""}`}
            to='/catalogo/verde'
            onClick={() => handleFiltroColor("verde")}
          >
            verde
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "natural" ? "seleccionada" : ""}`}
            to='/catalogo/natural'
            onClick={() => handleFiltroColor("natural")}
          >
            natural
          </Link>
            </li>
            <li>
            <Link
            className={`menu-link ${filtroColor === "rosa" ? "seleccionada" : ""}`}
            to='/catalogo/rosa'
            onClick={() => handleFiltroColor("rosa")}
          >
            rosa
          </Link>
            </li>
        </ul>
    </div>
  )
}

export default FiltroColor