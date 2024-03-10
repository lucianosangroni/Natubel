import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroColor = ({ articulos, onChangeColor }) => {
  const [ filtroColor, setFiltroColor ] = useState(null);
  const [ coloresHabilitados, setColoresHabilitados ] = useState([])
  const [ coloresDeshabilitados, setColoresDeshabilitados ] = useState([])
  const { coloresData } = useData();

  useEffect(() => {
    setFiltroColor(null)

    if(articulos) {
      const coloresFiltrados = coloresData.filter(color => articulos.some(articulo => articulo.productos.some(producto => producto.color === color && producto.stock > 0)))
      setColoresHabilitados(coloresFiltrados)
      const coloresRestantes = coloresData.filter(color => !coloresFiltrados.includes(color));
      setColoresDeshabilitados(coloresRestantes)
    } else {
      setColoresHabilitados(coloresData)
    }
  }, [articulos])

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
      <ul className="menuLateralColor">
        <p className="menuLateralTitulo">Colores</p>
        {coloresHabilitados.map(color => (
          <li className="textoCategorias" key={color}>
            <Link
              className={`menu-link ${filtroColor === color ? "seleccionada" : ""}`}
              onClick={() => handleFiltroColor(color)}
            >
              {color}
            </Link>
          </li>
        ))}
        {coloresDeshabilitados.map(color => (
          <li style={{ color: '#e9dfdf' }} className="textoCategorias" key={color}>
            {color}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FiltroColor;
