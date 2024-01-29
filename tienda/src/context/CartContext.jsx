import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (numero_articulo, color, talle, cantidad, productoId) => {
    const itemAgregado = { numero_articulo, color, talle, cantidad, productoId };

    const nuevoCarrito = [...carrito];
    const estaEnElCarrito = nuevoCarrito.find(
      (articulo) => articulo.numero_articulo === itemAgregado.numero_articulo && articulo.color === itemAgregado.color && articulo.talle === itemAgregado.talle
    );

    if (estaEnElCarrito) {
      estaEnElCarrito.cantidad += cantidad;
    } else {
      nuevoCarrito.push(itemAgregado);
    }
    setCarrito(nuevoCarrito);
  };

  const eliminarProducto = (productId) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== productId)
    setCarrito(nuevoCarrito);
  }

  const cantidadEnCarrito = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  };

  const precioTotal = () => {
    return carrito.reduce((acc, prod) => acc + 10 * prod.cantidad, 0);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarProducto,
        cantidadEnCarrito,
        precioTotal,
        vaciarCarrito,
      }}
    >{children}</CartContext.Provider>
  );
};
