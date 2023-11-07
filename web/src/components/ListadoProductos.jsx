import React, { useState } from "react";

const initialProducts = [
  {
    id: 1,
    articulo: "1",
    talles: ["s", "m", "xl", "xxl"],
    colores: ["blanco", "amarillo"],
  },
  {
    id: 2,
    articulo: "2",
    talles: ["s", "m"],
    colores: ["blanco", "amarillo", "negro", "fuccia"],
  },
  {
    id: 3,
    articulo: "3",
    talles: ["s", "m", "xl"],
    colores: ["blanco"],
  },
  {
    id: 4,
    articulo: "4",
    talles: ["s"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 5,
    articulo: "5",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 6,
    articulo: "6",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 7,
    articulo: "7",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
];

const ListadoProductos = () => {
  const [products] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const renderGrilla = (product) => {
    if (product.talles && product.colores) {
      return (
        <table className="table-grilla">
          <thead>
            <tr className="table-header-grilla">
              <th className="articulo-grilla">{product.articulo}</th>
              {product.talles.map((talle, index) => (
                <th key={index}>{talle}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.colores.map((color, index) => (
              <tr key={index}>
                <td className="table-cell-grilla">{color}</td>
                {product.talles.map((talle, talleIndex) => (
                  <td key={talleIndex}>
                    {/* Aquí puedes mostrar datos específicos para cada combinación de talle y color */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <>
      <div className="table-productos-contenedor">
        <table className="table-productos">
          <thead>
            <tr className="table-header-productos">
              <th>Artículos</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product)}>
                <td className="table-cell-productos">{product.articulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && renderGrilla(selectedProduct)}
      </div>
    </>
  );
};

export default ListadoProductos;
