import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Navigate } from "react-router-dom";
import "./carrito.css";
import Alert from "react-bootstrap/Alert";

const Carrito = () => {
  const {
    precioTotal,
    precioTotalMayorista,
    precioTotalDistribuidor,
    vaciarCarrito,
    cantidadEnCarrito,
    eliminarProducto,
    verificarStock,
    tipoPrecios,
    setTipoPrecios,
  } = useContext(CartContext);

  const [ compraMinimaMayorista ] = useState(25000)
  const [ compraMinimaDistribuidor ] = useState(200000)
  const [ carrito, setCarrito ] = useState([])
  const [ selectedPrecios, setSelectedPrecios ] = useState("minorista")
  const [ shouldRedirect, setShouldRedirect ] = useState(false)

  const handleVaciar = () => {
    setShowVaciarAlert(true);
  };

  const vaciarCarritoYActualizar = () => {
    const nuevoCarrito = vaciarCarrito();
    setCarrito(nuevoCarrito);
  };

  const handleEliminarProducto = (productId) => {
    const nuevoCarrito = eliminarProducto(productId);
    setCarrito(nuevoCarrito);
  };

  useEffect(() => {
    setShouldRedirect(false);

    const nuevoCarrito = verificarStock();
    setCarrito(nuevoCarrito);

    const precios = tipoPrecios();
    setSelectedPrecios(precios);
  }, []);

  const handlePreciosChange = (tipoPrecios) => {
    setTipoPrecios(tipoPrecios);
    setSelectedPrecios(tipoPrecios);
  };

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleConfirmarCompra = () => {
    let tipoPedidor;

    if (precioTotalMayorista() < compraMinimaMayorista) {
      tipoPedidor = "minorista";
    } else if (
      precioTotalMayorista() >= compraMinimaMayorista &&
      precioTotalDistribuidor() < compraMinimaDistribuidor
    ) {
      tipoPedidor = "mayorista";
    } else if (precioTotalDistribuidor() >= compraMinimaDistribuidor) {
      tipoPedidor = "distribuidor";
    }

    if (tipoPedidor !== selectedPrecios) {
      setShowPrecioAlert(true);
      setTipoPrecios(tipoPedidor);
      setSelectedPrecios(tipoPedidor);
    } else {
      setShouldRedirect(true);
    }
  };

  return (
    <div className="margenes">
      {shouldRedirect && <Navigate to="/formulario" />}
      {carrito.length > 0 ? (
        <>
          <h1 className="carritoCompras">Carrito de compras</h1>
          <button
            className={
              selectedPrecios === "minorista"
                ? "btnPrecios btnPreciosSelected"
                : "btnPrecios"
            }
            onClick={() => handlePreciosChange("minorista")}
          >
            Minorista
          </button>
          <button
            className={
              selectedPrecios === "mayorista"
                ? "btnPrecios btnPreciosSelected"
                : "btnPrecios"
            }
            onClick={() => handlePreciosChange("mayorista")}
          >
            Mayorista
          </button>
          <button
            className={
              selectedPrecios === "distribuidor"
                ? "btnPrecios btnPreciosSelected"
                : "btnPrecios"
            }
            onClick={() => handlePreciosChange("distribuidor")}
          >
            Distribuidor
          </button>
          {selectedPrecios === "mayorista" && (
            <span>
              Compra minima: ${formatearNumero(compraMinimaMayorista)}
            </span>
          )}
          {selectedPrecios === "distribuidor" && (
            <span>
              Compra minima: ${formatearNumero(compraMinimaDistribuidor)}
            </span>
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
                  <td>{formatearNumero(prod.cantidad)}</td>
                  <td>
                    $
                    {(() => {
                      switch (selectedPrecios) {
                        case "minorista":
                          return formatearNumero(
                            prod.cantidad * prod.precio_minorista
                          );
                        case "mayorista":
                          return formatearNumero(
                            prod.cantidad * prod.precio_mayorista
                          );
                        case "distribuidor":
                          return formatearNumero(
                            prod.cantidad * prod.precio_distribuidor
                          );
                      }
                    })()}
                  </td>
                  <td className="delete-icon" style={{padding: "0"}}>
                    <img className="delete-icon-img"
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
            <p className="cantidadTotal">
              Cantidad total: {formatearNumero(cantidadEnCarrito())}
            </p>
            <p className="precioTotal">
              Precio total: ${formatearNumero(precioTotal(selectedPrecios))}
            </p>
          </div>
          <div className="button-container">
            <button
              className="linkForm"
              onClick={() => handleConfirmarCompra()}
            >
              Confirmar compra
            </button>
            <button onClick={handleVaciar}>Vaciar carrito</button>
          </div>
          <div className="alertContainer">
            {showPrecioAlert && (
              <Alert
                variant="danger"
                onClose={() => {
                  setShowPrecioAlert(false);
                }}
                dismissible
              >
                El monto de su pedido no corresponde con la lista de precios.
                Por favor verifique su pedido con los precios correspondientes.
              </Alert>
            )}
            {showVaciarAlert && (
              <Alert
                variant="danger"
                onClose={() => {
                  setShowVaciarAlert(false);
                }}
              >
                <p>¿Estás seguro de que deseas vaciar el carrito?</p>
                <div>
                  <button className="aceptarVaciar"
                    onClick={() => {
                      setShowVaciarAlert(false);
                      vaciarCarritoYActualizar();
                    }}
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => {
                      setShowVaciarAlert(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </Alert>
            )}
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
