import React from 'react'
import Item from '../item/Item'
import './itemList.css';

const ItemList = ( {productos} ) => {
  return (
    <div className='productos'>
        { productos.map((prod) => <Item producto={prod} key={prod.id} />)}
    </div>
  )
}

export default ItemList