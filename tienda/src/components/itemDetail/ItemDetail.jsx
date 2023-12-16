import React from 'react'
import './itemDetail.css';
import { toCapital } from "../../helpers/toCapital"

const ItemDetail = ( {item} ) => {
  return (
    <div className='container'>
        <div className='producto-detalle'>
            <img src={item.images} alt={item.art} />
            <div>
                <h3 className='titulo'>{item.art}</h3>
                <p className='descripcion'>{item.description}</p>
                <p className='categoria'>Categoria: {toCapital(item.category)}</p>
                <p className='precio'>${item.price}</p>
            </div>
        </div>
    </div>
  )
}

export default ItemDetail