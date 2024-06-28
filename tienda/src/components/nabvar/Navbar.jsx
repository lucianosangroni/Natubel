import React from "react";
import { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import CartWidget from "../cartWidget/CartWidget";
import MenuDesplegable from "../menuDesplegable/MenuDesplegable";
import whatsapp from "./whatsapp.svg";
import { useData } from '../../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 769);
  const { montoMinimoMayorista, montoMinimoDistribuidor, categoriasData } = useData();
  const [ menuAbierto, setMenuAbierto ] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 769);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const toggleMenu = (e) => {
    setMenuAbierto(!menuAbierto);
    e.stopPropagation();
  };

  return (
    <>
      {isMobile ? (
        <>
          <nav className="navbarMobileContainer">
            <p className="encabezadoMobile">
              MINIMO DE COMPRAS MAYORISTAS ${formatearNumero(montoMinimoMayorista)} || PARA COMPRAS MAYORES A
              ${formatearNumero(montoMinimoDistribuidor)}. HACE TU PEDIDO Y ESCRIBINOS A NUESTRO WHATSAPP
            </p>
            <div className="navbarMobile">
              <div className="menu-toggle" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faBars} style={{ color: 'white', fontSize: '24px', listStyle: "none", }} />
              </div>
              <Link to="/" className="logo">
                <h1>Natubel</h1>
              </Link>
              <CartWidget />
            </div>
            {menuAbierto && (
              <div>
                {categoriasData.map(cat => (
                  <li className="textoCategorias" key={cat.id}>
                    <Link
                      className="menu-link"
                      to={`/catalogo/${cat.id}`}
                      onClick={toggleMenu}
                    >
                      {cat.nombre}
                    </Link>
                  </li>
                ))}
              </div>
            )}
          </nav>
        </>
      ) : (
        <>
          <p className="encabezado">
            MINIMO DE COMPRAS MAYORISTAS ${formatearNumero(montoMinimoMayorista)} || PARA COMPRAS MAYORES A
            ${formatearNumero(montoMinimoDistribuidor)}. HACE TU PEDIDO Y ESCRIBINOS A NUESTRO WHATSAPP
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
                <MenuDesplegable />
              </li>
              <li>
                <Link className="menu-link" to="/mayorista">
                  Compra rapida
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
              <img src={whatsapp} alt="Contactar por WhatsApp" />
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;