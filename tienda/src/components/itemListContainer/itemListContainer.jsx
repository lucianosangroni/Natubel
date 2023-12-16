import React, { useEffect, useState } from 'react'
import { pedirDatos } from '../../helpers/pedirDatos';
import ItemList from '../itemList/ItemList';
import './itemListContainer.css';
import { useParams } from 'react-router-dom';

const ItemListContainer = () => {

    const [productos, setProductos] = useState([]);
    const [titulo, setTitulo] = useState("productos")
    const categoria = useParams().category;
    console.log(categoria)

    useEffect(() => {
        pedirDatos()
            .then((res) => {
              if (categoria){
                setProductos(res.filter((prod) => prod.category === categoria));
                setTitulo(categoria);
              } else {
                setProductos(res);
                setTitulo("productos")
              }             
            })
    }, [categoria])


  return (
    <div>
        <ItemList productos={productos} titulo={titulo} />
    </div>
  )
}

export default ItemListContainer