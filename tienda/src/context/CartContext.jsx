import { createContext, useState } from "react";
import { useData } from "./DataContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [ carrito, setCarrito ] = useState([]);
  const [ selectedPrecios, setSelectedPrecios ] = useState("minorista")
  const { articulosData } = useData();

  const encontrarProducto = (numero_articulo, color, talle) => {
    for (const art of articulosData) {
      if (art.numero_articulo === numero_articulo) {
          for(const prod of art.productos) {
            if(prod.color === color && prod.talle === talle) {
              return { id: prod.id, articulo: {...art} }
            }
          }
          return null;
      }
    }
    return null;
  }

  const agregarAlCarrito = ( numero_articulo, color, talle, cantidad ) => {
    if(cantidad > 0) {
      const producto = encontrarProducto(numero_articulo, color, talle)

      const nuevoCarrito = [...carrito];
      const estaEnElCarrito = nuevoCarrito.find(prod => prod.id === producto.id);

      if (estaEnElCarrito) {
        estaEnElCarrito.cantidad += cantidad;
      } else {
        const nuevoItem = { id: producto.id, numero_articulo, color, talle, cantidad, precio_minorista: producto.articulo.precio_minorista, precio_mayorista: producto.articulo.precio_mayorista, precio_distribuidor: producto.articulo.precio_distribuidor }

        nuevoCarrito.push(nuevoItem);
      }
      setCarrito(nuevoCarrito);
    }
  };

  const eliminarProducto = (productId) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== productId)
    setCarrito(nuevoCarrito);
    return nuevoCarrito
  }

  const cantidadEnCarrito = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  };

  const precioTotal = (tipoPrecio) => {
    switch(tipoPrecio) {
      case "minorista": return precioTotalMinorista();
      case "mayorista": return precioTotalMayorista();
      case "distribuidor": return precioTotalDistribuidor();
    }
  };

  const precioTotalMinorista = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio_minorista, 0);
  }

  const precioTotalMayorista = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio_mayorista, 0);
  }

  const precioTotalDistribuidor = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio_distribuidor, 0);
  }

  const vaciarCarrito = () => {
    setCarrito([]);
    return []
  };

  const verificarStock = () => {
    let flagAlertCambioCarrito = false;

    for(const cartProduct of carrito) {
      const producto = encontrarProducto(cartProduct.numero_articulo, cartProduct.color, cartProduct.talle)
      for(const prod of producto.articulo.productos) {
        if(prod.id === producto.id) {
          if(cartProduct.cantidad > prod.stock) {
            cartProduct.cantidad = prod.stock
            flagAlertCambioCarrito = true
          }
        }
      }
    }

    if(flagAlertCambioCarrito) {
      alert("Las cantidades de algunos productos de su carrito cambiaron por falta de stock. Por favor verifique su pedido")
    }

    return carrito
  }

  const tipoPrecios = () => {
    return selectedPrecios
  }
  
  const setTipoPrecios = (precios) => {
    setSelectedPrecios(precios)
  }

  return (
    <CartContext.Provider
      value={{
        agregarAlCarrito,
        eliminarProducto,
        cantidadEnCarrito,
        precioTotal,
        precioTotalMayorista,
        precioTotalDistribuidor,
        vaciarCarrito,
        verificarStock,
        tipoPrecios,
        setTipoPrecios
      }}
    >{children}</CartContext.Provider>
  );
};
