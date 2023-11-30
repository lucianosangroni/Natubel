import React, { useState, useEffect } from "react";
import GrillaProductosDePedido from "./GrillaProductosDePedido";
import { apiUrl } from "./config";

function ListaProductosDePedido({ pedido, onCambiarEstado }) {
    const [selectedArticulo, setSelectedArticulo] = useState(null);

    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
      setSelectedArticulo(null)
    }, [pedido]);

    const handleArticuloClick = (articulo) => {
        setSelectedArticulo(articulo);
      };

    const cambiarEstado = (nuevoEstado) => {
      if(pedido.tipo === "PROVEEDOR" && nuevoEstado === "CANCELADO") {
        alert("No puede cancelar un pedido de un proveedor")
        return
      }

      if(pedido.estado === nuevoEstado) {
        const estadoMinusculas = pedido.estado.toLowerCase()
        alert(`Este pedido ya está ${estadoMinusculas}`)
        return
      }

      const shouldCambiarEstado = window.confirm(
        `¿Estas seguro que quieres cambiar el estado del pedido a ${nuevoEstado}?`
      );
      if (!shouldCambiarEstado) {
        return;
      }

      const productos = pedido.productos.map(({id, productos_x_pedido}) => ({producto_id: id, cantidad: productos_x_pedido.cantidad}))

      const requestData = 
      {
        estado: nuevoEstado,
        razon_cancelado: "",
        productos
      }

      fetch(`${apiUrl}/pedidos/${pedido.numero_pedido}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(requestData)
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al cambiar el estado del pedido, intente nuevamente")
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then((result) => {
        onCambiarEstado(pedido.numero_pedido, nuevoEstado)
      })
      .catch((error) => {
          console.error("Error en la solicitud PUT:", error);
      });
    }

    return (
      <>
        <table className="table-cargarPedido-contenedor">
          <thead>
            <tr className="table-header-productos">
              <th className="table-header-articulos">Artículos</th>
            </tr>
          </thead>
          <tbody>
            {pedido.articulos.map((articulo) => (
              <tr key={articulo.id} onClick={() => handleArticuloClick(articulo)}>
                <td
                  className={`table-cell-productos ${
                    selectedArticulo && selectedArticulo.id === articulo.id ? "selected" : ""
                  }`}
                >
                  {articulo.numero_articulo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pedido.estado !== "CANCELADO" && (<>
        <button className="boton-estados cancelado" onClick={() => cambiarEstado('CANCELADO')}>Cancelar</button>
        <button className="boton-estados pedido" onClick={() => cambiarEstado('PEDIDO')}>Pedido</button>
        <button className="boton-estados enviado" onClick={() => cambiarEstado('ENVIADO')}>Enviado</button>
        <button className="boton-estados pagado" onClick={() => cambiarEstado('PAGADO')}>Pagado</button>
        <button className="boton-estados completado" onClick={() => cambiarEstado('COMPLETADO')}>Completado</button>
        </>
        )}

        
                {selectedArticulo && (
            <GrillaProductosDePedido
            articulo={selectedArticulo}
            productos={pedido.productos}
          />
        )}
        
      </>
    );
  }

export default ListaProductosDePedido;