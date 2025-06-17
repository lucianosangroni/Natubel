import { useForm } from "react-hook-form";
import "./formularioCompra.css";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext.jsx"
import { useData } from "../../context/DataContext.jsx";
import { apiUrl, tokenBearer } from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading/Loading";
import whatsapp from "./whatsapp.svg";

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

  const { refreshData, montoMinimoMayorista, montoMinimoDistribuidor, isInitialLoading } = useData()

  const [ isLoading, setIsLoading ] = useState(false)

  const {
    verificarStock,
    tipoPrecios,
    precioTotal,
    vaciarCarrito,
    precioTotalMayorista,
    precioTotalDistribuidor,
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])
  const [ showCompraFinalizada, setShowCompraFinalizada ] = useState(false);
  const [ showFalloPedido, setShowFalloPedido ] = useState(false)
  const [ showIngresarCodigo, setShowIngresarCodigo ] = useState(false);
  const [ codigo, setCodigo ] = useState(null)
  const [ formulario, setFormulario] = useState(null)
  const [ cliente, setCliente ] = useState(null)
  const [isOtroSelected, setIsOtroSelected] = useState(false);

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

    fetch(`${apiUrl}/email/codigo`, {
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
    setIsLoading(true)
    enviarCodigo(formulario.email)
    setIsLoading(false)
    toast.success("Codigo enviado", {
      position: "top-center",
      hideProgressBar: true,
      autoClose: 1300, 
      closeButton: false,
    });
  }

  const onSubmitForm = (formData) => {
    setIsLoading(true)

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
          precioTotalMayorista() >= montoMinimoMayorista && precioTotalDistribuidor() < montoMinimoDistribuidor ? "MAYORISTA"
          : precioTotalDistribuidor() >= montoMinimoDistribuidor ? "DISTRIBUIDOR"
          : "MINORISTA";

          if(tipoPrecios() === tipoPreciosQueCorresponde) {  
            if(tipoPreciosQueCorresponde === "DISTRIBUIDOR") {
              toast(
                <div style={{ textAlign: "center" }}>
                    El monto de tu pedido corresponde a la lista DISTRIBUIDOR pero es necesario contar con un email de un cliente distribuidor. 
                    Si ya has hecho una compra previa con la lista DISTRIBUIDOR continua e ingresa el email que usaste en tu compra previa,
                    de lo contrario comunicate por WhatsApp y envía una foto del resumen de tu pedido el cual puedes encontrar en formato "grilla" en la pantalla "Compra rapida".
                </div>,
                {
                    position: "top-center",
                    hideProgressBar: true,
                    autoClose: false,
                    closeButton: true
                }
              );
            } else {
              enviarCodigo(formData.email)
              setShowIngresarCodigo(true)
              setFormulario(formData)
            }
          } else {
            toast.error(`El monto de tu pedido no corresponde a la lista ${tipoPrecios()}, sino a la lista ${tipoPreciosQueCorresponde}. 
              Cambia la lista de precios en el carrito y vuelve a intentar.`, {
                position: "top-center",
                hideProgressBar: true,
                autoClose: 6000, 
                closeButton: false,
            });
          }
      } else if (result.message === "Cliente encontrado con éxito") {
        const cliente = result.cliente

        let tipoPreciosQueCorresponde;

        switch (cliente.tipo_cliente) {
          case "MINORISTA": 
          tipoPreciosQueCorresponde = 
            precioTotalMayorista() >= montoMinimoMayorista && precioTotalDistribuidor() < montoMinimoDistribuidor ? "MAYORISTA"
            : precioTotalDistribuidor() >= montoMinimoDistribuidor ? "DISTRIBUIDOR"
            : "MINORISTA";
          break;
          case "MAYORISTA":
            tipoPreciosQueCorresponde = precioTotalDistribuidor() >= montoMinimoDistribuidor ? "DISTRIBUIDOR" : "MAYORISTA";
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
          toast.error(`El monto de tu pedido no corresponde a la lista ${tipoPrecios()}, sino a la lista ${tipoPreciosQueCorresponde}. 
              Cambia la lista de precios en el carrito y vuelve a intentar.`, {
                position: "top-center",
                hideProgressBar: true,
                autoClose: 6000, 
                closeButton: false,
          });
        }
      }

      setIsLoading(false)
    })
    .catch(error => {
      setIsLoading(false)
      console.error(`Error en la solicitud GET para el cliente ${formData.email}:`, error);
    });
  }

  const onSubmitCodigo = (CodigoData) => {
    if(parseInt(CodigoData.codigo) === codigo) {
      setIsLoading(true)
      enviarPedido()
    } else {
      toast.error("Codigo incorrecto.", {
        position: "top-center",
        hideProgressBar: true,
        autoClose: 1300, 
        closeButton: false,
        
      });      
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
        tipo_envio: formulario.tipo_envio,
        forma_de_envio: formulario.forma_de_envio !== "OTRO" ? formulario.forma_de_envio : formulario.otro_transporte ? formulario.otro_transporte : "",
        direccion: formulario.direccion.trim() !== '' ? formulario.direccion : cliente.persona.direccion,
        codigo_postal: formulario.cp.trim() !== '' ? formulario.cp : cliente.codigo_postal,
        ciudad: formulario.ciudad.trim() !== '' ? formulario.ciudad : cliente.ciudad,
        provincia: formulario.provincia.trim() !== '' ? formulario.provincia : cliente.provincia,
        persona_id: cliente.persona_id,
        descuento: cliente.descuento
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
          toast.warning(result.message, {
            position: "top-center",
            hideProgressBar: true,
            autoClose: 2000, 
            closeButton: false,
          });
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
        tipo_envio: formulario.tipo_envio,
        tipo_cliente: tipoPrecios().toUpperCase(),
        forma_de_envio: formulario.forma_de_envio !== "OTRO" ? formulario.forma_de_envio : formulario.otro_transporte ? formulario.otro_transporte : "",
        direccion: formulario.direccion,
        codigo_postal: formulario.cp,
        ciudad: formulario.ciudad,
        provincia: formulario.provincia,
        descuento: 0
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
          toast.warning(result.message, {
            position: "top-center",
            hideProgressBar: true,
            autoClose: 2000, 
            closeButton: false,
          });
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
      creador: "BenkaLenceria.com.ar",
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
      if(result.message === "Pedido creado con éxito") {
        setIsLoading(false)
        setShowCompraFinalizada(true);
        vaciarCarrito();
        refreshData();
        enviarMailPedido(result.numero_pedido)
      } else {
        setIsLoading(false)
        refreshData();
        setShowFalloPedido(true)
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud POST:", error);
    });
  }

  const enviarMailPedido = (numero_pedido) => {
    fetch(`${apiUrl}/pdf/nota-pedido/${numero_pedido}`, {
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud GET");
      }
      return response.blob();
    })
    .then((blob) => {
      const formData = new FormData();
      formData.append("file", blob, `pedido_${numero_pedido}.pdf`)
      formData.append('email', formulario.email);

      fetch(`${apiUrl}/email/pedido`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenBearer}`
        },
        body: formData
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        setIsLoading(false)
      })
      .catch(error => {
          setIsLoading(false)
          console.error("Error en la solicitud POST:", error);
      });
    })
    .catch((error) => {
      setIsLoading(false)
      console.error('Error en la solicitud GET:', error);
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
      {isInitialLoading && <Loading/>}
      {isLoading && <Loading/>}
      <ToastContainer position="top-right" hideProgressBar={false}/>
      <div className="container">
        {showCompraFinalizada ? (
          <div className="compraFinalizadaContainer">
            <div className="compraFinalizada">
              <p>
                Pedido exitoso! Comuniquese por WhatsApp para coordinar el pago y el envío.
                ¡Muchas gracias!
              </p>
              <a 
                href="https://api.whatsapp.com/send?phone=5491131109942"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img style={{marginTop: "1rem", marginBottom: "3px"}} src={whatsapp} alt="Contactar por WhatsApp" />
              </a>
              <p>+54 9 11 3110-9942</p>
            </div>
          </div>
        ) : showFalloPedido ? (
          <div className="compraFinalizadaContainer">
            <div className="compraFinalizada">
              <p>
                Detectamos una falta de stock al momento de confirmar tu pedido. 
                Verifica los productos de tu pedido en el carrito y vuelve a intentarlo.
              </p>
            </div>
          </div>
        ) : showIngresarCodigo ? (
          <>
            <p className="ingreseCodigo">Ingrese el código que se le envío al mail {formulario.email}</p>
            <form onSubmit={handleSubmitCodigo(onSubmitCodigo)}>
              <input type="text" {...registerCodigo('codigo')}/>
              <button className="confirmarCodigo" type="submit">Confirmar</button>
            </form>
            <button className="reenviarCodigo" onClick={() => reenviarCodigo()}>Reenviar código</button>
          </>
        ) : (
          <>
            {carrito.length > 0 ? (
              <form onSubmit={handleSubmitForm(onSubmitForm)}>
                <div className="formulario">
                  <div className="casilla-asterisk-container">
                    <label>Email: </label>
                    <span class="required-asterisk-cel">*</span>
                  </div>
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
                  <span class="required-asterisk">*</span>
                  {errors.email && (
                    <p className="obligatorio">{errors.email.message}</p>
                  )}
                </div>
                <div className="formulario">
                  <div className="casilla-asterisk-container">
                    <label>Nombre completo:</label>
                    <span class="required-asterisk-cel">*</span>
                  </div>
                  <input
                    type="text"
                    {...registerForm("nombreCompleto", { required: true })}
                  /> <span class="required-asterisk">*</span>
                  {errors.nombreCompleto && (
                    <p className="obligatorio">Este campo es obligatorio.</p>
                  )}
                  
                </div>
                <div className="formulario">
                  <div className="casilla-asterisk-container">
                    <label>Teléfono:</label>
                    <span class="required-asterisk-cel">*</span>
                  </div>
                  <input
                    type="tel"
                    {...registerForm("telefono", { required: true })}
                  /><span class="required-asterisk">*</span>
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
                  <div
                    onClick={() => {
                      document.getElementById("envio-radio1").click();
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="envio-radio1"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="DOMICILIO"
                      {...registerForm("tipo_envio")}
                      defaultChecked
                    />
                    <span>Envío a domicilio</span>
                  </div>
                  <div></div>
                  <div
                    onClick={() => {
                      document.getElementById("envio-radio2").click();
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="envio-radio2"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="SUCURSAL"
                      {...registerForm("tipo_envio")}
                    />
                    <span>Retiro en sucursal del transporte</span>
                  </div>
                  <div></div>
                  <div
                    onClick={() => {
                      document.getElementById("envio-radio3").click();
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="envio-radio3"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="DEPOSITO"
                      {...registerForm("tipo_envio")}
                    />
                    <span>Retiro en depósito del vendedor</span>
                  </div>
                </div>
                <div className="formulario">
                  <label>Transporte:</label>

                  <div
                    onClick={() => {
                      document.getElementById("transporte-radio1").click();
                      setIsOtroSelected(false)
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="transporte-radio1"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="Correo Argentino"
                      {...registerForm("forma_de_envio")}
                      defaultChecked
                    />
                    <span>Correo Argentino</span>
                  </div>
                  <div></div>

                  <div
                    onClick={() => {
                      document.getElementById("transporte-radio2").click();
                      setIsOtroSelected(false)
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="transporte-radio2"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="Vía Cargo"
                      {...registerForm("forma_de_envio")}
                    />
                    <span>Vía Cargo</span>
                  </div>
                  <div></div>

                  <div
                    onClick={() => {
                      document.getElementById("transporte-radio3").click();
                      setIsOtroSelected(true)
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      id="transporte-radio3"
                      style={{ width: "fit-content", cursor: "pointer" }}
                      type="radio"
                      value="OTRO"
                      {...registerForm("forma_de_envio")}
                    />
                    <span>Otro: </span>
                  </div>
                  <div></div>

                  <input
                    type="text"
                    disabled={!isOtroSelected}
                    {...registerForm("otro_transporte")}
                  />
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
