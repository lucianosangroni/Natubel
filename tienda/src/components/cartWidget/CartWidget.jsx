import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cartIcon from "../nabvar/carrito.png";
import "./cartWidget.css";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const CartWidget = () => {

  const { cantidadEnCarrito, flagActualizarWidget } = useContext(CartContext);
  const [ cantidad, setCantidad ] = useState(0)

  useEffect(() => {
    setCantidad(cantidadEnCarrito())
  }, [flagActualizarWidget]);

  return (
    
      <Link className="carrito-container" to="/carrito">
        <img src={cartIcon} alt="Carrito" className="carrito" />
        <p className="contador-carrito">{ cantidad }</p>
      </Link>
    
  );
};

export default CartWidget;
