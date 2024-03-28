import React, { useContext, useEffect, useState } from "react";
import "./itemDetail.css";
import ItemCount from "../itemCount/ItemCount";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Carousel } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemDetail = ({ item }) => {
  const { agregarAlCarrito, setTipoPrecios } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const { articulosData } = useData();
  const [selectedTalle, setSelectedTalle] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [selectedStock, setSelectedStock] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const tallesDesordenados = Array.from(new Set(item.productos.filter((producto) => producto.stock > 0).map((producto) => producto.talle)));
  const coloresDesordenados = Array.from(new Set(item.productos.filter((producto) => producto.stock > 0).map((producto) => producto.color)));
  const colores = coloresDesordenados.sort((a, b) => {
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  })
  const talles = tallesDesordenados.sort((a, b) => {
    const isNumberA = !isNaN(a);
    const isNumberB = !isNaN(b);
    const talleOrden = { 'UNICO': 1 ,'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7, 'XXXXL': 8, 'XXXXXL': 9 };

    if (isNumberA && isNumberB) {
      return a - b;
    }  else if (isNumberA || isNumberB) {
      return isNumberA ? 1 : -1;
    } else {
      const aMayus = a.toUpperCase()
      const bMayus = b.toUpperCase()
      return talleOrden[aMayus] - talleOrden[bMayus];
    }
  })

  useEffect(() => {
    setSelectedTalle(talles[0]);

    const primerColorConStock = colores.find((color) =>
      item.productos.some(
        (producto) =>
          producto.color === color &&
          producto.talle === talles[0] &&
          producto.stock > 0
      )
    );
    setSelectedColor(primerColorConStock);

    const stock = item.productos.find(
      (producto) =>
        producto.talle === talles[0] && producto.color === primerColorConStock
    ).stock;
    setSelectedStock(stock);
  }, [item]);

  const handleRestar = () => {
    cantidad > 1 && setCantidad(cantidad - 1);
  };

  const handleSumar = () => {
    cantidad < selectedStock && setCantidad(cantidad + 1);
  };

  const handleAgregarAlCarrito = (numero_articulo, color, talle, cantidad) => {
    agregarAlCarrito(numero_articulo, color, talle, cantidad);
    setTipoPrecios("MINORISTA");
    setCantidad(1);
    toast.success("¡Agregado al carrito!", {
      position: "top-center",
      hideProgressBar: true,
      autoClose: 1000, 
      closeButton: false,
    });
  };

  const isColorDisabled = (color) => {
    const producto = item.productos.find(
      (producto) => producto.color === color && producto.talle === selectedTalle
    );
    return producto ? producto.stock <= 0 : false;
  };

  return (
    <>
      <ToastContainer position="top-right" hideProgressBar={false}/>
    
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
          </div>
          <div className="infoContainer">
            <h3 className="titulo">ART. {item.numero_articulo}</h3>
            <p className="precio">${item.precio_minorista}</p>
            <div className="tallesItemDetail">
              <p>Talle: </p>
              <form className="checkTalle">
                {talles.map((talle) => (
                  <label key={talle} className="talleLabel">
                    <input
                      className="talleInput"
                      type="checkbox"
                      name="talle"
                      value={talle}
                      onChange={() => {
                        setSelectedTalle(talle);
                        const primerColorConStock = colores.find((color) =>
                          item.productos.some(
                            (producto) =>
                              producto.color === color &&
                              producto.talle === talle &&
                              producto.stock > 0
                          )
                        );
                        setSelectedColor(primerColorConStock);
                        const stock = item.productos.find(
                          (producto) =>
                            producto.talle === talle &&
                            producto.color === primerColorConStock
                        ).stock;
                        setSelectedStock(stock);
                        setCantidad(1);
                      }}
                      checked={selectedTalle === talle}
                    />
                    {talle}
                  </label>
                ))}
              </form>
            </div>
            <div className="colorItemDetail">
              <p>Color: </p>
              <form className="checkColor">
                {colores.map((color) => {
                  const producto = item.productos.find(producto => producto.talle === selectedTalle && producto.color === color);
                  if(producto && producto.stock > 0) {
                    return (
                      <label key={color} className="colorLabel">
                          <input
                            type="checkbox"
                            name="color"
                            value={color}
                            onChange={() => {
                              setSelectedColor(color);
                              const stock = item.productos.find(
                                (producto) =>
                                  producto.talle === selectedTalle &&
                                  producto.color === color
                              ).stock;
                              setSelectedStock(stock);
                              setCantidad(1);
                            }}
                            checked={selectedColor === color}
                            className="colorInput"
                            disabled={isColorDisabled(color)}
                          />
                        {color}
                      </label>
                    )
                  }
                })}
              </form>
            </div>

            <span>{selectedStock} unidades disponibles</span>

            <ItemCount
              cantidad={cantidad}
              handleSumar={handleSumar}
              handleRestar={handleRestar}
              handleAgregar={() => {
                handleAgregarAlCarrito(
                  item.numero_articulo,
                  selectedColor,
                  selectedTalle,
                  cantidad
                );
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
                  <div className="imgContainer">
                    {artRelacionado.imagens.length > 0 ? (
                      <img src={artRelacionado.imagens[0].url} alt={"sin imagen"} />
                    ) : (
                      <img
                        src={"http://localhost:3001/no-hay-foto.png"}
                        alt={"sin imagen"}
                      />
                    )}
                  </div>
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
    </>
  );
};

export default ItemDetail;
