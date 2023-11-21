import React, { useState } from "react";
import NavbarAdm from '../components/NavbarAdm';
import Select from "react-select";

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

const proveedores = [
  {
    "id": 1,
    "nombre": "Juan Gomez",
    "email": "juan@example.com",
    "telefono": "555-555-5555",
    "direccion": "123 Calle Principal",
  }
]

const clientes = [
  {
    "id": 2,
    "dni": "12345678",
    "cuit_cuil": "12345678901",
    "tipo_cliente": "MINORISTA",
    "forma_de_envio": "agsaf",
    "codigo_postal": "1405",
    "ciudad": "fgasgasf",
    "provincia": "asgsfa",
    "persona": {
        "id": 5,
        "nombre": "PEPITO",
        "email": "pepe@gmail.com",
        "telefono": "fasfsaf",
        "direccion": "fasfa",
    }
  }
]

const CargarPedido = () => {
  const [tipoPedidor, setTipoPedidor] = useState("cliente")
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [selectedPedidor, setSelectedPedidor] = useState('');
  
  //const [selectedProduct, setSelectedProduct] = useState(null);
  //const [cantidadesPorProducto, setCantidadesPorProducto] = useState({});
  //const [resumenPedido, setResumenPedido] = useState([]);

  //const handleProductClick = (product) => {
  //  handleConfirmarProducto(product);
  //  setSelectedProduct(product);
  //  setCantidadesPorProducto((prevCantidades) => ({
  //    ...prevCantidades,
  //    [product.id]: prevCantidades[product.id] || initializeQuantities(product),
  //  }));
  //};

  //const handleConfirmarProducto = (product) => {
  //  setCantidadesPorProducto((prevCantidades) => ({
  //    ...prevCantidades,
  //    [product.id]: prevCantidades[product.id] || initializeQuantities(product),
  //  }));
  //
  //  setResumenPedido((prevResumen) => [...prevResumen, product]);
  //};

  //const initializeQuantities = (product) => {
  //  const quantities = {};
  //
  //  if (product && product.talles && product.colores) {
  //    product.talles.forEach((talle) => {
  //      product.colores.forEach((color) => {
  //        quantities[`${talle}-${color}`] = 0;
  //      });
  //    });
  //  }
  //
  //  return quantities;
  //};

  //const handleCantidadChange = (talle, color, e) => {
  //  const key = `${selectedProduct.id}-${talle}-${color}`;
  //  const newValue = parseInt(e.target.value, 10) || 0;
//
  //    setCantidadesPorProducto((prevCantidades) => ({
  //      ...prevCantidades,
  //      [selectedProduct.id]: {
  //        ...prevCantidades[selectedProduct.id],
  //        [key]: newValue,
  //      },
  //    }));
  //  }

    const handleCambiarPedidor = (pedidor) => {
      setTipoPedidor(pedidor)
      setFiltroBusqueda('');
    }

    const getNombre = (pedidor) => {
      if(tipoPedidor === "cliente") {
        return pedidor.persona.nombre
      } else if (tipoPedidor === "proveedor") {
        return pedidor.nombre
      }
    }

    const listaPedidores = tipoPedidor === 'cliente' ? clientes : proveedores;

    const pedidoresFiltrados = listaPedidores.filter(pedidor =>
      getNombre(pedidor).toLowerCase().includes(filtroBusqueda.toLowerCase())
    );

    const handleCargarPedido = () => {
      console.log(selectedPedidor)
      console.log(tipoPedidor)
    }

//const renderGrilla = (product) => {
//  const initializeData = () => {
//    const initializedData = {};
//    product.talles.forEach((talle) => {
//      initializedData[talle] = {};
//      product.colores.forEach((color) => {
//        initializedData[talle][color] = 0;
//        
//      });
//    });
//    return initializedData;
//  };
//
//  initializeData();
//
//  return (
//    <table className="table-grilla-cargar-pedido">
//      <thead>
//        <tr className="table-header-grilla">
//          <th className="articulo-grilla">{product.articulo}</th>
//          {product.talles.map((talle, index) => (
//            <th key={index}>Talle {talle}</th>
//          ))}
//        </tr>
//      </thead>
//      <tbody>
//        {product.colores.map((color, index) => (
//          <tr key={index}>
//            <td className="table-cell-grilla">{color}</td>
//            {product.talles.map((talle, talleIndex) => (
//              <td key={talleIndex}>
//                <p className="stock-grilla">Stock: {selectedProduct.datosPorTalleYColor[talle]?.[color]?.toString() || '0'}</p>
//                <input
//                    className="input-cargar-pedido"
//                    type="number"
//                    min="0"
//                    value={cantidadesPorProducto[selectedProduct.id]?.[`${talle}-${color}`]?.toString() || '0'}
//                    /*onChange={(e) => handleCantidadChange(talle, color, e)}*/
//                  />
//              </td>
//            ))}
//          </tr>
//        ))}
//      </tbody>
//    </table>
//  );
//};

  return ( <>
    <NavbarAdm/>
    <div className="contenedor-cargar-pedido">
      <div className="contenedor-botones">
        <button id="btn-pedidor-cliente" className={tipoPedidor === 'cliente' ? 'boton-pedidor pedidor-seleccionado' : 'boton-pedidor'} onClick={() => handleCambiarPedidor('cliente')}>
          Cliente
        </button>
        <button className={tipoPedidor === 'proveedor' ? 'boton-pedidor pedidor-seleccionado' : 'boton-pedidor'} onClick={() => handleCambiarPedidor('proveedor')}>
          Proveedor
        </button>
        <Select options={pedidoresFiltrados.map((pedidor) => ({label: getNombre(pedidor)}))}
            value={{label: filtroBusqueda || `Seleccionar ${tipoPedidor === "cliente" ? "Cliente" : "Proveedor"}`}}
            onChange={(selectedOption) => {
              setFiltroBusqueda(selectedOption.label || "")
              setSelectedPedidor(selectedOption.label)
            }}
            isSearchable
            noOptionsMessage={() => `No existe el ${tipoPedidor === "cliente" ? "cliente" : "proveedor"}`}
          />
      </div>

      <div className="contenedor-principal">
        <table className="table-cargarPedido-contenedor">
          <thead>
            <tr className="table-header-productos">
              <th>Artículo</th>
            </tr>
          </thead>
          <tbody>
            {initialProducts.map((product) => (
              <tr key={product.id} /*onClick={() => handleProductClick(product)}*/>
                <td className="table-cell-productos">{product.articulo}</td>
              </tr>    
            ))}
          </tbody>
        </table>
        {/*selectedProduct && (
          <div>{selectedProduct && renderGrilla(selectedProduct)}</div>
        )*/}
        <button className="confirmar" /*onClick={handleConfirmarProducto}*/>Confirmar</button>
      </div>    
      <h5 className="titulo-resumenPedido">Resumen de pedido</h5>
      <button className="cargar-pedido-boton" onClick={handleCargarPedido}>Cargar pedido</button>
    </div>
    </>
  );
};


export default CargarPedido;
