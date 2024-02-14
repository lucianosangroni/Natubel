import React, { useEffect, useState } from "react";
import ItemList from "../itemList/ItemList";
import "./itemListContainer.css";
import { useParams } from "react-router-dom";
import { useData } from '../../context/DataContext';

const ItemListContainer = ({ flagCatalogo }) => {
  const { articulosData } = useData();
  const [ articulos, setArticulos ] = useState(articulosData);
  const [ color, setColor ] = useState(null)
  const [ talle, setTalle ] = useState(null)
  const { categoria } = useParams();

  useEffect(() => {
    setArticulos(articulosData)
  }, [articulosData])

  useEffect(() => {
    let articulosFiltrados = articulosData;

    if (categoria) {
      articulosFiltrados = articulosFiltrados.filter((articulo) => {
        const categorias = articulo.categoria.map(cat => cat.id);
        return categorias.includes(parseInt(categoria));
      });      
    } 

    if (color) {
      articulosFiltrados = articulosFiltrados.filter((articulo) => {
        const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
        return colores.includes(color)
      });
    }
    
    if (talle) {
      articulosFiltrados = articulosFiltrados.filter((articulo) => {
        const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
        return talles.includes(talle)
      });
    }

    setArticulos(articulosFiltrados)
  }, [categoria, color, talle]);

  const handleSetProductos = (productosOrdenados) => {
    setArticulos(productosOrdenados)
  }

  const handleChangeColor = (color) => {
    setColor(color)
  }

  const handleChangeTalle = (talle) => {
    setTalle(talle)
  }

  return (
    <div>
      <ItemList productos={articulos} flagCatalogo={flagCatalogo} setProductosContainer={handleSetProductos} onChangeColorContainer={handleChangeColor} onChangeTalleContainer={handleChangeTalle} />
    </div>
  );
};

export default ItemListContainer;
