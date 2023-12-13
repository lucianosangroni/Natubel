import React, { useState, useEffect } from "react";
import GrillaProductosDePedido from "./GrillaProductosDePedido";
import { apiUrl } from "../../config/config";
import ListaArticulos from "../Common/ListaArticulos";

function ListaProductosDePedido({ pedido, onCambiarEstado }) {
    const [selectedArticulo, setSelectedArticulo] = useState(null);

    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
      setSelectedArticulo(pedido.articulos[0])
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

    const generarPdfPedido = () => {
      fetch(`${apiUrl}/pdf/nota-pedido/${pedido.numero_pedido}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al generar el pdf, intente nuevamente");
          throw new Error("Error en la solicitud GET");
        }
        return response.blob();
      })
      .then((result) => {
        const url = URL.createObjectURL(result);
  
        const newWindow = window.open(url, '_blank');
  
        if (!newWindow) {
            alert('Habilite las ventanas emergentes para descargar el PDF');
        }
  
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error en la solicitud GET:', error);
      });
    }

    return (
      <>
      <div className="table-productos-contenedor">
        <ListaArticulos articulos={pedido.articulos} onArticuloClick={handleArticuloClick}/>

        {selectedArticulo && (
            <GrillaProductosDePedido
            articulo={selectedArticulo}
            productos={pedido.productos}
          />
        )}

        
        {pedido.estado !== "CANCELADO" && (<>
        <div className="contenedor-btns-estados">
          <button className={`boton-estados completado ${pedido.estado === 'COMPLETADO' ? 'selectedEstado' : ''}`} onClick={() => cambiarEstado('COMPLETADO')}>Completado</button>
          <button className={`boton-estados enviado ${pedido.estado === 'ENVIADO' ? 'selectedEstado' : ''}`} onClick={() => cambiarEstado('ENVIADO')}>Enviado</button>
          <button className={`boton-estados pagado ${pedido.estado === 'PAGADO' ? 'selectedEstado' : ''}`} onClick={() => cambiarEstado('PAGADO')}>Pagado</button>
          <button className={`boton-estados pedido ${pedido.estado === 'PEDIDO' ? 'selectedEstado' : ''}`} onClick={() => cambiarEstado('PEDIDO')}>Pedido</button>
          <button className="boton-estados cancelado" onClick={() => cambiarEstado('CANCELADO')} style={{ marginBottom: 20 }}>Cancelado</button>
        </div>
        <div className="contenerdor-btns-pdfs-pedido">
          <button className="boton-estados" onClick={() => generarPdfPedido()} style={{ width: 150 }}>Nota De Pedido</button>
          <button className="boton-estados" onClick={() => generarPdfPedido()} style={{ width: 150 }}>Remito</button>
        </div>
        </>
        )}
      </div>
      </>
    );
  }

export default ListaProductosDePedido;