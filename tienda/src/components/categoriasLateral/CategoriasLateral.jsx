import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./categoriasLateral.css";
import { useParams } from "react-router-dom";
import { useData } from '../../context/DataContext';

const CategoriasLateral = () => {
  const { categoria } = useParams();
  const [ catSeleccionada, setCatSeleccionada ] = useState(null);
  const { categoriasData } = useData();

  useEffect(() => {
    setCatSeleccionada(categoria)
  }, [categoria]);

  return (
    <div className="categoriaLateral">
      <ul className="menuLateral">
        <p className="menuLateralTitulo">Categorias</p>  
        {categoriasData.map(cat => (
          <li className="textoCategorias" key={cat.id}>
            <Link
              className={`menu-link ${parseInt(catSeleccionada) === cat.id ? "seleccionada" : ""}`}
              to={parseInt(catSeleccionada) === cat.id ? "/catalogo" : `/catalogo/${cat.id}`}
            >
              {cat.nombre}
            </Link>
          </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoriasLateral;
