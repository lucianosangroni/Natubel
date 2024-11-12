import React from "react";
import "./inicio.css";
import ItemListContainer from "../itemListContainer/itemListContainer";
import UncontrolledExample from "../galeriaImagenes/GaleriaImagenes";
import truck from "./truck.svg";
import Loading from "../loading/Loading";
import { useData } from "../../context/DataContext";

const Inicio = () => {
  const { isInitialLoading } = useData()

  return (
    <>
      {isInitialLoading && <Loading/>}
      <div style={{ marginTop: "1rem" }}>
        <UncontrolledExample />
        <div className="enviamosPagaSeguridad">
          <div className="slide-container">
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
            <div className="a">
              <img src={truck} alt="envios" />
              <div>
                <h3>Enviamos tu compra</h3>
                <p>Entregas a todo el país</p>
              </div>
              <img className="imgCelSlide" src={truck} alt="envios" />
            </div>
          </div>
        </div>
        <ItemListContainer flagCatalogo={false} /> 
      </div>
    </>
  );
};

export default Inicio;
