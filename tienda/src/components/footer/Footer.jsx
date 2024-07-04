import React from "react";
import "./footer.css";
import face from "./facebook.svg";
import insta from "./instagram.svg";

const Footer = () => {
  return (
    <div>
      <div className="footerContainer">
        {/* <div className="contactanos">
          <p>CONTACTANOS</p>
          <div className="mail">
            <img src={mail} alt="mail" />
            <p>gamarrafranco@gmail.com</p>
          </div>
          <div className="tel">
            <img src={telephone} alt="telefono" />
            <p>11 3110-9942</p>
          </div> 
        </div>
        <div className="footerNatubel">
          <h1 className="footerNatubelTitulo">NATUBEL</h1> 
        </div> */}
        <div className="footerNovedades">
          <p>¡ENTERATE DE LAS ULTIMAS NOVEDADES!</p>
          <div className="redes-container">
            <a href="https://www.instagram.com/natubeloficial/" target="_blank" rel="noopener noreferrer">
              <img src={face} alt="facebook" />
            </a>
            <a href="https://www.instagram.com/natubeloficial/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="instagram" />
            </a>
          </div>
        </div>
      </div>
      <div className="copyrigth">
        <p>| Sitio creado por SangroniDev |</p>
      </div>
    </div>
  );
};

export default Footer;
