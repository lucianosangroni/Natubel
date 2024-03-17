import { useForm } from "react-hook-form";
import "./formularioCompra.css";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext.jsx"
import { useData } from "../../context/DataContext.jsx";
import { apiUrl, tokenBearer } from "../../config/config";
import { Navigate } from "react-router-dom";

const FormularioCompra = () => {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors },
  } = useForm();
  const {
    register: registerCodigo,
    handleSubmit: handleSubmitCodigo
  } = useForm();

  const { refreshData } = useData()

  const {
    verificarStock,
    tipoPrecios,
    precioTotal,
    vaciarCarrito,
    precioTotalMayorista,
    precioTotalDistribuidor,
    setTipoPrecios
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])
  const [ showCompraFinalizada, setShowCompraFinalizada ] = useState(false);
  const [ showIngresarCodigo, setShowIngresarCodigo ] = useState(false);
  const [ codigo, setCodigo ] = useState(null)
  const [ formulario, setFormulario] = useState(null)
  const [ compraMinimaMayorista ] = useState(25000)
  const [ compraMinimaDistribuidor ] = useState(200000)
  const [ shouldRedirect, setShouldRedirect ] = useState(false)
  const [ cliente, setCliente ] = useState(null)

  useEffect(() => {
    const nuevoCarrito = verificarStock();
    setCarrito(nuevoCarrito);
  }, []);

  const enviarCodigo = (email) => {
    const newCodigo = Math.floor(Math.random() * 9000) + 1000;

    setCodigo(newCodigo)

    const requestData = {
      email,
      codigo: newCodigo
    }

    fetch(`${apiUrl}/email`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBearer}`
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud POST");
      }
      return response.json();
    })
    .catch(error => {
        console.error("Error en la solicitud POST:", error);
    });
  }

  const reenviarCodigo = () => {
    enviarCodigo(formulario.email)
    alert("Código enviado")
  }

  const onSubmitForm = (formData) => {
    const requestData = {
      email: formData.email,
      cuit_cuil: formData.cuitCuil,
      dni: formData.dni,
      nombre: formData.nombreCompleto
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
          throw new Error(`Error en la solicitud GET para el cliente ${formData.email}`);
      }
      return response.json();
    })
    .then(result => {
      if (result.message === "Persona no encontrada") {
        const tipoPreciosQueCorresponde = 
          precioTotalMayorista() >= compraMinimaMayorista && precioTotalDistribuidor() < compraMinimaDistribuidor ? "MAYORISTA"
          : precioTotalDistribuidor() >= compraMinimaDistribuidor ? "DISTRIBUIDOR"
          : "MINORISTA";

          if(tipoPrecios() === tipoPreciosQueCorresponde) {  
            enviarCodigo(formData.email)
            setShowIngresarCodigo(true)
            setFormulario(formData)
          } else {
            setTipoPrecios(tipoPreciosQueCorresponde)
            setShouldRedirect(true)
            alert("El monto de su pedido no corresponde con la lista de precios. Por favor verifique su pedido con los precios correspondientes.")
          }
      } else if (result.message === "Cliente encontrado con éxito") {
        const cliente = result.cliente

        let tipoPreciosQueCorresponde;

        switch (cliente.tipo_cliente) {
          case "MINORISTA": 
          tipoPreciosQueCorresponde = 
            precioTotalMayorista() >= compraMinimaMayorista && precioTotalDistribuidor() < compraMinimaDistribuidor ? "MAYORISTA"
            : precioTotalDistribuidor() >= compraMinimaDistribuidor ? "DISTRIBUIDOR"
            : "MINORISTA";
          break;
          case "MAYORISTA":
            tipoPreciosQueCorresponde = precioTotalDistribuidor() >= compraMinimaDistribuidor ? "DISTRIBUIDOR" : "MAYORISTA";
          break;
          case "DISTRIBUIDOR":
            tipoPreciosQueCorresponde = "DISTRIBUIDOR"
          break;
        }

        if(tipoPrecios() === tipoPreciosQueCorresponde) {  
          enviarCodigo(formData.email)
          setShowIngresarCodigo(true)
          setFormulario(formData)
          setCliente(cliente)
        } else {
          setTipoPrecios(tipoPreciosQueCorresponde)
          setShouldRedirect(true)
          alert("El monto de su pedido no corresponde con la lista de precios. Por favor verifique su pedido con los precios correspondientes.")
        }
      } else {
        alert(result.message)
      }
    })
    .catch(error => {
      console.error(`Error en la solicitud GET para el cliente ${formData.email}:`, error);
    });
  }

  const onSubmitCodigo = (CodigoData) => {
    if(parseInt(CodigoData.codigo) === codigo) {
      enviarPedido()
    } else {
      alert("Codigo incorrecto")
    }
  }

  const enviarPedido = () => {
    if (cliente) {
      const requestDataUpdateCliente = {
        nombre: formulario.nombreCompleto,
        dni: formulario.dni !== '' ? parseInt(formulario.dni) : (cliente.dni === null ? null : parseInt(cliente.dni)),
        cuit_cuil: formulario.cuitCuil !== '' ? parseInt(formulario.cuitCuil) : (cliente.persona.cuit_cuil === null ? null : parseInt(cliente.persona.cuit_cuil)),
        email: formulario.email,
        telefono: formulario.telefono.trim() !== '' ? formulario.telefono : cliente.persona.telefono,
        tipo_cliente: tipoPrecios().toUpperCase(),
        forma_de_envio: formulario.forma_de_envio.trim() !== '' ? formulario.forma_de_envio : cliente.forma_de_envio,
        direccion: formulario.direccion.trim() !== '' ? formulario.direccion : cliente.persona.direccion,
        codigo_postal: formulario.cp.trim() !== '' ? formulario.cp : cliente.codigo_postal,
        ciudad: formulario.ciudad.trim() !== '' ? formulario.ciudad : cliente.ciudad,
        provincia: formulario.provincia.trim() !== '' ? formulario.provincia : cliente.provincia,
        persona_id: cliente.persona_id,
      }

      fetch(`${apiUrl}/clientes/${cliente.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenBearer}`
        },
        body: JSON.stringify(requestDataUpdateCliente)
      })
      .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud GET para el cliente ${formulario.email}`);
        }
        return response.json();
      })
      .then(result => {
        if(result.message !== "Cliente editado con éxito") {
          alert(result.message)
        } else {
          crearPedido(cliente.persona_id)
        }
      })
      .catch(error => {
        console.error(`Error en la solicitud GET para el cliente ${formulario.email}:`, error);
      });
    } else {
      const requestDataNewCliente = {
        nombre: formulario.nombreCompleto,
        dni: formulario.dni === "" ? null : parseInt(formulario.dni),
        cuit_cuil: formulario.cuitCuil === "" ? null : parseInt(formulario.cuitCuil),
        email: formulario.email,
        telefono: formulario.telefono,
        tipo_cliente: tipoPrecios().toUpperCase(),
        forma_de_envio: formulario.forma_de_envio,
        direccion: formulario.direccion,
        codigo_postal: formulario.cp,
        ciudad: formulario.ciudad,
        provincia: formulario.provincia
      }
    
      fetch(`${apiUrl}/clientes`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenBearer}`
        },
        body: JSON.stringify(requestDataNewCliente)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        if(result.message !== 'Cliente creado con éxito') {
          alert(result.message)
        } else {
          crearPedido(result.persona_id)
        }
      })
      .catch(error => {
          console.error("Error en la solicitud POST:", error);
      });
    }
  };

  const crearPedido = (persona_id) => {
    const productos = [];

    for(const prod of carrito) {
      const newProd = {
        producto_id: prod.id,
        cantidad: prod.cantidad,
        precio_unitario: tipoPrecios() === "MINORISTA" ? parseFloat(prod.precio_minorista) : (tipoPrecios() === "MAYORISTA" ? parseFloat(prod.precio_mayorista) : parseFloat(prod.precio_distribuidor))
      }

      productos.push(newProd)
    }

    const requestDataPedido = {
      persona_id,
      precio_total: parseFloat(precioTotal(tipoPrecios())),
      es_proveedor: false,
      creador: "Natubel.com.ar",
      productos
    }

    fetch(`${apiUrl}/pedidos`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenBearer}`
      },
      body: JSON.stringify(requestDataPedido),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud POST");
      }
      return response.json();
    })
    .then((result) => {
      setShowCompraFinalizada(true);
      vaciarCarrito();
      refreshData();
    })
    .catch((error) => {
      console.error("Error en la solicitud POST:", error);
    });
  }

  const validateDni = (value) => {
    if (!value) return true;
    return /^[0-9]{8}$/.test(value);
  };

  const validateCuit = (value) => {
    if (!value) return true;
    return /^[0-9]{11}$/.test(value);
  }


  return (
    <>
      {shouldRedirect && <Navigate to="/carrito" />}
      <div className="container">
        {showCompraFinalizada ? (
          <div className="compraFinalizadaContainer">
            <div className="compraFinalizada">
              <p>
                Pedido exitoso! En breve nos comunicaremos para coordinar
                el pago y el envío. ¡Muchas gracias!
              </p>
            </div>
          </div>
        ) : showIngresarCodigo ? (
          <>
            <p>Ingrese el código que se le envío al mail {formulario.email}</p>
            <form onSubmit={handleSubmitCodigo(onSubmitCodigo)}>
              <input type="text" {...registerCodigo('codigo')}/>
              <button type="submit">Confirmar</button>
            </form>
            <button onClick={() => reenviarCodigo()}>Reenviar mail</button>
          </>
        ) : (
          <>
            {carrito.length > 0 ? (
              <form onSubmit={handleSubmitForm(onSubmitForm)}>
                <div className="formulario">
                  <label>Email:</label>
                  <input
                    type="email"
                    {...registerForm("email", {
                      required: "Este campo es obligatorio.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="obligatorio">{errors.email.message}</p>
                  )}
                </div>
                <div className="formulario">
                  <label>Nombre completo:</label>
                  <input
                    type="text"
                    {...registerForm("nombreCompleto", { required: true })}
                  />
                  {errors.nombreCompleto && (
                    <p className="obligatorio">Este campo es obligatorio.</p>
                  )}
                </div>
                <div className="formulario">
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    {...registerForm("telefono", { required: true })}
                  />
                  {errors.telefono && (
                    <p className="obligatorio">Este campo es obligatorio.</p>
                  )}
                </div>
                <div className="formulario">
                  <label>DNI:</label>
                  <input
                    type="text"
                    {...registerForm("dni", { validate: validateDni })}
                  />
                  {errors.dni && <p className="obligatorio">Debe tener 8 dígitos.</p>}
                </div>
                <div className="formulario">
                  <label>CUIT / CUIL:</label>
                  <input
                    type="text"
                    {...registerForm("cuitCuil", { validate: validateCuit })}
                  />
                  {errors.cuitCuil && <p className="obligatorio">Debe tener 11 dígitos.</p>}
                </div>
                <div className="formulario">
                  <label>Forma de Envío:</label>
                  <input type="text" {...registerForm("forma_de_envio")} />
                </div>
                <div className="formulario">
                  <label>Dirección:</label>
                  <input type="text" {...registerForm("direccion")} />
                </div>
                <div className="formulario">
                  <label>Código Postal:</label>
                  <input type="text" {...registerForm("cp")} />
                </div>
                <div className="formulario">
                  <label>Ciudad:</label>
                  <input type="text" {...registerForm("ciudad")} />
                </div>
                <div className="formulario">
                  <label>Provincia:</label>
                  <input type="text" {...registerForm("provincia")} />
                </div>
                <div className="container-enviar">
                  <button className="enviar" type="submit">
                    Finalizar compra
                  </button>
                </div>
              </form>
            ) : (
              <div className="carritoVacioContainer">
                <h2 className="carritoVacio">El carrito está vacío...</h2>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FormularioCompra;
