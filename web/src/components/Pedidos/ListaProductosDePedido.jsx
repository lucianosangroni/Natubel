import React, { useState, useEffect } from "react";
import GrillaProductosDePedido from "./GrillaProductosDePedido";
import { apiUrl, bearerToken } from "../../config/config";
import ListaArticulos from "../Common/ListaArticulos";
import Loading from "../Common/Loading";
import { useNavigate } from 'react-router-dom';
import { useData } from "../../context/DataContext";

function ListaProductosDePedido({ pedido, onCambiarEstado }) {
    const { clientesData, proveedoresData, facturasData } = useData()
    const [selectedArticulo, setSelectedArticulo] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

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

      if(nuevoEstado === "CANCELADO" && facturasData.find(fac => fac.pedido_id === pedido.numero_pedido).flag_imputada) {
        alert("No se puede cancelar un pedido que tiene su factura imputada")
        return
      }

      const shouldCambiarEstado = window.confirm(
        `¿Estas seguro que quieres cambiar el estado del pedido a ${nuevoEstado}?`
      );
      if (!shouldCambiarEstado) {
        return;
      }

      setIsLoading(true)

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
            Authorization: `Bearer ${bearerToken}`
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
        setIsLoading(false)
      })
      .catch((error) => {
          console.error("Error en la solicitud PUT:", error);
      });
    }

    const generarPdfPedido = () => {
      setIsLoading(true)

      fetch(`${apiUrl}/pdf/nota-pedido/${pedido.numero_pedido}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
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

        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error en la solicitud GET:', error);
      });
    }

    const redirectCuentaCorriente = () => {
      const nombrePersona = pedido.persona_nombre;
    
      const cliente = clientesData.find(cliente => cliente.nombre === nombrePersona);
      const proveedor = proveedoresData.find(proveedor => proveedor.nombre === nombrePersona);

      if (cliente) {
          navigate(`/admin/cuenta-corriente/${cliente.email}`);
      } else if (proveedor) {
          navigate(`/admin/cuenta-corriente/${proveedor.email}`);
      } else {
          alert("No se encontró la persona");
      }
    }

    const editarPedido = () => {
      const factura = facturasData.find(fac => fac.pedido_id === pedido.numero_pedido)
      if(factura.flag_imputada) {
        alert("No se puede editar el pedido ya que su factura está imputada")
      } else {
        navigate(`/admin/pedidos/${pedido.numero_pedido}`);
      }
    }

    return (
      <>
        {isLoading && <Loading/>}
      <div className="table-productos-contenedor">
        <ListaArticulos articulos={pedido.articulos} onArticuloClick={handleArticuloClick} selectedArticulo={selectedArticulo}/>

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
          <button className="boton-estados" onClick={() => redirectCuentaCorriente()} style={{ width: 150 }}>Cuenta Corriente</button>
          {pedido.tipo !== "PROVEEDOR" && (
            <>
            <button className="boton-estados" onClick={() => editarPedido()} style={{ width: 150 }}>Editar Pedido</button>
            </>
          )}
        </div>
        </>
        )}
      </div>
      </>
    );
  }

export default ListaProductosDePedido;