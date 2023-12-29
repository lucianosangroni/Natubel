import React, { useState } from "react";
import Item from "../item/Item";
import "./itemList.css";
import CategoriasLateral from "../categoriasLateral/CategoriasLateral";
import FiltroColor from "../filtroColor/FiltroColor";
import FiltroTalle from "../filtroTalle/FiltroTalle";
import OrdenarMayorMenor from "../ordenarMayorMenor/OrdenarMayorMenor";

const ItemList = ({ productos, setProductos, flagCatalogo }) => {
  const [visibleProducts, setVisibleProducts] = useState(15);

  const handleLoadMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 15);
  };

  return (
    <div>
      <div className="ordenarMayorMenor">
      <OrdenarMayorMenor productos={{productos, setProductos}}/>
      </div>
      <div className="containerItemList">
        <div className="categoriaFiltros">
          <CategoriasLateral />
          {flagCatalogo && (
            <>
              <FiltroColor />
              <FiltroTalle />
            </>
          )}
        </div>
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
