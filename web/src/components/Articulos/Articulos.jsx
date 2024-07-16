import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import ModalProducto from "./ModalProducto";
import ModalCategorias from "./ModalCategorias";
import ModalConfig from "./ModalConfig";
import ListaArticulos from "../Common/ListaArticulos";
import GrillaProducto from "./GrillaProducto";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";
import { useNavigate } from 'react-router-dom';

const ListadoProductos = () => {
  const { articulosData, categoriasData, refreshCategorias, refreshArticulos, isInitialLoading } = useData()
  const [data, setData] = useState(articulosData);
  const [categorias, setCategorias] = useState(categoriasData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  //OBTENER ARTICULOS DB
  useEffect(() => {
    setData(articulosData);
    setSelectedProduct(articulosData[0]);
    setCategorias(categoriasData)
  }, [categoriasData, articulosData]);

  //AGREGAR ARTICULO DB
  const handleAddArticulo = (newArticulo) => {
    setIsLoading(true)

    const formData = new FormData();

    formData.append('numero_articulo', newArticulo.numero_articulo);
    const categoriasInt = newArticulo.categoria.map((categoria) => parseInt(categoria, 10));
    formData.append('categorias', JSON.stringify(categoriasInt));
    formData.append('descripcion', newArticulo.descripcion);
    formData.append('precio_minorista', parseFloat(newArticulo.precio_minorista));
    formData.append('precio_mayorista', parseFloat(newArticulo.precio_mayorista));
    formData.append('precio_distribuidor', parseFloat(newArticulo.precio_distribuidor));
    formData.append('talles', JSON.stringify(newArticulo.talles));
    formData.append('colores', JSON.stringify(newArticulo.colores));

    newArticulo.imagens.forEach((file) => {
      formData.append('files', file);
    });

    fetch(`${apiUrl}/articulos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al agregar articulo, verifique los datos ingresados");
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        const categoriasNewArticulo = categorias.filter(cat => newArticulo.categoria.includes(cat.id.toString()))

        const newArticuloData = {
          id: result.id,
          numero_articulo: newArticulo.numero_articulo,
          categoria: categoriasNewArticulo,
          descripcion: newArticulo.descripcion,
          precio_minorista: newArticulo.precio_minorista,
          precio_mayorista: newArticulo.precio_mayorista,
          precio_distribuidor: newArticulo.precio_distribuidor,
          productos: result.productos,
          imagens: result.imagenes
        };
        const dataActualizada = [...data, newArticuloData];
        
        setData(dataActualizada);
        refreshArticulos(dataActualizada)
        setSelectedProduct(newArticuloData);

        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error("Error en la solicitud POST:", error);
      });
  };

  //EDITAR ARTICULO DB
  const handleEditProducto = (editProduct) => {
    setIsLoading(true)

    const productos = editProduct.productos.map(({ id, talle, color }) => ({
      producto_id: id,
      talle,
      color,
    }));

    const formData = new FormData();

    formData.append('numero_articulo', editProduct.numero_articulo);
    const categoriasInt = editProduct.categoria.map((categoria) => parseInt(categoria, 10));
    formData.append('categorias', JSON.stringify(categoriasInt));
    formData.append('descripcion', editProduct.descripcion);
    formData.append('precio_minorista', parseFloat(editProduct.precio_minorista));
    formData.append('precio_mayorista', parseFloat(editProduct.precio_mayorista));
    formData.append('precio_distribuidor', parseFloat(editProduct.precio_distribuidor));
    formData.append('talles', JSON.stringify(editProduct.talles));
    formData.append('colores', JSON.stringify(editProduct.colores));
    formData.append('productos', JSON.stringify(productos));
    formData.append('imagenesRemove', JSON.stringify(editProduct.imagenesRemove))

    editProduct.imagenesAdd.forEach((file) => {
      formData.append('files', file);
    });

    fetch(`${apiUrl}/articulos/${editProduct.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al editar articulo, verifique los datos ingresados");
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then((result) => {
        const categoriasEditArticulo = categorias.filter(cat => editProduct.categoria.includes(cat.id))
        const nuevasImagenes = editProduct.imagens.filter(imagen => !editProduct.imagenesRemove.includes(imagen.id))
        nuevasImagenes.push(...result.imagenesNuevas);

        const editArticuloData = {
          id: editProduct.id,
          numero_articulo: editProduct.numero_articulo,
          categoria: categoriasEditArticulo,
          descripcion: editProduct.descripcion,
          precio_minorista: editProduct.precio_minorista,
          precio_mayorista: editProduct.precio_mayorista,
          precio_distribuidor: editProduct.precio_distribuidor,
          productos: result.productos,
          imagens: nuevasImagenes,
        };

        const dataActualizada = data.map((art) =>
          art.id === editArticuloData.id ? editArticuloData : art
        );

        setData(dataActualizada);
        refreshArticulos(dataActualizada)
        setSelectedProduct(editArticuloData);

        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
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
    //      Authorization: `Bearer ${bearerToken}`,
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
    setIsLoading(true)

    fetch(`${apiUrl}/pdf/stock/admin`, {
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

  const handlePrecios = () => {
    navigate('/admin/precios');
  }

  const handleCategorias = () => {
    setIsCategoriasModalOpen(true);
  }

  const handleConfig = () => {
    setIsConfigModalOpen(true)
  }

  const handleGenerarPDFCliente = () => {
    setIsLoading(true)

    fetch(`${apiUrl}/pdf/stock/cliente`, {
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

  const handleNuevaCategoria = (nuevaCategoria) => {
    const requestData = {
      nombre: nuevaCategoria
    }

    fetch(`${apiUrl}/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al agregar categoria, verifique los datos ingresados");
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        const newCategorias = [...categorias, {nombre: nuevaCategoria, id: result.id}]
        refreshCategorias(newCategorias)
        setCategorias(newCategorias)
      })
      .catch((error) => {
        console.error("Error en la solicitud POST:", error);
      });
  }

  const handleEditCategoria = (nuevaCategoria) => {
    const requestData = {
      nombre: nuevaCategoria.nombre
    }

    fetch(`${apiUrl}/categorias/${nuevaCategoria.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al editar categoria, verifique los datos ingresados");
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then(() => {
        const categoriasActualizadas = categorias.map((categoria) =>
          categoria.id === nuevaCategoria.id
            ? { ...categoria, nombre: nuevaCategoria.nombre }
            : categoria
        );

        refreshCategorias(categoriasActualizadas)
        setCategorias(categoriasActualizadas);
      })
      .catch((error) => {
        console.error("Error en la solicitud POST:", error);
      });
  }

  const handleEliminarCategoria = (categoria)  => {
    const categoriasActualizadas = categorias.filter((cat) => cat.id != categoria.id)
    refreshCategorias(categoriasActualizadas)
    setCategorias(categoriasActualizadas)
  }

  return (
    <>
      {(isLoading || isInitialLoading) && <Loading/>}
      <NavbarAdm selected={'Articulos'}/>
      <div className="table-productos-contenedor">
        <ListaArticulos articulos={data} onArticuloClick={handleArticuloClick} selectedArticulo={selectedProduct}/>
        {selectedProduct && (
          <GrillaProducto
            articulo={selectedProduct}
            onEditProducto={handleEditProducto}
            onDeleteProducto={handleDeleteProducto}
            categorias={categorias}
          />
        )}
        <Button onClick={handleConfig} id="btnDescargarStock" style={{right: "820px", width: "145px"}}>Configuración</Button>
        <Button onClick={handleGenerarPDFCliente} id="btnDescargarStock" style={{right: "660px", width: "145px"}}>Stock Cliente</Button>
        <Button onClick={handleGenerarPDFAdmin} id="btnDescargarStock" style={{right: "500px", width: "145px"}}>Stock Admin</Button>
        <Button onClick={handlePrecios} id="btnDescargarStock" style={{right: "340px" , width: "145px"}}>Precios</Button>
        <Button onClick={handleCategorias} id="btnDescargarStock" style={{right: "180px", width: "145px"}}>Categorias</Button>
        {isCategoriasModalOpen && (
        <ModalCategorias
          data={categorias}
          onClose={() => setIsCategoriasModalOpen(false)}
          onNuevaCategoria={(nuevaCategoria) => handleNuevaCategoria(nuevaCategoria)}
          onEditCategoria={(nuevaCategoria) => handleEditCategoria(nuevaCategoria)}
          onEliminarCategoria={(categoria) => handleEliminarCategoria(categoria)}
        />
        )}
        {isConfigModalOpen && (
        <ModalConfig
          onClose={() => setIsConfigModalOpen(false)}
        />
        )}

        <ModalProducto categorias={categorias} onAddProducto={handleAddArticulo} />
      </div>
    </>
  );
};

export default ListadoProductos;