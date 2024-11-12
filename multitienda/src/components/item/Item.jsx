import React from 'react'
import './item.css';
import { Link } from 'react-router-dom';

const Item = ( { producto } ) => {
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
        <p>Precio: ${producto.precio_mayorista}</p>
        <p>Marca: {producto.marca}</p>
      </div>
    </div>
  );
};

export default Item