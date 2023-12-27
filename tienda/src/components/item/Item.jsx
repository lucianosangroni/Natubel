import React from 'react'
import './item.css';
import { Link } from 'react-router-dom';
import { toCapital } from '../../helpers/toCapital';

const Item = ( { producto } ) => {
  
  return (
    <div className="producto">
      <img src={producto.images} alt={producto.art} />
      <div className='productoInicio'>
            <h4>{producto.art}</h4>
            <p>Precio: ${producto.price}</p>
            <p>Categoria: {toCapital(producto.category)}</p>
            <Link className='ver-mas' to={`/item/${producto.id}`}>Detalle</Link>
      </div>
    </div>
  )
}

export default Item