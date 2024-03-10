import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import "./carrito.css";
import { Link } from "react-router-dom";

const Carrito = () => {
  const {
    precioTotal,
    vaciarCarrito,
    cantidadEnCarrito,
    eliminarProducto,
    verificarStock
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])

  const handleVaciar = () => {
    const nuevoCarrito = vaciarCarrito();
    setCarrito(nuevoCarrito)
  };

  const handleEliminarProducto = (productId) => {
    const nuevoCarrito = eliminarProducto(productId);
    setCarrito(nuevoCarrito)
  };

  useEffect(() => {
    const nuevoCarrito = verificarStock()
    setCarrito(nuevoCarrito)
  }, []);

  return (
    <div className="margenes">
      <h1 className="carritoCompras">Carrito de compras</h1>

      <table className="carritoContainer">
        <thead>
          <tr className="encabezadoCarrito">
            <th>Articulo</th>
            <th>Color</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((prod) => (
            <tr className="artContainer" key={prod.id}>
              <td>ART. {prod.numero_articulo}</td>
              <td>{prod.color}</td>
              <td>{prod.talle}</td>
              <td>{prod.cantidad}</td>
              <td>{prod.cantidad * prod.precio}</td>
              <td className="delete-icon">
                <img
                  src="/img/trash.svg"
                  alt="Eliminar"
                  onClick={() => handleEliminarProducto(prod.id)}
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
