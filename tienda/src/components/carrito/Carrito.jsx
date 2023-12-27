import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./carrito.css";

const Carrito = () => {
  const { carrito, precioTotal, vaciarCarrito, cantidadEnCarrito} = useContext(CartContext);

  const handleVaciar = () => {
    vaciarCarrito();
  };

  return (
    <div>
    <h1 className="main-title">Carrito de compras</h1>

    <table className="carritoContainer">
      <thead>
        <tr className="encabezadoCarrito">
            <th>Productos</th>
            <th>Color</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio</th>
        </tr>
          </thead>
          <tbody>
      {carrito.map((prod) => (
        <tr className="artContainer" key={prod.id}>
            <td>{prod.art}</td>
            <td>{prod.sizes}</td>
            <td>{prod.color}</td>
            <td>{prod.cantidad}</td>
            <td>${prod.price}</td>
        </tr>
      ))}
      {carrito.length > 0 ? (
        <div className="button-container">
            <p>Cantidad total: ${cantidadEnCarrito()}</p>
          <p>Precio total: ${precioTotal()}</p>
          <button  >Confirmar compra</button>
          <button  onClick={handleVaciar}>Vaciar carrito</button>
        </div>
      ) : (
        <h2>El carrito esta vacio</h2>
      )}
      </tbody>
    </table>
    </div>
  );
};

export default Carrito;
