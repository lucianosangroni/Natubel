import React from 'react'
import './item.css';
import { Link } from 'react-router-dom';
import { toCapital } from '../../helpers/toCapital';

const Item = ( { producto } ) => {
  console.log(producto)
  return (
    <div className="producto">
      {producto.imagens.length > 0 ? (
        <img src={producto.imagens[0].url} alt={"sin imagen"} />
      ) : (
        <img src={"http://localhost:3001/no-hay-foto.png"} alt={"sin imagen"} />
      )}
      <div className='productoInicio'>
            <h4>{producto.numero_articulo}</h4>
            <p>Precio: ${producto.precio_minorista}</p>
            {producto.categoria.map((cat, index) => (
              <p key={index}>Categoria: {toCapital(cat.nombre)}</p>
            ))}
            <Link className='ver-mas' to={`/item/${producto.id}`}>Detalle</Link>
      </div>
    </div>
  )
}

export default Item