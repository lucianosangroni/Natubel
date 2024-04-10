import React, { useState, useEffect } from "react";
import Item from "../item/Item";
import "./itemList.css";
import CategoriasLateral from "../categoriasLateral/CategoriasLateral";
import FiltroColor from "../filtroColor/FiltroColor";
import FiltroTalle from "../filtroTalle/FiltroTalle";
import OrdenarMayorMenor from "../ordenarMayorMenor/OrdenarMayorMenor";

const ItemList = ({ productos, productosFiltroTalles, productosFiltroColores, setProductosContainer, flagCatalogo, onChangeTalleContainer, onChangeColorContainer, flagOrdenar }) => {
  const [visibleProducts, setVisibleProducts] = useState(40);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 440);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 440);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 15);
  };

  const setProductos = (productosOrdenados) => {
    setProductosContainer(productosOrdenados)
  }

  const handleChangeTalle = (talle) => {
    onChangeTalleContainer(talle)
  }

  const handleChangeColor = (color) => {
    onChangeColorContainer(color)
  }

  return (
    <>
      {isMobile ? (
        <>
          <div className="ordenarMayorMenor">
            <OrdenarMayorMenor
              productos={productos}
              setProductos={setProductos}
              flagOrdenar={flagOrdenar}
            />
          </div>
          <div className="containerItemList">
            {productos.length === 0 && (
              <div className="noHayArtContainer">
                <p className="noHayArticulos">Cargando...</p>
              </div>
            )}
            <div className="productosContainer">
              <div className="productos">
                {productos.slice(0, visibleProducts).map((prod) => (
                  <Item producto={prod} key={prod.id} />
                ))}
              </div>
              {visibleProducts < productos.length && (
                <div className="buttonVerMas">
                  <button onClick={handleLoadMore}>Ver más</button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="ordenarMayorMenor">
            <OrdenarMayorMenor
              productos={productos}
              setProductos={setProductos}
              flagOrdenar={flagOrdenar}
            />
          </div>
          <div className="containerItemList">
            <div className="categoriaFiltros">
              <CategoriasLateral />
              {flagCatalogo && (
                <>
                  <FiltroTalle
                    articulos={productosFiltroTalles}
                    onChangeTalle={handleChangeTalle}
                  />
                  <FiltroColor
                    articulos={productosFiltroColores}
                    onChangeColor={handleChangeColor}
                  />
                </>
              )}
            </div>
            {productos.length === 0 && (
              <div className="noHayArtContainer">
                <p className="noHayArticulos">Cargando...</p>
              </div>
            )}
            <div className="productosContainer">
              <div className="productos">
                {productos.slice(0, visibleProducts).map((prod) => (
                  <Item producto={prod} key={prod.id} />
                ))}
              </div>
              {visibleProducts < productos.length && (
                <div className="buttonVerMas">
                  <button onClick={handleLoadMore}>Ver más</button>
                </div>
              )}
            </div>
          </div>
        </>
      )} 
    </>
  );
};

export default ItemList;