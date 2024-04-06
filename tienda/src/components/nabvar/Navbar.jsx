import React from "react";
import { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import CartWidget from "../cartWidget/CartWidget";
import MenuDesplegable from "../menuDesplegable/MenuDesplegable";
import whatsapp from "./whatsapp.svg";
import styled from "styled-components";
import BurguerButton from "./BurguerButton";
import { useData } from '../../context/DataContext';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { montoMinimoMayorista, montoMinimoDistribuidor } = useData();

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      {isMobile ? (
        <NavContainer>
          <p className="encabezadoMobile">
            MINIMO DE COMPRAS MAYORISTAS ${formatearNumero(montoMinimoMayorista)} || PARA COMPRAS MAYORES A
            ${formatearNumero(montoMinimoDistribuidor)}. HACE TU PEDIDO Y ESCRIBINOS A NUESTRO WHATSAPP
          </p>
          <div className={`links ${clicked ? "active" : ""}`}>
          <Link onClick={handleClick} to="/">
              Inicio
            </Link>
            <Link onClick={handleClick} to="/catalogo">
              Catalogo
            </Link>
            <Link onClick={handleClick} to="/mayorista">
              Mayorista
            </Link>
          </div>
          <div className="navbarMobileContainer">
            <div className="burguer">
              <BurguerButton clicked={clicked} handleClick={handleClick} />
            </div>
            <BgDiv className={`initial ${clicked ? " active" : ""}`}></BgDiv>
            <div>
              <Link to="/" className="logo">
                <h1>Natubel</h1>
              </Link>
            </div>
            <CartWidget />
          </div>
          <div className="redesWhatsapp">
            <a
              href="https://web.whatsapp.com/send?phone=1131109942"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={whatsapp} alt="Contactar por WhatsApp" />
            </a>
          </div>
        </NavContainer>
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
              <img src={whatsapp} alt="Contactar por WhatsApp" />
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;

const NavContainer = styled.nav`
  padding: 0.4rem;
  background-color: #70848b;
  displey: flex;
  align-items: center;
  justify-content: space-between;

  a {
    color: white;
    text-decoration: none;
    margin-rigth: 1rem;
  }
  .burguer {
    @media (min-width: 768px) {
      display: none;
    }
  }
  .links {
    position: absolute;
    top: -700px;
    left: -2000px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    transition: all 0.5s ease;
    a {
      color: white;
      font-size: 2rem;
      display: block;
    }
    @media (min-width: 768px) {
      position: initial;
      margin: 0;
      a {
        font-size: 1rem;
        color: white;
        display: inline;
      }
      display: block;
    }
  }
  .links.active {
    z-index: 2;
    width: 100%;
    display: block;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 30%;
    left: 0;
    right: 0;
    text-align: center;
    a {
      font-size: 2rem;
      margin-top: 1rem;
      color: white;
    }
  }
  .burguer {
    @media (min-width: 768px) {
      display: none;
    }
  }
`;

const BgDiv = styled.div`
  background-color: #70848b;
  position: absolute;
  top: -1000px;
  left: -1000px;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: all 0.6s ease;

  &.active {
    border-radius: 0 0 80% 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
