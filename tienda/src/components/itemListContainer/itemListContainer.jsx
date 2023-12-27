import React, { useEffect, useState } from 'react'
import { pedirDatos } from '../../helpers/pedirDatos';
import ItemList from '../itemList/ItemList';
import './itemListContainer.css';
import { useParams } from 'react-router-dom';

const ItemListContainer = () => {

    const [productos, setProductos] = useState([]);
    const [titulo, setTitulo] = useState("Productos")
    const category = useParams().categoria;
    const color = useParams().color

    useEffect(() => {
        pedirDatos()
            .then((res) => {
              if (category){
                setProductos(res.filter((prod) => prod.category === category));
                setTitulo(category);
              } else {
                setProductos(res);
                setTitulo("productos")
              }      
              if (color) {
                setProductos(res.filter((prod) => prod.color === color));
                setTitulo(color);
              }  else {
                setProductos(res);
                setTitulo("productos")
              }         
            })
    }, [category, color])


  return (
    <div>
        <ItemList productos={productos} titulo={titulo} />
    </div>
  )
}

export default ItemListContainer