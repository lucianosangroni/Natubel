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
    verificarStock,
    tipoPrecios,
    setTipoPrecios
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])
  const [ selectedPrecios, setSelectedPrecios ] = useState("minorista")

  const handleVaciar = () => {
    const shouldVaciar = window.confirm(
      `¿Estas seguro que quieres vaciar el carrito?`
    );
    if (!shouldVaciar) {
      return;
    }

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

    const precios = tipoPrecios()
    setSelectedPrecios(precios)
  }, []);

  const handlePreciosChange = (tipoPrecios) => {
    setTipoPrecios(tipoPrecios)
    setSelectedPrecios(tipoPrecios)
  } 

  return (
    <div className="margenes">
      {carrito.length > 0 ? (
        <> 
          <h1 className="carritoCompras">Carrito de compras</h1>
          <button className={selectedPrecios === "minorista" ? "btnPrecios btnPreciosSelected" : "btnPrecios"} onClick={() => handlePreciosChange("minorista")}>Minorista</button>
          <button className={selectedPrecios === "mayorista" ? "btnPrecios btnPreciosSelected" : "btnPrecios"} onClick={() => handlePreciosChange("mayorista")}>Mayorista</button>
          <button className={selectedPrecios === "distribuidor" ? "btnPrecios btnPreciosSelected" : "btnPrecios"} onClick={() => handlePreciosChange("distribuidor")}>Distribuidor</button>
          {selectedPrecios === "mayorista" && (
            <span className="compraMinima">Compra minima: $25.000</span>
          )}
          {selectedPrecios === "distribuidor" && (
            <span className="compraMinima">Compra minima: $200.000</span>
          )}
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
                  <td>$
                    {(() => {
                      switch (selectedPrecios) { 
                        case "minorista":
                          return prod.cantidad * prod.precio_minorista;
                        case "mayorista":
                          return prod.cantidad * prod.precio_mayorista;
                        case "distribuidor":
                          return prod.cantidad * prod.precio_distribuidor;
                        default:
                          return prod.cantidad * prod.precio;
                      }
                    })()}
                  </td>
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
          <p className="precioTotal">Precio total: ${precioTotal(selectedPrecios)}</p>
          </div>
          <div className="button-container">
            <Link className="linkForm" to="/formulario">
              Confirmar compra
            </Link>
            <button onClick={handleVaciar}>Vaciar carrito</button>
          </div>
        </>
      ) : (
        <div className="carritoVacioContainer">
          <h2 className="carritoVacio">El carrito esta vacio...</h2>
        </div>
      )}
    </div>
  );
};

export default Carrito;
