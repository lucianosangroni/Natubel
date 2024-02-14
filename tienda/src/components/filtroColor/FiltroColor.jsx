import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroColor = ({ onChangeColor }) => {
  const [ filtroColor, setFiltroColor ] = useState(null);
  const { coloresData } = useData();

  const handleFiltroColor = (color) => {
    if(filtroColor === color) {
      setFiltroColor(null)
      onChangeColor(null);
    } else {
      setFiltroColor(color);
      onChangeColor(color);
    }
  };

  return (
    <div className="categoriaLateral">
      <ul className="menuLateral">
        <p className="menuLateralTitulo">Colores</p>
        {coloresData.map(color => (
          <li className="textoCategorias" key={color}>
            <Link
              className={`menu-link ${filtroColor === color ? "seleccionada" : ""}`}
              onClick={() => handleFiltroColor(color)}
            >
              {color}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FiltroColor;
