import React from 'react'
import './item.css';
import { Link } from 'react-router-dom';
import { toCapital } from '../../helpers/toCapital';

const Item = ( { producto } ) => {
  
  return (
    <div className="producto">
      <img src={producto.images} alt={producto.numero_articulo} />
      <div className='productoInicio'>
            <h4>{producto.numero_articulo}</h4>
            <p>Precio: ${producto.precio_minorista}</p>
            {producto.categorias.map((categoria, index) => (
              <p key={index}>Categoria: {toCapital(categoria)}</p>
            ))}
            <Link className='ver-mas' to={`/item/${producto.id}`}>Detalle</Link>
      </div>
    </div>
  )
}

export default Item