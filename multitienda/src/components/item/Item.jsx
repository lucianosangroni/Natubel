import React, { useState, useEffect, useContext } from 'react'
import './item.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const Item = ( { producto } ) => {
  const [precio, setPrecio] = useState(producto.precio_minorista)
  const {
    tipoPrecios
} = useContext(CartContext);

  useEffect(() => {
    const precioNuevo = tipoPrecios() === "MINORISTA" ? producto.precio_minorista : tipoPrecios() === "MAYORISTA" ? producto.precio_mayorista : producto.precio_distribuidor
    setPrecio(precioNuevo)
  }, [tipoPrecios]);

  return (
    <div className="producto">
      <Link to={`/articulo/${producto.id}`} className='imgContainer'>
        {producto.imagens.length > 0 ? (
          <img src={producto.imagens[0].url} alt={"sin imagen"} />
        ) : (
          <img src={`/img/no-hay-foto.png`} alt={"sin imagen"} />
        )}
      </Link>
      <div className='productoInicio'>
        <h4>ART. {producto.numero_articulo}</h4>
        <p><strong>Precio:</strong> ${precio}</p>
        <p className='margenCelu'><strong>Marca:</strong> {producto.marca}</p>
      </div>
    </div>
  );
};

export default Item