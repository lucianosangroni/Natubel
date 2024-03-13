import React, { useEffect, useState } from 'react'
import ItemDetail from '../itemDetail/ItemDetail';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

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
        <p>Cargando...</p>
      )}
    </div>
  )
}

export default ItemDetailContainer