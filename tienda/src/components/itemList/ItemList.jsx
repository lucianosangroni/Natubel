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
  const [busqueda, setBusqueda] = useState('');
  const [productosBuscados, setProductosBuscados] = useState(productos)

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 440);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setProductosBuscados(productos)
  }, [productos]);

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);

    const productosFiltrados = productos.filter(prod => prod.numero_articulo.includes(e.target.value))
    setProductosBuscados(productosFiltrados)
  };

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
      {flagCatalogo && (
        <>
          <div className='globalFilter'>
            <span role="img" aria-label="lupa" className="search-icon">
            🔍
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
              placeholder="Buscar..."
            />
          </div>
          <div className="ordenarMayorMenor">
            <OrdenarMayorMenor
              productos={productos}
              setProductos={setProductos}
              flagOrdenar={flagOrdenar}
            />
          </div>
        </>
      )}
      <div className="containerItemList">
        {!isMobile && (
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
        )}
        {productos.length === 0 && (
          <div className="noHayArtContainer">
            <p className="noHayArticulos">Cargando...</p>
          </div>
        )}
        {productosBuscados.length === 0 && productos.length > 0 && (
          <div className="noHayArtContainer">
            <p className="noHayArticulos">No existe el articulo buscado</p>
          </div>
        )}
        <div className="productosContainer">
          <div className="productos">
            {productosBuscados.slice(0, visibleProducts).map((prod) => (
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
  );
};

export default ItemList;