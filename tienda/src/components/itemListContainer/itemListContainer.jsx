import React, { useEffect, useState } from 'react'
import { pedirDatos } from '../../helpers/pedirDatos';
import ItemList from '../itemList/ItemList';
import './itemListContainer.css';

const ItemListContainer = () => {

    const [productos, setProductos] = useState([]);
   
    useEffect(() => {
        pedirDatos()
            .then((res) => {
                setProductos(res);
            })
    }, [])


  return (
    <div>
        <ItemList productos={productos} />
    </div>
  )
}

export default ItemListContainer