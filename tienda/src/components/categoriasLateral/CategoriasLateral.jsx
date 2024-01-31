import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./categoriasLateral.css";

const CategoriasLateral = () => {
  const [catSeleccionada, setCatSeleccionada] = useState(null);

  const handleCatSeleccionada = (categoria) => {
    setCatSeleccionada(categoria);
  };

  return (
    <div className="categoriaLateral">
      <ul className="menuLateral">
        <p className="menuLateralTitulo">Categorias</p>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "mujer" ? "seleccionada" : ""
            }`}
            to="/catalogo/mujer"
            onClick={() => handleCatSeleccionada("mujer")} 
          >
            Mujeres
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "hombres" ? "seleccionada" : ""
            }`}
            to="/catalogo/hombres"
            onClick={() => handleCatSeleccionada("hombres")}
          >
            Hombres
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "reductores" ? "seleccionada" : ""
            }`}
            to="/catalogo/reductores"
            onClick={() => handleCatSeleccionada("reductores")}
          >
            Reductores
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "conjuntos" ? "seleccionada" : ""
            }`}
            to="/catalogo/conjuntos"
            onClick={() => handleCatSeleccionada("conjuntos")}
          >
            Conjuntos
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "corpiños" ? "seleccionada" : ""
            }`}
            to="/catalogo/corpiños"
            onClick={() => handleCatSeleccionada("corpiños")}
          >
            Corpiños
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "bodys" ? "seleccionada" : ""
            }`}
            to="/catalogo/bodys"
            onClick={() => handleCatSeleccionada("bodys")}
          >
            Bodys
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "packx3" ? "seleccionada" : ""
            }`}
            to="/catalogo/packx3"
            onClick={() => handleCatSeleccionada("packx3")}
          >
            Pack x 3
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "tallesEspeciales" ? "seleccionada" : ""
            }`}
            to="/catalogo/tallesEspeciales"
            onClick={() => handleCatSeleccionada("tallesEspeciales")}
          >
            Talles especiales
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "boxer" ? "seleccionada" : ""
            }`}
            to="/catalogo/boxer"
            onClick={() => handleCatSeleccionada("boxer")}
          >
            Boxer
          </Link>
        </li>
        <li className="textoCategorias">
          <Link
            className={`menu-link ${
              catSeleccionada === "boxerJuvenil" ? "seleccionada" : ""
            }`}
            to="/catalogo/boxerJuvenil"
            onClick={() => handleCatSeleccionada("boxerJuvenil")}
          >
            Boxer juvenil
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CategoriasLateral;
