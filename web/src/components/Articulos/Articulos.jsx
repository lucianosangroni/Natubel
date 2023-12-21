import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import ModalProducto from "./ModalProducto";
import ListaArticulos from "../Common/ListaArticulos";
import GrillaProducto from "./GrillaProducto";
import { apiUrl } from "../../config/config";
import { Button } from "react-bootstrap";

const ListadoProductos = () => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const jwt = localStorage.getItem("jwt");

  //OBTENER ARTICULOS DB
  useEffect(() => {
    fetch(`${apiUrl}/articulos`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al buscar los datos, intente nuevamente");
          throw new Error("Error en la solicitud GET");
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
            descripcion: dataResult.descripcion,
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
      .catch((error) => {
        console.error("Error en la solicitud GET:", error);
      });
  }, [jwt]);

  //AGREGAR ARTICULO DB
  const handleAddArticulo = (newArticulo) => {
    const requestData = {
      numero_articulo: newArticulo.numero_articulo,
      descripcion: newArticulo.descripcion,
      precio_minorista: parseFloat(newArticulo.precio_minorista),
      precio_mayorista: parseFloat(newArticulo.precio_mayorista),
      precio_distribuidor: parseFloat(newArticulo.precio_distribuidor),
      talles: newArticulo.talles,
      colores: newArticulo.colores,
    };

    fetch(`${apiUrl}/articulos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al agregar articulo, verifique los datos ingresados");
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        const newArticuloData = {
          id: result.id,
          numero_articulo: newArticulo.numero_articulo,
          descripcion: newArticulo.descripcion,
          precio_minorista: newArticulo.precio_minorista,
          precio_mayorista: newArticulo.precio_mayorista,
          precio_distribuidor: newArticulo.precio_distribuidor,
          productos: result.productos,
        };
        setData((prevData) => [...prevData, newArticuloData]);
        setSelectedProduct(newArticuloData);
      })
      .catch((error) => {
        console.error("Error en la solicitud POST:", error);
      });
  };

  //EDITAR ARTICULO DB
  const handleEditProducto = (editProduct) => {
    const productos = editProduct.productos.map(({ id, talle, color }) => ({
      producto_id: id,
      talle,
      color,
    }));

    const requestData = {
      numero_articulo: editProduct.numero_articulo,
      descripcion: editProduct.descripcion,
      precio_minorista: parseFloat(editProduct.precio_minorista),
      precio_mayorista: parseFloat(editProduct.precio_mayorista),
      precio_distribuidor: parseFloat(editProduct.precio_distribuidor),
      talles: editProduct.talles,
      colores: editProduct.colores,
      productos: productos,
    };

    fetch(`${apiUrl}/articulos/${editProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al editar articulo, verifique los datos ingresados");
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then((result) => {
        const editArticuloData = {
          id: editProduct.id,
          numero_articulo: editProduct.numero_articulo,
          descripcion: editProduct.descripcion,
          precio_minorista: editProduct.precio_minorista,
          precio_mayorista: editProduct.precio_mayorista,
          precio_distribuidor: editProduct.precio_distribuidor,
          productos: result.productos,
        };

        setData((prevData) => {
          const updatedData = prevData.map((art) =>
            art.id === editArticuloData.id ? editArticuloData : art
          );
          return updatedData;
        });

        setSelectedProduct(editArticuloData);
      })
      .catch((error) => {
        console.error("Error en la solicitud PUT:", error);
      });
  };

  //ELIMINAR ARTICULO DB
  const handleDeleteProducto = (articulo) => {
    //const shouldDelete = window.confirm(
    //  "¿Estas seguro que deseas eliminar el articulo?"
    //);
    //if (shouldDelete) {
    //  fetch(`${apiUrl}/articulos/${articulo.id}`, {
    //    method: "DELETE",
    //    headers: {
    //      Authorization: `Bearer ${jwt}`,
    //    },
    //  })
    //    .then((response) => {
    //      if (!response.ok) {
    //        alert("Error al eliminar articulo, intente nuevamente");
    //        throw new Error("Error en la solicitud DELETE");
    //      }
    //      return response.json();
    //    })
    //    .then(() => {
    //      const updatedData = data.filter((art) => art.id !== articulo.id);
    //      setData(updatedData);
    //    })
    //    .catch((error) => {
    //      console.error("Error en la solicitud DELETE:", error);
    //    });
    //}
  };

  const handleArticuloClick = (product) => {
    setSelectedProduct(product);
  };

  const handleGenerarPDFAdmin = () => {
    fetch(`${apiUrl}/pdf/stock/admin`, {
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

  const handleGenerarPDFCliente = () => {
    fetch(`${apiUrl}/pdf/stock/cliente`, {
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
      <NavbarAdm selected={'Articulos'}/>
      <div className="table-productos-contenedor">
        <ListaArticulos articulos={data} onArticuloClick={handleArticuloClick}/>
        {selectedProduct && (
          <GrillaProducto
            articulo={selectedProduct}
            onEditProducto={handleEditProducto}
            onDeleteProducto={handleDeleteProducto}
          />
        )}
        <Button onClick={handleGenerarPDFAdmin} id="btnDescargarStock" style={{right: "180px"}}>Stock Admin</Button>
        <Button onClick={handleGenerarPDFCliente} id="btnDescargarStock" style={{right: "310px"}}>Stock Cliente</Button>
        <ModalProducto onAddProducto={handleAddArticulo} />
      </div>
    </>
  );
};

export default ListadoProductos;
