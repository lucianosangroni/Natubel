import React from "react";
import Item from "../item/Item";
import "./itemList.css";
import CategoriasLateral from "../categoriasLateral/CategoriasLateral";
import FiltroColor from "../filtroColor/FiltroColor";
import FiltroTalle from "../filtroTalle/FiltroTalle";

const ItemList = ({ productos, titulo }) => {
  return (
    <div className="containerItemList">
            
      <div className="productos">
      <CategoriasLateral />
      <FiltroColor />
      <FiltroTalle />
        {productos.map((prod) => (
          <Item producto={prod} key={prod.id} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
