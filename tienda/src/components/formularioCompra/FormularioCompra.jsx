import { useForm } from "react-hook-form";
import "./formularioCompra.css";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext.jsx"
import { apiUrl, tokenBearer } from "../../config/config";

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

  const {
    verificarStock,
    tipoPrecios,
    precioTotal,
    vaciarCarrito
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])
  const [ showCompraFinalizada, setShowCompraFinalizada ] = useState(false);
  const [ showIngresarCodigo, setShowIngresarCodigo ] = useState(false);
  const [ codigo, setCodigo ] = useState(null)
  const [ email, setEmail ] = useState(null)
  const [ formulario, setFormulario] = useState(null)

  useEffect(() => {
    const nuevoCarrito = verificarStock()
    setCarrito(nuevoCarrito)
  }, []);

  const reenviarCodigo = () => {
    const newCodigo = Math.floor(Math.random() * 9000) + 1000;

    setCodigo(newCodigo)
    setEmail(email)

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

      alert("Código enviado")
  }

  const onSubmitForm = (formData) => {
    const newCodigo = Math.floor(Math.random() * 9000) + 1000;

    setCodigo(newCodigo)
    setEmail(formData.email)
    setShowIngresarCodigo(true)

    setFormulario(formData)

    const requestData = {
      email: formData.email,
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

  const onSubmitCodigo = (CodigoData) => {
    if(parseInt(CodigoData.codigo) === codigo) {
      enviarPedido()
    } else {
      alert("Codigo incorrecto")
    }
  }

  const enviarPedido = () => {
    fetch(`${apiUrl}/clientes/${formulario.email}`, {
      headers: {
          Authorization: `Bearer ${tokenBearer}`
      }
    })
    .then(response => {
      if (!response.ok) {
          throw new Error(`Error en la solicitud GET para el cliente ${formulario.email}`);
      }
      return response.json();
    })
    .then(result => {
      if(result.message === "Cliente no encontrado") {
        alert("Ya existe una persona con el mismo Email")
      } else if (result.message === "Persona no encontrada") {
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
      } else if (result.message === "Cliente encontrado") {
        const cliente = result.cliente

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
      }
    })
    .catch(error => {
      console.error(`Error en la solicitud GET para el cliente ${formulario.email}:`, error);
    });
  };

  const crearPedido = (persona_id) => {
    const productos = [];

    for(const prod of carrito) {
      const newProd = {
        producto_id: prod.id,
        cantidad: prod.cantidad,
        precio_unitario: tipoPrecios() === "minorista" ? parseFloat(prod.precio_minorista) : (tipoPrecios() === "mayorista" ? parseFloat(prod.precio_mayorista) : parseFloat(prod.precio_distribuidor))
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
    })
    .catch((error) => {
      console.error("Error en la solicitud POST:", error);
    });
  }

  const validateDni = (value) => {
    if (!value) return true;
    return /^[0-9]{8}$/.test(value);
  }

  const validateCuit = (value) => {
    if (!value) return true;
    return /^[0-9]{11}$/.test(value);
  }


  return (
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
          <p>Ingrese el código que se le envío al mail {email}</p>
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
                {errors.email && <p>{errors.email.message}</p>}
              </div>
              <div className="formulario">
                <label>Nombre completo:</label>
                <input
                  type="text"
                  {...registerForm("nombreCompleto", { required: true })}
                />
                {errors.nombreCompleto && <p>Este campo es obligatorio.</p>}
              </div>
              <div className="formulario">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  {...registerForm("telefono", { required: true })}
                />
                {errors.telefono && <p>Este campo es obligatorio.</p>}
              </div>
              <div className="formulario">
                <label>DNI:</label>
                <input
                  type="text"
                  {...registerForm("dni", { validate: validateDni })}
                />
                {errors.dni && <p>Debe tener 8 dígitos.</p>}
              </div>
              <div className="formulario">
                <label>CUIT / CUIL:</label>
                <input
                  type="text"
                  {...registerForm("cuitCuil", { validate: validateCuit })}
                />
                {errors.cuitCuil && <p>Debe tener 11 dígitos.</p>}
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
  );
};

export default FormularioCompra;
