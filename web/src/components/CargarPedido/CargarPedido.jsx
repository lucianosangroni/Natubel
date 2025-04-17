import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import Select from "react-select";
import GrillaProductoPedido from "./GrillaProductoPedido";
import GrillasProductosConfirmados from "./GrillaProductoConfirmado";
import { apiUrl, bearerToken } from "../../config/config";
import ListaArticulos from "../Common/ListaArticulos";
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";

const CargarPedido = () => {
  const { articulosData, marcasData, clientesData, proveedoresData, refreshArticulos, isInitialLoading } = useData()
  const [data, setData] = useState(articulosData);
  const [clientes, setClientes] = useState(clientesData);
  const [proveedores, setProveedores] = useState(proveedoresData);
  const [tipoPedidor, setTipoPedidor] = useState("cliente");
  const [selectedPedidor, setSelectedPedidor] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productosConfirmados, setProductosConfirmados] = useState([]);
  const [cantidadesArticuloActual, setCantidadesArticuloActual] = useState({});
  const [selectedMarca, setSelectedMarca] = useState("todas");
  const [isLoading, setIsLoading] = useState(false)

  ////OBTENER ARTICULOS, CLIENTES Y PROVEEDORES DB
  useEffect(() => {
    const filtered = selectedMarca === "todas"
            ? articulosData
            : articulosData.filter(art => String(art.marca_id) === String(selectedMarca));

    setData(filtered);
    setSelectedProduct(filtered[0]);
    setClientes(clientesData);
    setProveedores(proveedoresData);
  }, [articulosData, clientesData, proveedoresData, selectedMarca]);

  const handleCambiarTipoPedidor = (pedidor) => {
    setTipoPedidor(pedidor);
    setFiltroBusqueda("");
    setSelectedPedidor("");
  };

  const handleChangeMarca = (marcaId) => {
    if (Object.keys(cantidadesArticuloActual).length > 0) {
        const confirmCambio = window.confirm(`El articulo actual no está confirmado, ¿Estas seguro que quieres cambiar de marca? al hacerlo perderás los datos del mismo`);
        if (!confirmCambio) {
            return;
        }
    }

    setCantidadesArticuloActual({});
    setSelectedMarca(marcaId);
  }

  const handleCantidadesChange = (cantidades) => {
    setCantidadesArticuloActual(cantidades)
  }

  const handleProductClick = (product) => {
    if(Object.keys(cantidadesArticuloActual).length !== 0 && selectedProduct.numero_articulo !== product.numero_articulo) {
      const shouldCambiarArticulo = window.confirm(
        `El articulo actual no está confirmado, ¿Estas seguro que quieres seleccionar otro?`
      );
      if (!shouldCambiarArticulo) {
        return;
      }
    }

    setSelectedProduct(product);
  };

  const listaPedidores = tipoPedidor === "cliente" ? clientes : proveedores;

  const pedidoresFiltrados = listaPedidores.filter((pedidor) =>
    pedidor.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  const handleConfirmarProducto = (articulo, cantidades) => {
    const productoExistenteIndex = productosConfirmados.findIndex(
      (producto) => producto.numero_articulo === articulo.numero_articulo
    );

    if (productoExistenteIndex !== -1) {
      const productosConfirmadosActualizados = [...productosConfirmados];
      productosConfirmadosActualizados[productoExistenteIndex].cantidades = cantidades;
      setProductosConfirmados(productosConfirmadosActualizados);
    } else {
      const productoConfirmadosNuevo = {
        precio_minorista: articulo.precio_minorista,
        precio_mayorista: articulo.precio_mayorista,
        precio_distribuidor: articulo.precio_distribuidor,
        productos: articulo.productos,
        numero_articulo: articulo.numero_articulo,
        cantidades,
      };

      setProductosConfirmados([
        ...productosConfirmados,
        productoConfirmadosNuevo,
      ]);
    }

    setCantidadesArticuloActual({});
    alert(`Articulo confirmado`);
  };

  const handleBorrarConfirmarProducto = (articulo) => {
    const productosConfirmadosActualizados = productosConfirmados.filter(
      (producto) => producto.numero_articulo !== articulo.numero_articulo
    );
  
    setProductosConfirmados(productosConfirmadosActualizados);
    alert(`Articulo eliminado del pedido`);
  }

  const calcularPrecioTotal = () => {
    let precioTotal = 0;

    if (tipoPedidor === "cliente") {
      const clienteSeleccionado = clientes.find(cliente => cliente.persona_id === selectedPedidor);
      const tipo_cliente = clienteSeleccionado ? clienteSeleccionado.tipo_cliente : 'MAYORISTA';

      for (const articulo of productosConfirmados) {
        const claves = Object.keys(articulo.cantidades);

        for (const clave of claves) {
          const cantidad = articulo.cantidades[clave];

          switch (tipo_cliente) {
            case 'MINORISTA':
              precioTotal += cantidad * articulo.precio_minorista;
              break;
            case 'MAYORISTA':
              precioTotal += cantidad * articulo.precio_mayorista;
              break;
            case 'DISTRIBUIDOR':
              precioTotal += cantidad * articulo.precio_distribuidor;
              break;
            default: break;
          }
        }
      }
    }
    
    return precioTotal;
  };

  const getProductos = () => {
    const productosFinales = [];

    const clienteSeleccionado = clientes.find(cliente => cliente.persona_id === selectedPedidor);
    const tipo_cliente = clienteSeleccionado ? clienteSeleccionado.tipo_cliente : 'MAYORISTA';

    let precio_unitario = 0.00;

    for (const articulo of productosConfirmados) {
      for (const producto of articulo.productos) {
        const key = `${producto.color}-${producto.talle}`;
        const cantidad = articulo.cantidades[key] || 0;

        if (tipoPedidor === "cliente") {
          switch (tipo_cliente) {
            case 'MINORISTA':
              precio_unitario = articulo.precio_minorista;
              break;
            case 'MAYORISTA':
              precio_unitario = articulo.precio_mayorista;
              break;
            case 'DISTRIBUIDOR':
              precio_unitario = articulo.precio_distribuidor;
              break;
            default: break;
          }
        }

        if (cantidad > 0) {
          productosFinales.push({
            producto_id: producto.id,
            cantidad: cantidad,
            precio_unitario,
          });
        }
      }
    }

    return productosFinales;
  };

  //AGREGAR PEDIDO DB
  const handleCargarPedido = () => {
    if (!selectedPedidor) {
      alert(`Seleccione un ${tipoPedidor}`);
      return;
    }

    const shouldCargar = window.confirm(
      `¿Estas seguro que quieres cargar este pedido del ${tipoPedidor} ${filtroBusqueda}?`
    );
    if (!shouldCargar) {
      return;
    }

    setIsLoading(true)

    const precio_total = calcularPrecioTotal();
    const productos = getProductos();
    const creador = localStorage.getItem("username");

    const requestData = {
      persona_id: selectedPedidor,
      precio_total,
      es_proveedor: tipoPedidor === "proveedor",
      productos,
      creador
    };

    fetch(`${apiUrl}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al cargar el pedido, verifique los datos ingresados");
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        if(result.message === 'Pedido creado con éxito') {
          actualizarStock();
          setSelectedPedidor("");
          setTipoPedidor("cliente");
          setFiltroBusqueda("");
          setSelectedProduct(data[0]);
        }

        alert(result.message);
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error("Error en la solicitud POST:", error);
      });
  };

  const actualizarStock = () => {
    const newData = [...data];

    for (const articulo of productosConfirmados) {
      const articuloIndex = newData.findIndex(
        (item) => item.numero_articulo === articulo.numero_articulo
      );

      if (articuloIndex !== -1) {
        for (const producto of articulo.productos) {
          const key = `${producto.color}-${producto.talle}`;
          const cantidad = articulo.cantidades[key] || 0;

          const productoIndex = newData[articuloIndex].productos.findIndex(
            (item) =>
              item.id === producto.id &&
              item.color === producto.color &&
              item.talle === producto.talle
          );

          if (productoIndex !== -1) {
            const cantidadConSigno =
              tipoPedidor === "cliente" ? -cantidad : cantidad;
            newData[articuloIndex].productos[productoIndex].stock +=
              cantidadConSigno;
          }
        }
      }
    }

    refreshArticulos(newData)
    setData(newData);
    setProductosConfirmados([]);
  };

  return (
    <>
      {(isLoading || isInitialLoading) && <Loading/>}
      <NavbarAdm selected={'Cargar Pedido'}/>
      <div className="contenedor-botones">
        <button
          id="btn-pedidor-cliente"
          className={
            tipoPedidor === "cliente"
              ? "boton-pedidor pedidor-seleccionado"
              : "boton-pedidor"
          }
          onClick={() => handleCambiarTipoPedidor("cliente")}
        >
          Cliente
        </button>
        <button
          className={
            tipoPedidor === "proveedor"
              ? "boton-pedidor pedidor-seleccionado"
              : "boton-pedidor"
          }
          onClick={() => handleCambiarTipoPedidor("proveedor")}
        >
          Proveedor
        </button>
      </div>
      <div className="input-selector">
        <Select
          options={pedidoresFiltrados.map((pedidor) => ({
            value: tipoPedidor === "cliente" ? pedidor.persona_id : pedidor.id,
            label: pedidor.nombre,
          }))}
          value={{
            label:
              filtroBusqueda ||
              `Seleccionar ${
                tipoPedidor === "cliente" ? "Cliente" : "Proveedor"
              }`,
          }}
          onChange={(selectedOption) => {
            setFiltroBusqueda(selectedOption.label || "");
            setSelectedPedidor(selectedOption.value);
          }}
          isSearchable
          noOptionsMessage={() =>
            `No existe el ${
              tipoPedidor === "cliente" ? "cliente" : "proveedor"
            }`
          }
        />
      </div>
      
      <section className="contenedor-tabla-grilla">
        <div style={{width: "20%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          <select value={selectedMarca} onChange={(e) => handleChangeMarca(e.target.value)} style={{marginLeft: "1rem", marginTop: "1rem", marginBottom: "1rem"}}>
              <option value="todas">Todas las marcas</option>
              {marcasData.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                  </option>
              ))}
          </select>

          <ListaArticulos articulos={data} onArticuloClick={handleProductClick} selectedArticulo={selectedProduct}/>
        </div>
        <div style={{width: "80%", display: "flex"}}>
          {selectedProduct && (
            <GrillaProductoPedido
              articulo={selectedProduct}
              onConfirmarProducto={handleConfirmarProducto}
              onBorrarConfirmarProducto={handleBorrarConfirmarProducto}
              onSetCantidades={handleCantidadesChange}
              tipoPedidor={tipoPedidor}
            />
          )}
        </div>
      </section>
      {productosConfirmados.length > 0 && (
      <>
        <GrillasProductosConfirmados articulos={productosConfirmados} flag_resumen={true} />
        <div className="centrar-boton-cargar">
          <button className="cargar-pedido-boton" onClick={handleCargarPedido}>
            Cargar Pedido
          </button>
        </div>
      </>
      )}
    </>
  );
};

export default CargarPedido;
