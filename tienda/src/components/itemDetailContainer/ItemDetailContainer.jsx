import React, { useEffect, useState } from 'react'
import ItemDetail from '../itemDetail/ItemDetail';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import "../itemDetailContainer/itemDetailContainer.css"


const ItemDetailContainer = () => {
    const [item, setItem] = useState(null);
    const { articulosData } = useData();
    const id = useParams().id;
    
    useEffect(() => {
      const articuloSeleccionado = articulosData.find(articulo => parseInt(articulo.id) === parseInt(id))

      setItem(articuloSeleccionado)
    }, [id, articulosData])


  return (
    <div>
      {item ? (
        <ItemDetail item={item} />
      ) : (
        <div className='volverContainer'>
        <p className='volver'>Cargando...</p>
        </div>
      )}
    </div>
  )
}

export default ItemDetailContainer