import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Navigate } from "react-router-dom";
import "./carrito.css";
import Alert from "react-bootstrap/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useData } from '../../context/DataContext';
import Loading from "../loading/Loading";

const Carrito = () => {
  const {
    precioTotal,
    vaciarCarrito,
    cantidadEnCarrito,
    eliminarProducto,
    verificarStock,
    tipoPrecios,
    setTipoPrecios,
    mostrarToastPrecios,
    setMostrarToastPrecios,
    mostrarToastStock,
    setMostrarToastStock,
  } = useContext(CartContext);

  const { montoMinimoMayorista, montoMinimoDistribuidor, isInitialLoading } = useData();

  const [ carrito, setCarrito ] = useState([])
  const [ selectedPrecios, setSelectedPrecios ] = useState("MINORISTA")
  const [ shouldRedirect, setShouldRedirect ] = useState(false)
  const [ showVaciarAlert, setShowVaciarAlert ] = useState(false)

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
    const nuevoCarrito = verificarStock();
    
    const carritoOrdenado = nuevoCarrito.sort((a, b) => ordenarProductos(a, b))


    setCarrito(nuevoCarrito);

    const precios = tipoPrecios();
    setSelectedPrecios(precios);

    if(mostrarToastPrecios) {
      toast.error(`El monto de su pedido no corresponde con la lista de precios. Por favor verifique su pedido con los precios de ${tipoPrecios().toLowerCase()}.`, {
        position: "top-center",
        hideProgressBar: true,
        autoClose: 4000, 
        closeButton: false,
      });
      setMostrarToastPrecios(false)
    }
  }, []);

  const ordenarProductos = (a, b) => {
    const obtenerNumero = numArticulo => parseInt(numArticulo.match(/\d+/)[0]);
    const obtenerLetra = numArticulo => {
      const letra = (numArticulo.match(/[A-Za-z]/) || [])[0];
      return letra ? letra.toUpperCase() : letra;
    };
    const ordenLetras = { 'UNICO': 0, 'E': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7, 'XXXXL': 8, 'XXXXXL': 9 };

    const numeroA = obtenerNumero(a.numero_articulo)
    const letraA = obtenerLetra(a.numero_articulo)
    const numeroB = obtenerNumero(b.numero_articulo)
    const letraB = obtenerLetra(b.numero_articulo)

    if (numeroA !== numeroB) {
      return numeroA - numeroB;
    }

    if(letraA !== letraB) {
      if (letraA && letraB) {
        return ordenLetras[letraA] - ordenLetras[letraB];
      } else if (letraA) {
        return 1;
      } else if (letraB) {
        return -1;
      }
    }

    const talleA = a.talle.toUpperCase();
    const talleB = b.talle.toUpperCase();
    const esNumeroA = !isNaN(parseInt(a.talle));
    const esNumeroB = !isNaN(parseInt(b.talle));
    
    if(talleA !== talleB) {
      if (esNumeroA && esNumeroB) {
        return parseInt(a.talle) - parseInt(b.talle);
      } else if (esNumeroA) {
        return 1;
      } else if (esNumeroB) {
        return -1;
      }

      return ordenLetras[talleA] - ordenLetras[talleB];
    }
    
    const colorA = a.color.toUpperCase()
    const colorB = b.color.toUpperCase()
    return colorA.localeCompare(colorB)
  }

  useEffect(() => {
    if(mostrarToastStock) {
      toast.warning(`Las cantidades de algunos productos de su carrito cambiaron por falta de stock. Por favor verifique su pedido.`, {
        position: "top-center",
        hideProgressBar: true,
        autoClose: 4000, 
        closeButton: false,
      });
      setMostrarToastStock(false)
    }
  }, [mostrarToastStock]);

  const handlePreciosChange = (tipoPrecios) => {
    setTipoPrecios(tipoPrecios);
    setSelectedPrecios(tipoPrecios);
  };

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleConfirmarCompra = () => {
    setShouldRedirect(true);
  };

  return (
    <div className="margenes">
      {isInitialLoading && <Loading/>}
      <ToastContainer position="top-right" hideProgressBar={false}/>
      {shouldRedirect && <Navigate to="/formulario" />}
      {carrito.length > 0 ? (
        <>
          <div className="descripcionPreciosContainer">
            {selectedPrecios === "MAYORISTA" && (
              <p className="compraMinima">
                Para esta lista de precios se requiere una compra minima de ${formatearNumero(montoMinimoMayorista)} o haber hecho previamente una compra mayorista.
              </p>
            )}
            {selectedPrecios === "DISTRIBUIDOR" && (
              <p className="compraMinima">Para esta lista de precios se requiere una compra minima de ${formatearNumero(montoMinimoDistribuidor)} o haber hecho previamente una compra de distribuidor.</p>
            )}
          </div>
          <div className="listaPreciosContainer">
            <h1 className="listaPreciosTitulo">Lista de precios: </h1>
            <button
              className={
                selectedPrecios === "MINORISTA"
                  ? "btnPrecios btnPreciosSelected"
                  : "btnPrecios"
              }
              onClick={() => handlePreciosChange("MINORISTA")}
            >
              MINORISTA
            </button>
            <button
              className={
                selectedPrecios === "MAYORISTA"
                  ? "btnPrecios btnPreciosSelected"
                  : "btnPrecios"
              }
              onClick={() => handlePreciosChange("MAYORISTA")}
            >
              MAYORISTA
            </button>
            <button
              className={
                selectedPrecios === "DISTRIBUIDOR"
                  ? "btnPrecios btnPreciosSelected"
                  : "btnPrecios"
              }
              onClick={() => handlePreciosChange("DISTRIBUIDOR")}
            >
              DISTRIBUIDOR
            </button>
          </div>
          <table className="carritoContainer">
            <thead>
              <tr className="encabezadoCarrito">
                <th>Articulo</th>
                <th>Talle</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((prod) => (
                <tr className="artContainer" key={prod.id}>
                  <td>ART. {prod.numero_articulo}</td>
                  <td>{prod.talle.toUpperCase()}</td>
                  <td>{prod.color.toUpperCase()}</td>
                  <td>{formatearNumero(prod.cantidad)}</td>
                  <td>
                    $
                    {(() => {
                      switch (selectedPrecios) {
                        case "MINORISTA":
                          return formatearNumero(
                            prod.cantidad * prod.precio_minorista
                          );
                        case "MAYORISTA":
                          return formatearNumero(
                            prod.cantidad * prod.precio_mayorista
                          );
                        case "DISTRIBUIDOR":
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
          <div className={`alertContainer ${showVaciarAlert ? 'active' : ''}`}>
            {showVaciarAlert && (
              <Alert
                className="alertVaciar"
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
