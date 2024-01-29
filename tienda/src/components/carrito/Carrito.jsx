import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./carrito.css";
import { Link } from "react-router-dom";

const Carrito = () => {
  const {
    carrito,
    precioTotal,
    vaciarCarrito,
    cantidadEnCarrito,
    eliminarProducto,
  } = useContext(CartContext);

  const handleVaciar = () => {
    vaciarCarrito();
  };

  const handleEliminarProducto = (productId) => {
    eliminarProducto(productId);
  };

  return (
    <div className="margenes">
      <h1 className="carritoCompras">Carrito de compras</h1>

      <table className="carritoContainer">
        <thead>
          <tr className="encabezadoCarrito">
            <th>Productos</th>
            <th>Color</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((prod) => (
            <tr className="artContainer" key={prod.productoId}>
              <td>{prod.numero_articulo}</td>
              <td>{prod.color}</td>
              <td>{prod.talle}</td>
              <td>{prod.cantidad}</td>
              <td>$10</td>
              <td className="delete-icon">
                <img
                  src="/img/trash.svg"
                  alt="Eliminar"
                  onClick={() => handleEliminarProducto(prod.productoId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="totalContainer"> 
      <p className="cantidadTotal">Cantidad total: {cantidadEnCarrito()}</p>
      <p className="precioTotal">Precio total: ${precioTotal()}</p>
      </div>
      {carrito.length > 0 ? (
        <div className="button-container">
          <Link className="linkForm" to="/formulario">
            Confirmar compra
          </Link>
          <button onClick={handleVaciar}>Vaciar carrito</button>
        </div>
      ) : (
        <div className="carritoVacioContainer">
          <h2 className="carritoVacio">El carrito esta vacio...</h2>
        </div>
      )}
    </div>
  );
};

export default Carrito;
