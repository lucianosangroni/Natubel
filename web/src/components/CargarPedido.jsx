import React, { useState, useEffect } from "react";
import NavbarAdm from '../components/NavbarAdm';
import Select from "react-select";
import GrillaProductoPedido from "./GrillaProductoPedido";
import GrillasProductosConfirmados from "./GrillaProductoConfirmado";

const CargarPedido = () => {
  const [data, setData] = useState([])
  const [clientes, setClientes] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [tipoPedidor, setTipoPedidor] = useState("cliente")
  const [selectedPedidor, setSelectedPedidor] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productosConfirmados, setProductosConfirmados] = useState([]);

  const jwt = localStorage.getItem('jwt')

  ////OBTENER ARTICULOS, CLIENTES Y PROVEEDORES DB
  useEffect(() => {
    fetch(`http://localhost:3001/api/articulos`, 
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then((response) => response.json())
    .then((result) => {
      const articulos = []
      for (const dataResult of result) {
        const productos = dataResult.productos.map(({id, color, talle, stock}) => ({id, color, talle, stock}))
        const articulo = 
        {
          id: dataResult.id,
          numero_articulo: dataResult.numero_articulo,
          precio_unitario: dataResult.precio_unitario,
          productos
        }

        if(productos.length > 0) articulos.push(articulo)
      }

      setData(articulos)
    })
    .catch((error) => {
      console.error("Error en la solicitud GET:", error)
    });

    fetch(`http://localhost:3001/api/clientes`, 
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then((response) => response.json())
    .then((result) => {
      const dataClientes = result.map(({ persona }) => ({ id: persona.id, nombre: persona.nombre }));

      setClientes(dataClientes)
    })

    fetch(`http://localhost:3001/api/proveedores`, 
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then((response) => response.json())
    .then((result) => {
      const dataProveedores = result.map(({ id, nombre }) => ({ id, nombre }));

      setProveedores(dataProveedores)
    })
  }, [jwt]);

    const handleCambiarTipoPedidor = (pedidor) => {
      setTipoPedidor(pedidor)
      setFiltroBusqueda('');
      setSelectedPedidor('')
    }
    
    const handleProductClick = (product) => {
      setSelectedProduct(product);
    };

    const listaPedidores = tipoPedidor === 'cliente' ? clientes : proveedores;

    const pedidoresFiltrados = listaPedidores.filter(pedidor =>
      pedidor.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );

    const handleConfirmarProducto = (articulo, cantidades) => {
      const productoConfirmadosNuevo = {
        precio_unitario: articulo.precio_unitario,
        productos: articulo.productos,
        numero_articulo: articulo.numero_articulo,
        cantidades
      }
      setProductosConfirmados([...productosConfirmados, productoConfirmadosNuevo]);
    }

    const calcularPrecioTotal = () => {
      let precioTotal = 0

      for(const articulo of productosConfirmados) {
        const claves = Object.keys(articulo.cantidades)

        for (const clave of claves) {
          const cantidad = articulo.cantidades[clave]

          precioTotal += cantidad * articulo.precio_unitario
        }
      }

      return precioTotal
    }
  
    const getProductos = () => {
      const productosFinales = [];

      for(const articulo of productosConfirmados) {
        for(const producto of articulo.productos) {
          const key = `${producto.color}-${producto.talle}`;
          const cantidad = articulo.cantidades[key] || 0;

          if (cantidad > 0) {
              productosFinales.push({
                  producto_id: producto.id,
                  cantidad: cantidad,
                  precio_unitario: articulo.precio_unitario,
              });
          }
        }
      };

      return productosFinales;
    }

    const handleCargarPedido = () => {
      const precio_total = calcularPrecioTotal()
      const productos = getProductos()

      const pedidoRequest = {
        persona_id: selectedPedidor,
        precio_total,
        es_proveedor: tipoPedidor === "proveedor",
        productos
      }

      console.log(pedidoRequest)
    }

  return ( <>
    <NavbarAdm/>
    <div className="contenedor-cargar-pedido">
      <div className="contenedor-botones">
        <button id="btn-pedidor-cliente" className={tipoPedidor === 'cliente' ? 'boton-pedidor pedidor-seleccionado' : 'boton-pedidor'} onClick={() => handleCambiarTipoPedidor('cliente')}>
          Cliente
        </button>
        <button className={tipoPedidor === 'proveedor' ? 'boton-pedidor pedidor-seleccionado' : 'boton-pedidor'} onClick={() => handleCambiarTipoPedidor('proveedor')}>
          Proveedor
        </button>
        <Select options={pedidoresFiltrados.map((pedidor) => ({value: pedidor.id, label: pedidor.nombre}))}
            value={{label: filtroBusqueda || `Seleccionar ${tipoPedidor === "cliente" ? "Cliente" : "Proveedor"}`}}
            onChange={(selectedOption) => {
              setFiltroBusqueda(selectedOption.label || "")
              setSelectedPedidor(selectedOption.value)
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
            {data.map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product)}>
                <td className="table-cell-productos">{product.numero_articulo}</td>
              </tr>    
            ))}
          </tbody>
        </table>
        {selectedProduct && <GrillaProductoPedido articulo={selectedProduct} onConfirmarProducto={handleConfirmarProducto}/>}
      </div>
      {productosConfirmados.length > 0 && <GrillasProductosConfirmados articulos={productosConfirmados}/>}
      <button className="cargar-pedido-boton" onClick={handleCargarPedido}>Cargar pedido</button>
    </div>
    </>
  );
};

export default CargarPedido;
