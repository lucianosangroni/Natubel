import React, { useEffect, useState } from 'react'
import { pedirItemPorId, pedirTodosLosProductos } from '../../helpers/pedirDatos';
import ItemDetail from '../itemDetail/ItemDetail';
import { useParams } from 'react-router-dom';


const ItemDetailContainer = () => {
    const [item, setItem] = useState(null);
    const [productos, setProductos] = useState([]);
    const id = useParams().id;
    
    useEffect(() => {
        pedirTodosLosProductos()
          .then((productos) => {
            setProductos(productos)
          })
          .catch((error) => {
            console.error("Error al obtener todos los productos", error);
          })


      pedirItemPorId(Number(id))
        .then((res) => {
          setItem(res);
            })
    }, [id])


  return (
    <div>
      {item ? (
        <ItemDetail item={item} productos={productos} />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  )
}

export default ItemDetailContainer