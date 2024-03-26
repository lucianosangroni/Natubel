import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroColor = ({ articulos, onChangeColor }) => {
  const [ filtroColor, setFiltroColor ] = useState(null);
  const [ coloresHabilitados, setColoresHabilitados ] = useState([])
  const { coloresData } = useData();
  const [ colores, setColores ] = useState([])

  useEffect(() => {
    setColores([])

    if(articulos) {
      const coloresFiltrados = coloresData.filter(color => articulos.some(articulo => articulo.productos.some(producto => producto.color === color && producto.stock > 0)))
      setColoresHabilitados(coloresFiltrados)
    } else {
      setColoresHabilitados(coloresData)
    }
  }, [articulos])

  useEffect(() => {
    const coloresOrdenados = coloresHabilitados.sort((a, b) => {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })

    const coloresUnicos = new Set()

    coloresOrdenados.forEach(color => {
      const colorMayus = color.toUpperCase()
      if(!coloresUnicos.has(colorMayus)) {
        coloresUnicos.add(colorMayus)
      }
    })

    setColores(Array.from(coloresUnicos))
  }, [coloresHabilitados])

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
        {colores.map(color => (
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
