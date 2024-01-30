import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import CartWidget from "../cartWidget/CartWidget";
import MenuDesplegable from "../menuDesplegable/MenuDesplegable";
import whatsapp from "./whatsapp.svg";

const Navbar = () => {
  return (
    <div>
      <p className="encabezado">
        MINIMO DE COMPRAS MAYORISTAS $25.000 || PARA COMPRAS MAYORES A
        $200.000.- ESCRIBINOS A NUESTRO WHATSAPP
      </p>
      <nav className="navbar">
        <Link to="/" className="logo">
          <h1>Natubel</h1>
        </Link>
        <ul className="menu">
          <li>
            <Link className="menu-link" to="/">
              | Inicio |
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/catalogo">
              Catalogo
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/catalogo">
              <MenuDesplegable />
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/mayorista">
              Mayorista
            </Link>
          </li>
        </ul>
        <div>
          <CartWidget />
        </div>
      </nav>
      <div className="redesWhatsapp">
        <a
          href="https://web.whatsapp.com/send?phone=1131109942"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsapp} alt="whatsapp" />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
