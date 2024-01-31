import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";

const FiltroColor = ({ onChangeColor }) => {
  const [filtroColor, setFiltroColor] = useState(null);

  const handleFiltroColor = (color) => {
    setFiltroColor(color);
    onChangeColor(color);
  };

  return (
    <div className="categoriaLateral">
      <ul className="menuLateral">
        <p className="menuLateralTitulo">Filtro color</p>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "blanco" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("blanco")}
          >
            blanco
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "negro" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("negro")}
          >
            negro
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "azul" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("azul")}
          >
            azul
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "violeta" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("violeta")}
          >
            violeta
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "rojo" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("rojo")}
          >
            rojo
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "verde" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("verde")}
          >
            verde
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "natural" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("natural")}
          >
            natural
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              filtroColor === "rosa" ? "seleccionada" : ""
            }`}
            onClick={() => handleFiltroColor("rosa")}
          >
            rosa
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FiltroColor;
