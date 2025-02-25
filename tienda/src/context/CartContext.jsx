import { createContext, useEffect, useState } from "react";
import { useData } from "./DataContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [ carrito, setCarrito ] = useState([]);
  const [ cliente, setCliente ] = useState(null)
  const [ selectedPrecios, setSelectedPrecios ] = useState("MINORISTA")
  const { articulosData } = useData();
  const [ flagActualizarWidget, setFlagActualizarWidget ] = useState(0)
  const [ mostrarToastStock, setMostrarToastStock ] = useState(false)

  useEffect(() => {
    const nuevoCarrito = verificarStock()
    setCarrito(nuevoCarrito)
  }, [articulosData])

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
      setCarrito(prevCarrito => {
        const producto = encontrarProducto(numero_articulo, color, talle)
        const estaEnElCarrito = prevCarrito.find(prod => prod.id === producto.id);

        if (estaEnElCarrito) {
          return prevCarrito.map(prod =>
            prod.id === producto.id ? { ...prod, cantidad: prod.cantidad + cantidad } : prod
          );
        } else {
          const nuevoItem = { id: producto.id, numero_articulo, color, talle, cantidad, precio_minorista: producto.articulo.precio_minorista, precio_mayorista: producto.articulo.precio_mayorista, precio_distribuidor: producto.articulo.precio_distribuidor }

          return [...prevCarrito, nuevoItem]
        }
      })    
    }
    setFlagActualizarWidget(flagActualizarWidget + 1)
  };

  const eliminarProducto = (productId) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== productId)
    setCarrito(nuevoCarrito);
    setFlagActualizarWidget(flagActualizarWidget + 1)
    return nuevoCarrito
  }

  const cantidadEnCarrito = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  };

  const precioTotal = (tipoPrecio) => {
    switch(tipoPrecio) {
      case "MINORISTA": return precioTotalMinorista();
      case "MAYORISTA": return precioTotalMayorista();
      case "DISTRIBUIDOR": return precioTotalDistribuidor();
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
    setFlagActualizarWidget(0)
    return []
  };

  const verificarStock = () => {
    let cambioCarrito = false

    for(const cartProduct of carrito) {
      const producto = encontrarProducto(cartProduct.numero_articulo, cartProduct.color, cartProduct.talle)
      if(producto) {
        for(const prod of producto.articulo.productos) {
          if(prod.id === producto.id) {
            if(cartProduct.cantidad > prod.stock) {
              cartProduct.cantidad = prod.stock
              cambioCarrito = true
            }
          }
        }
      } else {
        cartProduct.cantidad = 0
        cambioCarrito = true
      }
    }

    if(cambioCarrito) {
      setFlagActualizarWidget(flagActualizarWidget + 1)
      setMostrarToastStock(true)
    }

    const nuevoCarrito = carrito.filter(prod => prod.cantidad > 0)
    setCarrito(nuevoCarrito)

    return nuevoCarrito
  }

  const tipoPrecios = () => {
    return selectedPrecios
  }
  
  const setTipoPrecios = (precios) => {
    setSelectedPrecios(precios)
  }

  const setClienteCart = (cliente) => {
    setCliente(cliente)
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
        setTipoPrecios,
        cliente,
        setClienteCart,
        flagActualizarWidget,
        mostrarToastStock,
        setMostrarToastStock,
        carrito,
      }}
    >{children}</CartContext.Provider>
  );
};
