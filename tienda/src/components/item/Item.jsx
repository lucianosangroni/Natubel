import React from 'react'
import './item.css';
import { Link } from 'react-router-dom';

const Item = ( { producto } ) => {
  return (
    <div className="producto">
      <div className='imgContainer'>
        {producto.imagens.length > 0 ? (
          <img src={producto.imagens[0].url} alt={"sin imagen"} />
        ) : (
          <img src={`/img/no-hay-foto.png`} alt={"sin imagen"} />
        )}
      </div>
      <div className='productoInicio'>
            <h4>ART. {producto.numero_articulo}</h4>
            <p>Precio: ${producto.precio_minorista}</p>
            <Link className='ver-mas' to={`/articulo/${producto.id}`}>Detalle</Link>
      </div>
    </div>
  )
}

export default Item