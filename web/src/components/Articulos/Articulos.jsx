import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import ModalProducto from "./ModalProducto";
import ModalCategorias from "./ModalCategorias";
import ModalMarcas from "./ModalMarcas";
import ModalConfig from "./ModalConfig";
import ModalStock from "./ModalStock";
import ModalCupones from "./ModalCupones";
import ListaArticulos from "../Common/ListaArticulos";
import GrillaProducto from "./GrillaProducto";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";
import { useNavigate } from 'react-router-dom';

const ListadoProductos = () => {
  const { articulosData, categoriasData, marcasData, cuponesData, refreshCupones, refreshCategorias, refreshMarcas, refreshArticulos, isInitialLoading } = useData()
  const [data, setData] = useState(articulosData);
  const [categorias, setCategorias] = useState(categoriasData);
  const [marcas, setMarcas] = useState(marcasData);
  const [cupones, setCupones] = useState(cuponesData)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tipoStock, setTipoStock] = useState(null);
  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [isMarcasModalOpen, setIsMarcasModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isCuponesModalOpen, setIsCuponesModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  //OBTENER ARTICULOS DB
  useEffect(() => {
    setData(articulosData);
    setSelectedProduct(articulosData[0]);
    setCategorias(categoriasData)
    setMarcas(marcasData);
    setCupones(cuponesData)
  }, [categoriasData, marcasData, cuponesData, articulosData]);

  //AGREGAR ARTICULO DB
  const handleAddArticulo = (newArticulo) => {
    setIsLoading(true)

    const formData = new FormData();

    formData.append('numero_articulo', newArticulo.numero_articulo);
    const categoriasInt = newArticulo.categoria.map((categoria) => parseInt(categoria, 10));
    formData.append('categorias', JSON.stringify(categoriasInt));
    formData.append('marca_id', parseInt(newArticulo.marca));
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
          imagens: []
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
    formData.append('marca_id', parseInt(editProduct.marca));
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
          marca_id: parseInt(editProduct.marca),
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
    const shouldDelete = window.confirm(
      `¿Estas seguro que deseas eliminar el articulo ${articulo.numero_articulo}?`
    );
    if (shouldDelete) {
      setIsLoading(true)

      fetch(`${apiUrl}/articulos/${articulo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            alert("Error al eliminar articulo, intente nuevamente");
            throw new Error("Error en la solicitud DELETE");
          }
          return response.json();
        })
        .then((result) => {
          if(result.message === "Articulo eliminado con éxito") {
            const updatedData = data.filter((art) => art.id !== articulo.id);
            setData(updatedData);
            refreshArticulos(updatedData)
          }
          
          alert(result.message)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error en la solicitud DELETE:", error);
        });
    }
  };

  const handleArticuloClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAbrirModalStock = (tipo) => {
    setIsStockModalOpen(true)
    setTipoStock(tipo)
  }

  const handleGenerarPdf = (marcaElegida, flagSinStock) => {
    if(tipoStock === "Admin") {
      generarPDFAdmin(marcaElegida, flagSinStock)
    } else {
      generarPDFCliente(marcaElegida, flagSinStock)
    }
  }

  const generarPDFAdmin = (marcaElegida, flagSinStock) => {
    setIsLoading(true);
    
    const ventana = window.open(
      `${apiUrl}/pdf/stock-admin?marca=${encodeURIComponent(marcaElegida)}&flagSinStock=${flagSinStock}`,
      '_blank'
    );
    
    if (!ventana) {
      alert('Habilite las ventanas emergentes para ver o descargar el PDF');
    }
    
    setIsLoading(false);
  }

  const handlePrecios = () => {
    navigate('/admin/precios');
  }

  const handleCategorias = () => {
    setIsCategoriasModalOpen(true);
  }

  const handleMarcas = () => {
    setIsMarcasModalOpen(true);
  }

  const handleCupones = () => {
    setIsCuponesModalOpen(true)
  }

  const handleConfig = () => {
    setIsConfigModalOpen(true)
  }

  const generarPDFCliente = (marcaElegida, flagSinStock) => {
    setIsLoading(true);
    
    const ventana = window.open(
      `${apiUrl}/pdf/stock-cliente?marca=${encodeURIComponent(marcaElegida)}&flagSinStock=${flagSinStock}`,
      '_blank'
    );
    
    if (!ventana) {
      alert('Habilite las ventanas emergentes para ver o descargar el PDF');
    }
    
    setIsLoading(false);
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

  const handleNuevaMarca = (nuevaMarca) => {
    const requestData = {
      nombre: nuevaMarca
    }

    fetch(`${apiUrl}/marcas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al agregar marca, verifique los datos ingresados");
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        const newMarcas = [...marcas, {nombre: nuevaMarca, id: result.id}]
        refreshMarcas(newMarcas)
        setMarcas(newMarcas)
      })
      .catch((error) => {
        console.error("Error en la solicitud POST:", error);
      });
  }

  const handleEditMarca = (nuevaMarca) => {
    const requestData = {
      nombre: nuevaMarca.nombre
    }

    fetch(`${apiUrl}/marcas/${nuevaMarca.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Error al editar marca, verifique los datos ingresados");
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then(() => {
        const marcasActualizadas = marcas.map((marca) =>
          marca.id === nuevaMarca.id
            ? { ...marca, nombre: nuevaMarca.nombre }
            : marca
        );

        refreshMarcas(marcasActualizadas)
        setMarcas(marcasActualizadas);
      })
      .catch((error) => {
        console.error("Error en la solicitud POST:", error);
      });
  }

  const handleEliminarMarca = (marca)  => {
    const marcasActualizadas = marcas.filter((mar) => mar.id != marca.id)
    refreshMarcas(marcasActualizadas)
    setMarcas(marcasActualizadas)
  }

  const handleNuevoCupon = (nuevoCupon) => {
    const newCupones = [...cupones, nuevoCupon]
    refreshCupones(newCupones)
    setCupones(newCupones)
  }

  return (
    <>
      {(isLoading || isInitialLoading) && <Loading/>}
      <NavbarAdm selected={'Articulos'}/>
      <div className="table-productos-contenedor" style={{marginTop: "4.5rem"}}>
        <ListaArticulos articulos={data} onArticuloClick={handleArticuloClick} selectedArticulo={selectedProduct}/>
        {selectedProduct && (
          <GrillaProducto
            articulo={selectedProduct}
            onEditProducto={handleEditProducto}
            onDeleteProducto={handleDeleteProducto}
            categorias={categorias}
            marcas={marcas}
          />
        )}
        
        <Button onClick={handleCategorias} id="btnDescargarStock" style={{right: "180px", width: "145px"}}>Categorias</Button>
        <Button onClick={handleMarcas} id="btnDescargarStock" style={{right: "340px", width: "145px"}}>Marcas</Button>
        <Button onClick={handlePrecios} id="btnDescargarStock" style={{right: "500px" , width: "145px"}}>Precios</Button>
        <Button onClick={() => handleAbrirModalStock("Admin")} id="btnDescargarStock" style={{right: "660px", width: "145px"}}>Stock Admin</Button>
        <Button onClick={() => handleAbrirModalStock("Cliente")} id="btnDescargarStock" style={{right: "820px", width: "145px"}}>Stock Cliente</Button>
        <Button onClick={handleCupones} id="btnDescargarStock" style={{right: "980px", width: "145px"}}>Cupones</Button>   
        <Button onClick={handleConfig} id="btnDescargarStock" style={{right: "1140px", width: "145px"}}>Configuración</Button>
        {isCategoriasModalOpen && (
        <ModalCategorias
          data={categorias}
          onClose={() => setIsCategoriasModalOpen(false)}
          onNuevaCategoria={(nuevaCategoria) => handleNuevaCategoria(nuevaCategoria)}
          onEditCategoria={(nuevaCategoria) => handleEditCategoria(nuevaCategoria)}
          onEliminarCategoria={(categoria) => handleEliminarCategoria(categoria)}
        />
        )}
        {isMarcasModalOpen && (
        <ModalMarcas
          data={marcas}
          onClose={() => setIsMarcasModalOpen(false)}
          onNuevaMarca={(nuevaMarca) => handleNuevaMarca(nuevaMarca)}
          onEditMarca={(nuevaMarca) => handleEditMarca(nuevaMarca)}
          onEliminarMarca={(marca) => handleEliminarMarca(marca)}
        />
        )}
        {isCuponesModalOpen && (
          <ModalCupones
            data={cupones}
            onNuevoCupon={(nuevoCupon) => handleNuevoCupon(nuevoCupon)}
            onClose={() => setIsCuponesModalOpen(false)}
          />
        )}
        {isConfigModalOpen && (
        <ModalConfig
          onClose={() => setIsConfigModalOpen(false)}
        />
        )}
        {isStockModalOpen && (
          <ModalStock
            onClose={() => setIsStockModalOpen(false)}
            tipo={tipoStock}
            onGenerarPdf={handleGenerarPdf}
            marcas={marcas}
          />
        )}

        <ModalProducto categorias={categorias} marcas={marcas} onAddProducto={handleAddArticulo} />
      </div>
    </>
  );
};

export default ListadoProductos;