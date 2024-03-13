import { useForm } from "react-hook-form";
import "./formularioCompra.css";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext.jsx"


const FormularioCompra = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    verificarStock
  } = useContext(CartContext);

  const [ carrito, setCarrito ] = useState([])
  const [ compraFinalizada, setCompraFinalizada ] = useState(false);

  useEffect(() => {
    const nuevoCarrito = verificarStock()
    setCarrito(nuevoCarrito)
  }, []);

  const enviar = (data) => {
    setCompraFinalizada(true);

    console.log(data)
  };

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
      {carrito.length > 0 ? (
        <>
          {compraFinalizada ? (
            <div className="compraFinalizadaContainer">
              <div className="compraFinalizada">
                <p>
                  Pedido exitoso! En breve nos comunicaremos para coordinar
                  el pago y el envio. Muchas gracias!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(enviar)}>
              <div className="formulario">
                <label>Email:</label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Este campo es obligatorio.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo electrónico inválido'
                    } 
                  })}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
              <div className="formulario">
                <label>Nombre completo:</label>
                <input
                  type="text"
                  {...register("nombreCompleto", { required: true })}
                />
                {errors.nombreCompleto && <p>Este campo es obligatorio.</p>}
              </div>
              <div className="formulario">
                <label>Telefono:</label>
                <input
                  type="tel"
                  {...register("telefono", { required: true })}
                />
                {errors.telefono && <p>Este campo es obligatorio.</p>}
              </div>
              <div className="formulario">
                <label>Direccion:</label>
                <input type="text" {...register("direccion")} />
              </div>
              <div className="formulario">
                <label>Codigo Postal:</label>
                <input type="text" {...register("cp")} />
              </div>
              <div className="formulario">
                <label>DNI:</label>
                <input type="text" {...register("dni", { validate: validateDni } )} />
                {errors.dni && <p>Debe tener 8 dígitos.</p>}
              </div>
              <div className="formulario">
                <label>CUIT / CUIL:</label>
                <input type="text" {...register("cuitCuil", { validate: validateCuit })} />
                {errors.cuitCuil && <p>Debe tener 11 dígitos.</p>}
              </div>
              <div className="formulario">
                <label>Ciudad:</label>
                <input type="text" {...register("ciudad")} />
              </div>
              <div className="formulario">
                <label>Provincia:</label>
                <input type="text" {...register("provincia")} />
              </div>
              <div className="container-enviar">
                <button className="enviar" type="submit">
                  Finalizar compra
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="carritoVacioContainer">
          <h2 className="carritoVacio">El carrito esta vacio...</h2>
        </div>
      )}
    </div>
  );
};

export default FormularioCompra;
