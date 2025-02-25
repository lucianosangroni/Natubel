import React, { useContext, useEffect, useState } from "react";
import ItemList from "../itemList/ItemList";
import { useParams } from "react-router-dom";
import { useData } from '../../context/DataContext';
import Loading from "../loading/Loading";
import { CartContext } from "../../context/CartContext.jsx";
import ListasDePrecios from "../listasDePrecios/ListasDePrecios";
import { useForm } from "react-hook-form";
import { apiUrl, tokenBearer } from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemListContainer = ({ flagCatalogo }) => {
  const { articulosData, isInitialLoading } = useData();
  const [ articulos, setArticulos ] = useState(articulosData);
  const [ color, setColor ] = useState(null)
  const [ talle, setTalle ] = useState(null)
  const { categoria } = useParams();
  const [ categoriaAnterior, setCategoriaAnterior ] = useState(null);
  const [ productosFiltroTalles, setProductosFiltroTalles ] = useState(null);
  const [ talleAnterior, setTalleAnterior ] = useState(null);
  const [ productosFiltroColores, setProductosFiltroColores ] = useState(null);
  const [ flagOrdenar, setFlagOrdenar ] = useState(0);
  const { tipoPrecios, cliente, setClienteCart } = useContext(CartContext);
  const [ isLoading, setIsLoading ] = useState(false)

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail
  } = useForm();

  useEffect(() => {
    setArticulos(articulosData)
    setProductosFiltroColores(articulosData)
    setProductosFiltroTalles(articulosData)
  }, [articulosData])

  useEffect(() => {
    let articulosFiltrados = articulosData;

    if (categoria) {
      articulosFiltrados = articulosFiltrados.filter((articulo) => {
        const categorias = articulo.categoria.map(cat => cat.id);
        return categorias.includes(parseInt(categoria));
      });    
    } 

    if(categoria !== categoriaAnterior) {
      setProductosFiltroTalles(articulosFiltrados)
      setProductosFiltroColores(articulosFiltrados)
      setCategoriaAnterior(categoria)
    } else {
      if (talle) {
        articulosFiltrados = articulosFiltrados.filter((articulo) => {
          const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle.toUpperCase())));
          return talles.includes(talle)
        });
      }
  
      if(talle !== talleAnterior) {
        setProductosFiltroColores(articulosFiltrados)
        setTalleAnterior(talle)
      } else {
        if (color) {
          articulosFiltrados = articulosFiltrados.filter((articulo) => {
            const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color.toUpperCase())));
            return colores.includes(color)
          });
        }
      }
    }

    setFlagOrdenar(flagOrdenar + 1)
    setArticulos(articulosFiltrados)
  }, [categoria, talle, color]);

  const handleSetProductos = (productosOrdenados) => {
    setArticulos(productosOrdenados)
  }

  const handleChangeTalle = (talle) => {
    setTalle(talle)
  }

  const handleChangeColor = (color) => {
    setColor(color)
  }

  const onSubmitEmail = (emailData) => {
    setIsLoading(true)

    const requestData = {
      email: emailData.email,
      cuit_cuil: null,
      dni: null,
      nombre: null
    }

    fetch(`${apiUrl}/clientes/unico`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBearer}`
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
          throw new Error(`Error en la solicitud GET para el cliente ${emailData.email}`);
      }
      return response.json();
    })
    .then(result => {
      if (result.message === "Cliente encontrado con éxito" && result.cliente.tipo_cliente === "DISTRIBUIDOR") {
        const cliente = result.cliente
        setClienteCart(cliente)
      } else {
        toast.error(`No se encontró un cliente distribuidor con el email ${emailData.email}`, {
          position: "top-center",
          hideProgressBar: true,
          autoClose: 5000, 
          closeButton: false,
        });
      }

      setIsLoading(false)
    })
    .catch(error => {
      console.error(`Error en la solicitud GET para el cliente ${emailData.email}:`, error);
      setIsLoading(false)
    });
  }

  return (
    <div>
      {isInitialLoading && <Loading/>}
      {isLoading && <Loading/>}
      <ToastContainer position="top-right" hideProgressBar={false}/>
      {tipoPrecios() === "DISTRIBUIDOR" && cliente === null ? (
        <>
          <ListasDePrecios/>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p className="ingreseCodigo">Solo los distribuidores pueden acceder a esta lista de precios, si usted es distribuidor ingrese su email</p>
            <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
              <input
                    type="email" 
                    {...registerEmail("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
              <button className="confirmarCodigo" type="submit">Confirmar</button>
            </form>
          </div>
        </>
      ) : (
        <ItemList productos={articulos} productosFiltroTalles={productosFiltroTalles} productosFiltroColores={productosFiltroColores} flagCatalogo={flagCatalogo} setProductosContainer={handleSetProductos} onChangeTalleContainer={handleChangeTalle} onChangeColorContainer={handleChangeColor} flagOrdenar={flagOrdenar} />
      )}
    </div>
  );
};

export default ItemListContainer;
