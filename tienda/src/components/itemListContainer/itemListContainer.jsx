import React, { useEffect, useState } from "react";
import ItemList from "../itemList/ItemList";
import "./itemListContainer.css";
import { useParams } from "react-router-dom";
import { apiUrl, tokenBearer } from "../../config/config";

const ItemListContainer = ({ flagCatalogo }) => {
  const [articulos, setArticulos] = useState([]);
  const [color, setColor] = useState(null)
  const [talle, setTalle] = useState(null)
  const category = useParams().categoria;
  

  useEffect(() => {
    fetch(`${apiUrl}/articulos`, 
    {
      headers: {
        Authorization: `Bearer ${tokenBearer}`
      }
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al buscar los datos, intente nuevamente")
        throw new Error("Error en la solicitud GET");
      }
      return response.json();
    })
    .then((res) => {
      let articulosFiltrados = res;

      if (category) {
        articulosFiltrados = articulosFiltrados.filter((articulo) => articulo.categorias.includes(category))    
      } 

      if (color) {
        articulosFiltrados = articulosFiltrados.filter((articulo) => {
          const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));
          colores.includes(color)
        });
      }
      
      if (talle) {
        articulosFiltrados = articulosFiltrados.filter((articulo) => {
          const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
          talles.includes(talle)
        });
      }
  
      setArticulos(articulosFiltrados)
    })
    .catch((error) => {
      console.error("Error en la solicitud GET:", error)
    });
  }, [category, color, talle]);

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
