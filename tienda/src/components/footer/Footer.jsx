import React from "react";
import "./footer.css";
import telephone from "./telephone.svg";
import mail from "./mail.svg";
import map from "./map.svg";
import face from "./facebook.svg";
import insta from "./instagram.svg";

const Footer = () => {
  return (
    <div>
      <div className="footerContainer">
        <div className="contactanos">
          <p>CONTACTANOS</p>
          <div className="tel">
            <img src={telephone} alt="telefono" />
            <p>11 - 3467 4234</p>
          </div>
          <div className="mail">
            <img src={mail} alt="mail" />
            <p>gamarrafranco@gmail.com</p>
          </div>
          <div className="dir">
            <img src={map} alt="ubicacion" />
            <p>Alsina 833 CABA</p>
          </div>
        </div>
        <div className="footerNatubel">
          <h1 className="footerNatubelTitulo">NATUBEL</h1>
        </div>
        <div className="footerNovedades">
          <p>ENTERATE DE LAS ULTIMAS NOVEDADES!</p>
          <div>
            <a href="https://www.instagram.com/natubeloficial/" target="_blank" rel="noopener noreferrer">
              <img className="redesFace" src={face} alt="facebook" />
            </a>
            <a href="https://www.instagram.com/natubeloficial/" target="_blank" rel="noopener noreferrer">
              <img className="redesInsta" src={insta} alt="instagram" />
            </a>
          </div>
        </div>
      </div>
      <div className="copyrigth">
        <p>| Sitio creado por EvoTech |</p>
      </div>
    </div>
  );
};

export default Footer;