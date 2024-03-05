import React, { useState } from "react";
import Item from "../item/Item";
import "./itemList.css";
import CategoriasLateral from "../categoriasLateral/CategoriasLateral";
import FiltroColor from "../filtroColor/FiltroColor";
import FiltroTalle from "../filtroTalle/FiltroTalle";
import OrdenarMayorMenor from "../ordenarMayorMenor/OrdenarMayorMenor";


const ItemList = ({ productos, setProductosContainer, flagCatalogo, onChangeColorContainer, onChangeTalleContainer }) => {
  const [visibleProducts, setVisibleProducts] = useState(16);

  const handleLoadMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 16);
  };

  const setProductos = (productosOrdenados) => {
    setProductosContainer(productosOrdenados)
  }

  const handleChangeColor = (color) => {
    onChangeColorContainer(color)
  }

  const handleChangeTalle = (talle) => {
    onChangeTalleContainer(talle)
  }


  return (
    <div>
      <div className="ordenarMayorMenor">
      <OrdenarMayorMenor productos={productos} setProductos={setProductos}/>
      </div>
      <div className="containerItemList">
        <div className="categoriaFiltros">
          <CategoriasLateral />
          {flagCatalogo && (
            <>
              <FiltroColor onChangeColor={handleChangeColor}/>
              <FiltroTalle onChangeTalle={handleChangeTalle} />
            </>
          )}
        </div>
        {productos.length === 0 && (
          <div className="noHayArtContainer">
            <p className="noHayArticulos">En este momento, no hay stock</p>
          </div>
        )}
        <div className="productos">
          {productos.slice(0, visibleProducts).map((prod) => (
            <Item producto={prod} key={prod.id} />
          ))}
        </div>
      </div>
      {visibleProducts < productos.length && (
        <div className="buttonVerMas">
          <button onClick={handleLoadMore}>Ver más</button>
        </div>
      )}
    </div>
  );
};

export default ItemList;