import React, { useContext, useEffect, useState } from "react";
import "./itemDetail.css";
import ItemCount from "../itemCount/ItemCount";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Carousel } from "react-bootstrap";

const ItemDetail = ({ item }) => {
  const { agregarAlCarrito } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const { articulosData } = useData();
  const [selectedTalle, setSelectedTalle] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const talles = Array.from(
    new Set(item.productos.filter(producto => producto.stock > 0).map((producto) => producto.talle))
  );
  const colores = Array.from(
    new Set(item.productos.filter(producto => producto.stock > 0).map((producto) => producto.color))
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMiniaturaClick = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
      setSelectedTalle(talles[0]);

      const primerColorConStock = colores.find(color => item.productos.some(producto => producto.color === color && producto.talle === talles[0] && producto.stock > 0));
      setSelectedColor(primerColorConStock);
  }, [item]);

  const handleRestar = () => {
    cantidad > 1 && setCantidad(cantidad - 1);
  };

  const handleSumar = () => {
    const stock = item.productos.find(
      (producto) =>
        producto.talle === selectedTalle && producto.color === selectedColor
    ).stock;

    cantidad < stock && setCantidad(cantidad + 1);
  };

  const handleAgregarAlCarrito = (numero_articulo, color, talle, cantidad) => {
    agregarAlCarrito(numero_articulo, color, talle, cantidad)
    setCantidad(1)
    alert("Productos agregados al carrito")
  }

  const isColorDisabled = (color) => {
    const producto = item.productos.find(producto => producto.color === color && producto.talle === selectedTalle);
    return producto ? producto.stock <= 0 : false;
};

  return (
    <div className="container">
      <div className="producto-detalle">
        <div className="contenedor-carousel">
          <div className="carousel-container">
            <Carousel
              activeIndex={activeIndex}
              onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)}
            >
              {item.imagens.map((imagen, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 imgItemDetail"
                    src={imagen.url}
                    alt={`Imagen ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
              {item.imagens.length === 0 && (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={"http://localhost:3001/no-hay-foto.png"}
                    alt={"sin imagen"}
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>
          <div className="miniaturas">
            {item.imagens.map((imagen, index) => (
              <img
                key={index}
                src={imagen.url}
                alt={`Miniatura ${index + 1}`}
                className={`miniatura ${index === activeIndex ? 'activa' : ''}`}
                onClick={() => handleMiniaturaClick(index)}
              />
            ))}
          </div>
        </div>
        <div className="infoContainer">
          <h3 className="titulo">ART. {item.numero_articulo}</h3>
          <p className="precio">${item.precio_minorista}</p>
          <div className="tallesItemDetail">
            <p>Talle: </p>
            <form className="checkTalle">
              {talles.map((talle) => (
                <label key={talle} className="talleLabel">
                  <input className="talleInput"
                    type ="checkbox" 
                    name="talle"
                    value={talle}
                    onChange ={() => {
                      setSelectedTalle(talle);
                      const primerColorConStock = colores.find(color => item.productos.some(producto => producto.color === color && producto.talle === talle && producto.stock > 0));
                      setSelectedColor(primerColorConStock);
                      setCantidad(1);
                    }}
                    checked={ selectedTalle === talle}
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
                    type="checkbox"
                    name="color"
                    value={color}
                    onChange={() => {
                      setSelectedColor(color);
                      setCantidad(1);
                    }}
                    checked={selectedColor === color}
                    className="colorInput"
                    disabled={isColorDisabled(color)}
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
            handleAgregar={() => {
              handleAgregarAlCarrito(item.numero_articulo,  selectedColor,  selectedTalle,  cantidad);
            }}
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
            .filter((art) => {
              const itemCats = item.categoria.map((cat) => parseInt(cat.id));
              const artCats = art.categoria.map((cat) => parseInt(cat.id));
              return (
                artCats.some((cat) => itemCats.includes(cat)) &&
                art.id !== item.id
              );
            })
            .slice(0, 3)
            .map((artRelacionado) => (
              <div key={artRelacionado.id}>
                {artRelacionado.imagens.length > 0 ? (
                  <img src={artRelacionado.imagens[0].url} alt={"sin imagen"} />
                ) : (
                  <img
                    src={"http://localhost:3001/no-hay-foto.png"}
                    alt={"sin imagen"}
                  />
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
