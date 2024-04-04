import React from "react";
import "./inicio.css";
import ItemListContainer from "../itemListContainer/itemListContainer";
import UncontrolledExample from "../galeriaImagenes/GaleriaImagenes";
import truck from "./truck.svg";
import creditCard from "./credit-card.svg";
import fileLock from "./file-lock.svg";
import Loading from "../loading/Loading";
import { useData } from "../../context/DataContext";

const Inicio = () => {
  const { isInitialLoading } = useData()

  return (
    <>
      {isInitialLoading && <Loading/>}
      <div>
        <UncontrolledExample />
        <div className="enviamosPagaSeguridad">
          <img src={truck} alt="envios" />
          <div>
            <h3>Enviamos tu compra</h3>
            <p>Entregas a todo el pais</p>
          </div>
          <img src={creditCard} alt="envios" />
          <div>
            <h3>Paga como quieras</h3>
            <p>Tarjeta debito/credito o efectivo</p>
          </div>
          <img src={fileLock} alt="envios" />
          <div>
            <h3>Compra con seguridad</h3>
            <p>Tus datos siempre protegidos</p>
          </div>
        </div>
        <ItemListContainer flagCatalogo={false} /> 
      </div>
    </>
  );
};

export default Inicio;
