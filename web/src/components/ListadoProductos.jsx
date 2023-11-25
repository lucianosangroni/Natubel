import React, { useState, useEffect } from "react";
import NavbarAdm from "../components/NavbarAdm";
import ModalProducto from "./ModalProducto";
import GrillaProducto from "./GrillaProducto";

const ListadoProductos = () => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const jwt = localStorage.getItem("jwt");

  //OBTENER ARTICULOS DB
  useEffect(() => {
    fetch(`http://localhost:3001/api/articulos`, {
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
            nombre: dataResult.nombre,
            descripcion: dataResult.descripcion,
            precio_unitario: dataResult.precio_unitario,
            productos,
          };

          if (productos.length > 0) articulos.push(articulo);
        }

        setData(articulos);
      })
      .catch((error) => {
        console.error("Error en la solicitud GET:", error);
      });
  }, [jwt]);

  //AGREGAR ARTICULO DB
  const handleAddArticulo = (newArticulo) => {
    const requestData = {
      numero_articulo: newArticulo.numero_articulo,
      nombre: newArticulo.nombre,
      descripcion: newArticulo.descripcion,
      precio_unitario: parseFloat(newArticulo.precio_unitario),
      talles: newArticulo.talles,
      colores: newArticulo.colores,
    };

    fetch(`http://localhost:3001/api/articulos`, {
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
          nombre: newArticulo.nombre,
          descripcion: newArticulo.descripcion,
          precio_unitario: newArticulo.precio_unitario,
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
      nombre: editProduct.nombre,
      descripcion: editProduct.descripcion,
      precio_unitario: parseFloat(editProduct.precio_unitario),
      talles: editProduct.talles,
      colores: editProduct.colores,
      productos: productos,
    };

    fetch(`http://localhost:3001/api/articulos/${editProduct.id}`, {
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
          nombre: editProduct.nombre,
          descripcion: editProduct.descripcion,
          precio_unitario: editProduct.precio_unitario,
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
    const shouldDelete = window.confirm(
      "¿Estas seguro que deseas eliminar el articulo?"
    );
    if (shouldDelete) {
      fetch(`http://localhost:3001/api/articulos/${articulo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            alert("Error al eliminar articulo, intente nuevamente");
            throw new Error("Error en la solicitud DELETE");
          }
          return response.json();
        })
        .then(() => {
          const updatedData = data.filter((art) => art.id !== articulo.id);
          setData(updatedData);
        })
        .catch((error) => {
          console.error("Error en la solicitud DELETE:", error);
        });
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <NavbarAdm />
      <div className="table-productos-contenedor">
        <table className="table-productos">
          <thead>
            <tr className="table-header-productos">
              <th className="table-header-articulos " >Artículos</th>
            </tr>
          </thead>
          <tbody className="tbody-articulos">
            {data.map((articulo) => (
              <tr
                key={articulo.id}
                onClick={() => handleProductClick(articulo)}
                className={
                  selectedProduct && selectedProduct.id === articulo.id
                    ? "selected-product"
                    : ""
                }
              >
                <td className="table-cell-productos">
                  {" "}
                  {articulo.numero_articulo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <GrillaProducto
            articulo={selectedProduct}
            onEditProducto={handleEditProducto}
            onDeleteProducto={handleDeleteProducto}
          />
        )}
        <ModalProducto onAddProducto={handleAddArticulo} />
      </div>
    </>
  );
};

export default ListadoProductos;
