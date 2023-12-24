import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import Select from "react-select";
import GrillaProductoPedido from "./GrillaProductoPedido";
import GrillasProductosConfirmados from "./GrillaProductoConfirmado";
import { apiUrl } from "../../config/config";
import ListaArticulos from "../Common/ListaArticulos";

const CargarPedido = () => {
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [tipoPedidor, setTipoPedidor] = useState("cliente");
  const [selectedPedidor, setSelectedPedidor] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productosConfirmados, setProductosConfirmados] = useState([]);
  const [cantidadesArticuloActual, setCantidadesArticuloActual] = useState({});

  const jwt = localStorage.getItem("jwt");

  ////OBTENER ARTICULOS, CLIENTES Y PROVEEDORES DB
  useEffect(() => {
    let flag_error = false;

    const fetchArticulos = fetch(`${apiUrl}/articulos`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          flag_error = true;
        }
        return response.json();
      })
      .then((result) => {
        const articulos = [];
        for (const dataResult of result) {
          const productos = dataResult.productos.map(
            ({ id, color, talle, stock }) => ({ id, color, talle, stock })
          );
          const articulo = {
            id: dataResult.id,
            numero_articulo: dataResult.numero_articulo,
            precio_minorista: dataResult.precio_minorista,
            precio_mayorista: dataResult.precio_mayorista,
            precio_distribuidor: dataResult.precio_distribuidor,
            productos,
          };

          if (productos.length > 0) articulos.push(articulo);
        }

        setData(articulos);
        setSelectedProduct(articulos[0]);
      })
      .catch(() => {
        flag_error = true;
      });

    const fetchClientes = fetch(`${apiUrl}/clientes`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          flag_error = true;
        }
        return response.json();
      })
      .then((result) => {
        const dataClientes = result.map(({ tipo_cliente, persona }) => ({
          id: persona.id,
          nombre: persona.nombre,
          tipo_cliente 
        }));

        setClientes(dataClientes);
      })
      .catch(() => {
        flag_error = true;
      });

    const fetchProveedores = fetch(`${apiUrl}/proveedores`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          flag_error = true;
        }
        return response.json();
      })
      .then((result) => {
        const dataProveedores = result.map(({ id, nombre }) => ({
          id,
          nombre,
        }));

        setProveedores(dataProveedores);
      })
      .catch(() => {
        flag_error = true;
      });

    Promise.all([fetchArticulos, fetchClientes, fetchProveedores]).then(() => {
      if (flag_error) {
        alert("Error al buscar los datos, intente nuevamente");
      }
    });
  }, [jwt]);

  const handleCambiarTipoPedidor = (pedidor) => {
    setTipoPedidor(pedidor);
    setFiltroBusqueda("");
    setSelectedPedidor("");
  };

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
      const clienteSeleccionado = clientes.find(cliente => cliente.id === selectedPedidor);
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

    const clienteSeleccionado = clientes.find(cliente => cliente.id === selectedPedidor);
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
        Authorization: `Bearer ${jwt}`,
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
        alert(result.message);
        actualizarStock();
        setSelectedPedidor("");
        setTipoPedidor("cliente");
        setFiltroBusqueda("");
        setSelectedProduct(data[0]);
      })
      .catch((error) => {
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

    setData(newData);
    setProductosConfirmados([]);
  };

  return (
    <>
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
            value: pedidor.id,
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
        <ListaArticulos articulos={data} onArticuloClick={handleProductClick} selectedArticulo={selectedProduct}/>

        {selectedProduct && (
          <GrillaProductoPedido
            articulo={selectedProduct}
            onConfirmarProducto={handleConfirmarProducto}
            onBorrarConfirmarProducto={handleBorrarConfirmarProducto}
            onSetCantidades={handleCantidadesChange}
            tipoPedidor={tipoPedidor}
          />
        )}
      </section>
      {productosConfirmados.length > 0 && (
      <>
        <GrillasProductosConfirmados articulos={productosConfirmados} />
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
