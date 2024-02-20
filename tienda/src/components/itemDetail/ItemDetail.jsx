import React, { useContext, useEffect, useState } from "react";
import "./itemDetail.css";
import ItemCount from "../itemCount/ItemCount";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useData } from '../../context/DataContext';

const ItemDetail = ({ item }) => {
  const { agregarAlCarrito } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(0);
  const { articulosData } = useData();
  const [selectedTalle, setSelectedTalle] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const talles = Array.from(new Set(item.productos.map((producto) => producto.talle)));
  const colores = Array.from(new Set(item.productos.map((producto) => producto.color)));

  useEffect(() => {
    setSelectedTalle(talles[0]);
    setSelectedColor(colores[0]);
  }, [item]);

  const handleRestar = () => {
    cantidad > 1 && setCantidad(cantidad - 1);
  };

  const handleSumar = () => {
    const stock = item.productos.find((producto) => producto.talle === selectedTalle && producto.color === selectedColor).stock

    cantidad < stock && setCantidad(cantidad + 1);
  };

  return (
    <div className="container">
      <div className="producto-detalle">
        <div>
          {item.imagens.length > 0 ? (
            <img src={item.imagens[0].url} alt={"sin imagen"} />
          ) : (
            <img src={"http://localhost:3001/no-hay-foto.png"} alt={"sin imagen"} />
          )}
        </div>
        <div>
          <h3 className="titulo">ART. {item.numero_articulo}</h3>
          <p className="precio">${item.precio_minorista}</p>
          <div className="tallesItemDetail">
            <p>Talle: </p>
            <form className="checkTalle">
              {talles.map((talle) => (
                <label key={talle} className="talleLabel">
                  <input
                    type="radio"
                    name="talle"
                    value={talle}
                    onChange={() => {
                      setSelectedTalle(talle)
                      setCantidad(0)
                    }}
                    checked={selectedTalle === talle}
                    className="talleInput"
                  />
                  {talle}
                </label>
              ))}
            </form>
          </div>
          <div className="colorItemDetail">
            <p>Color: </p>
            <form className="checkColor">
              {colores.map((color) => (
                <label key={color} className="colorLabel">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    onChange={() => {
                      setSelectedColor(color)
                      setCantidad(0)
                    }}
                    checked={selectedColor === color}
                    className="colorInput"
                  />
                  {color}
                </label>
              ))}
            </form>
          </div>

          <ItemCount
            cantidad={cantidad}
            handleSumar={handleSumar}
            handleRestar={handleRestar}
            //handleAgregar={() => {
            //  agregarAlCarrito(
            //    item.numero_articulo,
            //    selectedColor,
            //    selectedTalle,
            //    cantidad,
            //    1
            //  );
            //}}
          />
        </div>
        <div className="description-container">
          <p className="descripcion">{item.descripcion}</p>
        </div>
      </div>
      <div className="productosRelacionados">
        <h3>Articulos relacionados</h3>
        <div className="productosRelacionadosLista">
        {articulosData
          .filter(art => {
            const itemCats = item.categoria.map(cat => parseInt(cat.id))
            const artCats = art.categoria.map(cat => parseInt(cat.id))
            return artCats.some(cat => itemCats.includes(cat)) && art.id !== item.id;
          })
          .slice(0, 3)
          .map((artRelacionado) =>  (
            <div key={artRelacionado.id}>
              {artRelacionado.imagens.length > 0 ? (
                <img src={artRelacionado.imagens[0].url} alt={"sin imagen"} />
              ) : (
                <img src={"http://localhost:3001/no-hay-foto.png"} alt={"sin imagen"} />
              )}
              <h4>ART. {artRelacionado.numero_articulo}</h4>
              <p>${artRelacionado.precio_minorista}</p>
              <div className="detalleContainer">
                <Link
                  className="detalle"
                  to={`/articulo/${artRelacionado.id}`}
                >
                  Detalle
                </Link>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
