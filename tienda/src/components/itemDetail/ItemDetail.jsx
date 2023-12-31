import React, { useContext, useState } from "react";
import "./itemDetail.css";
import ItemCount from "../itemCount/ItemCount";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ItemDetail = ({ item, productos }) => {
  const { carrito, agregarAlCarrito } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const [selectedTalle, setSelectedTalle] = useState();


  const handleRestar = () => {
    cantidad > 1 && setCantidad(cantidad - 1);
  };

  const handleSumar = () => {
    cantidad < item.stock && setCantidad(cantidad + 1);
  };

  const handleTallesButtonClick = (talle) => {
    setSelectedTalle(talle);
  }

  const tallesButton =
    item && item.productos
      ? Array.from(new Set(item.productos.map((producto) => producto.talles)))
      : [];

  return (
    <div className="container">
      <div className="producto-detalle">
        <div>
          <img src={item.images} alt={item.art} />
          <p className="descripcion">{item.description}</p>
        </div>
        <div>
          <h3 className="titulo">{item.art}</h3>
          <p>{item.category}</p>
          <p className="precio">${item.price}</p>
          <div className="tallesItemDetail">
          <p>Talles: </p>
            {tallesButton.map((talle) => (
              <button
                key={talle}
                onClick={() => handleTallesButtonClick(talle)}
                className={selectedTalle === talle ? "selected" : ""}
              >
                {talle}
              </button>
            ))}
          </div>
          <div className="colorItemDetail">
            <p>Color: </p>
            {item && <button>{item.colores}</button>}
          </div>

          <ItemCount
            cantidad={cantidad}
            handleSumar={handleSumar}
            handleRestar={handleRestar}
            handleAgregar={() => {
              agregarAlCarrito(item, cantidad);
            }}
          />
        </div>
      </div>
      <div className="productosRelacionados">
          <h3>Productos relacionados</h3>
          <div className="productosRelacionadosLista">
            {productos
            .filter((producto) => producto.category === item.category && producto.id !== item.id)
            .slice(0, 3)
            .map((productoRelacionado) => (
             <div key={productoRelacionado.id} >
               <img src={productoRelacionado.images} alt="producto relacionado" /> 
               <h4>{productoRelacionado.art}</h4>
               <p>{productoRelacionado.category}</p>
               <p >${productoRelacionado.price}</p>
               <div className="detalleContainer">
               <Link className='detalle' to={`/item/${productoRelacionado.id}`}>Detalle</Link>
               </div>
               </div>
            ))}

          </div>
        </div>
    </div>
  );
};

export default ItemDetail;
