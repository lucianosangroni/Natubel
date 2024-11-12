import "./listasDePrecios.css";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext.jsx";
import { useData } from '../../context/DataContext';

const ListasDePrecios = ({  }) => {
    const {
        tipoPrecios,
        setTipoPrecios
    } = useContext(CartContext);

    const { montoMinimoMayorista, montoMinimoDistribuidor } = useData();
    
    const [ selectedPrecios, setSelectedPrecios ] = useState(tipoPrecios())

    const formatearNumero = (numero) => {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        setSelectedPrecios(tipoPrecios())
    }, [tipoPrecios]);

    const handlePreciosChange = (tipoPrecios) => {
        setTipoPrecios(tipoPrecios);
        setSelectedPrecios(tipoPrecios);
    };

    return (
        <>
            <div className="explicacion-precios-container">
                <p className="explicacion-precios">El catalogo muestra la lista de precios: {selectedPrecios} 
                    <br></br>
                    El monto mínimo de una compra mayorista es de ${formatearNumero(montoMinimoMayorista)} y el monto minimo de una compra de 
                    distribuidor es de ${formatearNumero(montoMinimoDistribuidor)} 
                    <br></br>
                    Si ya has hecho una compra previa con una lista de precios mayor no será necesario volver a llegar al monto,
                    debes realizar una compra ingresando el mismo email que ingresaste en tu compra previa y podrás acceder a la lista de precios de tu compra más alta
                </p>
                <div className="buttons-precios-container">
                    <button className={
                                tipoPrecios() === "MINORISTA"
                                    ? "button-precio button-precio-selected"
                                    : "button-precio"
                            }
                            onClick={() => handlePreciosChange("MINORISTA")}
                            >MINORISTA
                    </button>
                    <button className={
                                tipoPrecios() === "MAYORISTA"
                                    ? "button-precio button-precio-selected"
                                    : "button-precio"
                            }onClick={() => handlePreciosChange("MAYORISTA")}
                            >MAYORISTA
                    </button>
                    <button className={
                                tipoPrecios() === "DISTRIBUIDOR"
                                    ? "button-precio button-precio-selected"
                                    : "button-precio"
                            }onClick={() => handlePreciosChange("DISTRIBUIDOR")}
                            >DISTRIBUIDOR
                    </button>
                </div>
            </div>
        </>
    );
};

export default ListasDePrecios;
