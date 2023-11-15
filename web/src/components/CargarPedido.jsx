import React, { useState } from "react";
import NavbarAdm from '../components/NavbarAdm';

const initialProducts = [
  {
    id: 1,
    articulo: "1",
    talles: ["s", "m", "xl", "xxl"],
    colores: ["blanco", "amarillo"],
    datosPorTalleYColor: {
      s: {
        blanco: 5,
        amarillo: 8,
      },
      m: {
        blanco: 1,
        amarillo: 0,
      },
      xl: {
        blanco: 0,
        amarillo: 3,
      },
      xxl: {
        blanco: 0,
        amarillo: 0,
      },
    },
  },
  {
    id: 2,
    articulo: "2",
    talles: ["s", "m"],
    colores: ["blanco", "amarillo", "negro", "fuccia"],
    datosPorTalleYColor: {
      s: {
        blanco: 1,
        amarillo: 8,
        negro: 5,
        fuccia: 0,
      },
      m: {
        blanco: 1,
        amarillo: 8,
        negro: 5,
        fuccia: 0,
      },
    },
  },
  {
    id: 3,
    articulo: "3",
    talles: ["s", "m", "xl"],
    colores: ["blanco"],
    datosPorTalleYColor: {
      s: {
        blanco: 1,
      },
      m: {
        blanco: 5,
      },
      xl: {
        blanco: 4,
      },
    },
  },

  {
    id: 4,
    articulo: "4",
    talles: ["s"],
    colores: ["blanco", "amarillo", "negro"],
    datosPorTalleYColor: {},
  },
  {
    id: 5,
    articulo: "5",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
    datosPorTalleYColor: {},
  },
  {
    id: 6,
    articulo: "6",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
    datosPorTalleYColor: {},
  },
  {
    id: 7,
    articulo: "7",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
    datosPorTalleYColor: {},
  },
];

const CargarPedido = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    console.log("Producto seleccionado:", product);
  };

  // Definir la función handleCantidadChange para manejar cambios en las cantidades
  const handleCantidadChange = ( talle, color, cantidad) => {
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct };
    if (
      updatedProduct.talles.includes(talle) &&
      updatedProduct.colores.includes(color)
    ) {
      if (!updatedProduct.datosPorTalleYColor[talle]) {
        updatedProduct.datosPorTalleYColor[talle] = {};
      }
      updatedProduct.datosPorTalleYColor[talle][color] =
      parseInt(cantidad, 10);
    setSelectedProduct(updatedProduct);
    } else {
      console.error("El talle o color no existe en el producto seleccionado");
    }
  } else {
    console.error("Ningún producto seleccionado");
  }
};

const renderGrilla = (product) => {
  // Inicializar los datos en 0 si aún no existen
  const initializeData = () => {
    const initializedData = {};
    product.talles.forEach((talle) => {
      initializedData[talle] = {};
      product.colores.forEach((color) => {
        initializedData[talle][color] = 0;
        console.log("Cantidades iniciales:", product.datosPorTalleYColor);
      });
    });
    return initializedData;
  };

  const initializedData = initializeData();

  return (
    <table className="table-grilla">
      <thead>
        <tr className="table-header-grilla">
          <th className="articulo-grilla">{product.articulo}</th>
          {product.talles.map((talle, index) => (
            <th key={index}>Talle {talle}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {product.colores.map((color, index) => (
          <tr key={index}>
            <td className="table-cell-grilla">{color}</td>
            {product.talles.map((talle, talleIndex) => (
              <td key={talleIndex}>
                {/* Utilizar initializedData en lugar de selectedProduct.datosPorTalleYColor */}
                <input
                  type="number"
                  min="0"
                  value={initializedData[talle][color].toString()}
                  onChange={(e) =>
                    handleCantidadChange(talle, color, e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

  return ( <>
    <NavbarAdm/>
    <div>
      <button id="botonNuevoCliente">Cliente</button>
      <button id="botonNuevoCliente">Proveedor</button>
      <div className="contenedor-principal">
        <table className="table-cargarPedido-contenedor">
          <thead>
            <tr className="table-header-productos">
              <th>Artículo</th>
            </tr>
          </thead>
          <tbody>
            {initialProducts.map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product)}>
                <td className="table-cell-productos">{product.articulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <div>{selectedProduct && renderGrilla(selectedProduct)}</div>
        )}
      </div>
      <h5 className="titulo-resumenPedido">Resumen de pedido</h5>
      <button id="botonNuevoCliente">Cargar pedido</button>
    </div>
    </>
  );
};

export default CargarPedido;
