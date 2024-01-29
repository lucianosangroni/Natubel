import React, { useContext, useState } from "react";
import "./itemDetail.css";
import ItemCount from "../itemCount/ItemCount";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ItemDetail = ({ item, productos }) => {
  const { carrito, agregarAlCarrito } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const [selectedTalle, setSelectedTalle] = useState();
  const [selectedColor, setSelectedColor] = useState();

  const handleRestar = () => {
    cantidad > 1 && setCantidad(cantidad - 1);
  };

  const handleSumar = () => {
    cantidad < item.stock && setCantidad(cantidad + 1);
  };

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
          <form>
          {item.talles.map((talle) => (
            <label key={talle}>
              <input
                type="radio"
                name="talle"
                value={talle}
                onChange={() => setSelectedTalle(talle)}
                checked={selectedTalle === talle}
              />
              {talle}
            </label>
            ))}
          </form>
          </div>
          <div className="colorItemDetail">
            <p>Color: </p>
            <form>
            {item.colores.map((color) => (
              <label key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  onChange={() => setSelectedColor(color)}
                  checked={selectedColor === color}
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
              agregarAlCarrito(item.art, selectedColor, selectedTalle, cantidad, 1);
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
