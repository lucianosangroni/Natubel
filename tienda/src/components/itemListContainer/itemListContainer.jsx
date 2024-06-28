import React, { useEffect, useState } from "react";
import ItemList from "../itemList/ItemList";
import "./itemListContainer.css";
import { useParams } from "react-router-dom";
import { useData } from '../../context/DataContext';
import Loading from "../loading/Loading";

const ItemListContainer = ({ flagCatalogo }) => {
  const { articulosData, isInitialLoading } = useData();
  const [ articulos, setArticulos ] = useState(articulosData);
  const [ color, setColor ] = useState(null)
  const [ talle, setTalle ] = useState(null)
  const { categoria } = useParams();
  const [ categoriaAnterior, setCategoriaAnterior ] = useState(null);
  const [ productosFiltroTalles, setProductosFiltroTalles ] = useState(null);
  const [ talleAnterior, setTalleAnterior ] = useState(null);
  const [ productosFiltroColores, setProductosFiltroColores ] = useState(null);
  const [ flagOrdenar, setFlagOrdenar ] = useState(0);

  useEffect(() => {
    setArticulos(articulosData)
    setProductosFiltroColores(articulosData)
    setProductosFiltroTalles(articulosData)
  }, [articulosData])

  useEffect(() => {
    let articulosFiltrados = articulosData;

    if (categoria) {
      articulosFiltrados = articulosFiltrados.filter((articulo) => {
        const categorias = articulo.categoria.map(cat => cat.id);
        return categorias.includes(parseInt(categoria));
      });    
    } 

    if(categoria !== categoriaAnterior) {
      setProductosFiltroTalles(articulosFiltrados)
      setProductosFiltroColores(articulosFiltrados)
      setCategoriaAnterior(categoria)
    } else {
      if (talle) {
        articulosFiltrados = articulosFiltrados.filter((articulo) => {
          const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle.toUpperCase())));
          return talles.includes(talle)
        });
      }
  
      if(talle !== talleAnterior) {
        setProductosFiltroColores(articulosFiltrados)
        setTalleAnterior(talle)
      } else {
        if (color) {
          articulosFiltrados = articulosFiltrados.filter((articulo) => {
            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color.toUpperCase())));
            return colores.includes(color)
          });
        }
      }
    }

    setFlagOrdenar(flagOrdenar + 1)
    setArticulos(articulosFiltrados)
  }, [categoria, talle, color]);

  const handleSetProductos = (productosOrdenados) => {
    setArticulos(productosOrdenados)
  }

  const handleChangeTalle = (talle) => {
    setTalle(talle)
  }

  const handleChangeColor = (color) => {
    console.log(color)
    setColor(color)
  }

  return (
    <div>
      {isInitialLoading && <Loading/>}
      <ItemList productos={articulos} productosFiltroTalles={productosFiltroTalles} productosFiltroColores={productosFiltroColores} flagCatalogo={flagCatalogo} setProductosContainer={handleSetProductos} onChangeTalleContainer={handleChangeTalle} onChangeColorContainer={handleChangeColor} flagOrdenar={flagOrdenar} />
    </div>
  );
};

export default ItemListContainer;
