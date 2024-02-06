import React from "react";
import { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import CartWidget from "../cartWidget/CartWidget";
import MenuDesplegable from "../menuDesplegable/MenuDesplegable";
import whatsapp from "./whatsapp.svg";
import styled from "styled-components";
import BurguerButton from "./BurguerButton";

const Navbar = () => {
  const [clicked, setClicked ] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    setClicked(!clicked)
  }

  return (
    <>
      {isMobile ? (
        <NavContainer>
          <div className={ `links ${clicked ? "active" : ""}` } >
            <a href="/">Inicio</a>
            <a href="/">Catalogo</a>
            <a href="/">Categorias</a>
            <a href="/">Mayorista</a>
          </div>
          <div className="burguer">
          <BurguerButton clicked={clicked} handleClick = {handleClick}/>
          </div>
          
        </NavContainer>
      ) : (
        <>
          <p className="encabezado">
            MINIMO DE COMPRAS MAYORISTAS $25.000 || PARA COMPRAS MAYORES A
            $200.000. HACE TU PEDIDO Y ESCRIBINOS A NUESTRO WHATSAPP
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
  padding: .4rem;
  background-color: #FBCCD2;
  displey: flex;
  align-items: center;
  justify-content: space-between;

  a {
    color: white;
    text-decoration: none;
    margin-rigth: 1rem;
  }
  .burguer {
    @media(min-width: 768px){
      display: none;
    }
  }
  .links{
    position: absolute;
    top: -700px;
    left: -2000px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    transition: all .5s ease;
    a{
      color: white;
      font-size: 2rem;
      display: block;
    }
    @media(min-width: 768px){
      position: initial;
      margin: 0;
      a{
        font-size: 1rem;
        color: white;
        display: inline;
      }
      display: block;
    }
  }
  .links.active{
    z-index: 1;
    width: 100%;
    display: block;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 30%;
    left: 0;
    right: 0;
    text-align: center;
    a{
      font-size: 2rem;
      margin-top: 1rem;
      color: white;
    }
  }
`;
