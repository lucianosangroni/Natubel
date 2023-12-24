import React from "react";
import { Link } from "react-router-dom";
import cartIcon from "../nabvar/carrito.png";
import "./cartWidget.css";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const CartWidget = () => {

    const { cantidadEnCarrito } = useContext(CartContext);

  return (
    
      <Link className="carrito-container" to="/carrito">
        <img src={cartIcon} alt="Carrito" className="carrito" />
        <span className="contador-carrito">{ cantidadEnCarrito() }</span>
      </Link>
    
  );
};

export default CartWidget;
