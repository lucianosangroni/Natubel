import React, { useEffect, useState } from "react";
import { pedirDatos } from "../../helpers/pedirDatos";
import ItemList from "../itemList/ItemList";
import "./itemListContainer.css";
import { useParams } from "react-router-dom";

const ItemListContainer = ({ flagCatalogo, productos, filtroMayorPrecio, filtroMenorPrecio, filtroMasVendidos }) => {
  const [productosPorCategoria, setProductosPorCategoria] = useState([]);
  //const [productosPorColor, setProductosPorColor] = useState([]);
  //const [productosPorTalle, setProductosPorTalle] = useState([]);
  const category = useParams().categoria;
  //const color = useParams().color;
  //const talle = useParams().talle;

  //catalogo/categoria=blabla&color=blabla&talle=blabla

  useEffect(() => {
    pedirDatos().then((res) => {
      if (category) {
        setProductosPorCategoria(res.filter((prod) => prod.category === category));
      } else {
        setProductosPorCategoria(res);
      } 
      //if (color) {
      //  setProductosPorColor(productosPorCategoria.filter((prod) => prod.color === color));
      //} else {
      //  setProductosPorColor(productosPorCategoria)
      //}
//
      //if (talle) {
      //  setProductosPorTalle(productosPorColor.filter((prod) => prod.talle === talle));
      //} else {
      //  setProductosPorTalle(productosPorColor)
      //}
    });
  }, [category, filtroMayorPrecio, filtroMenorPrecio, filtroMasVendidos, productos/*, color, talle*/]);

  return (
    <div>
      <ItemList productos={productosPorCategoria} flagCatalogo={flagCatalogo} />
    </div>
  );
};

export default ItemListContainer;
