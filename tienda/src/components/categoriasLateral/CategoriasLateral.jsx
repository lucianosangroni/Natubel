import React from "react";
import { Link } from "react-router-dom";
import "./categoriasLateral.css";

const CategoriasLateral = () => {
  return (
    <div className="categoriaLateral">
      <ul className="menuLateral">
        <li>
          <Link className="menu-link" to='/catalogo/mujer'>
            Mujeres
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/hombres">
            Hombres
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/reductores">
            Reductores
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/conjuntos">
            Conjuntos
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/corpiños">
            Corpiños
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/bodys">
            Bodys
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/packx3">
            Pack x 3
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/tallesEspeciales">
            Talles especiales
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/boxer">
            Boxer
          </Link>
        </li>
        <li>
          <Link className="menu-link" to="/catalogo/boxerJuvenil">
            Boxer juvenil
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CategoriasLateral;
