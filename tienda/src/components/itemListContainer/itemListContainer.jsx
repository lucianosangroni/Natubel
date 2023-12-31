import React, { useEffect, useState } from "react";
import { pedirDatos } from "../../helpers/pedirDatos";
import ItemList from "../itemList/ItemList";
import "./itemListContainer.css";
import { useParams } from "react-router-dom";

const ItemListContainer = ({ flagCatalogo }) => {
  const [productos, setProductos] = useState([]);
  const [color, setColor] = useState(null)
  const [talle, setTalle] = useState(null)
  const category = useParams().categoria;

  useEffect(() => {
    pedirDatos().then((res) => {
      let productosFiltrados = res;

      if (category) {
        productosFiltrados = productosFiltrados.filter((prod) => prod.category === category)    
      } 
      if (color) {
        productosFiltrados = productosFiltrados.filter((prod) => prod.colores.includes(color));
      } 
      if (talle) {
        productosFiltrados = productosFiltrados.filter((prod) => prod.talles.includes(talle));
      }

      setProductos(productosFiltrados)
    });
  }, [category, color, talle]);

  const handleSetProductos = (productosOrdenados) => {
    setProductos(productosOrdenados)
  }

  const handleChangeColor = (color) => {
    setColor(color)
  }

  const handleChangeTalle = (talle) => {
    setTalle(talle)
  }

  return (
    <div>
      <ItemList productos={productos} flagCatalogo={flagCatalogo} setProductosContainer={handleSetProductos} onChangeColorContainer={handleChangeColor} onChangeTalleContainer={handleChangeTalle} />
    </div>
  );
};

export default ItemListContainer;
