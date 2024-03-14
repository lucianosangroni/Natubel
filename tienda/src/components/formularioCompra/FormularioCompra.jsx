import { useForm } from "react-hook-form";
import "./formularioCompra.css";
import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext.jsx"


const FormularioCompra = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const cartContext = useContext(CartContext);

  const enviar = (data) => {
    setCompraFinalizada(true);

    cartContext.vaciarCarrito();
  };

  return (
    <div className="container">
      {compraFinalizada ? (
        <div className="compraFinalizadaContainer">
          <div className="compraFinalizada">
            <p>
              Compra exitosa! en breve nos comunicaremos para coordinar
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
              {...register("nombreCompleto", {
                required: "Este campo es obligatorio",
              })}
            />
          </div>
          <div className="formulario">
            <label>Telefono:</label>
            <input
              type="tel"
              {...register("telefono", {
                required: "Este campo es obligatorio",
              })}
            />
          </div>
          <div className="formulario">
            <label>Direccion:</label>
            <input type="text" {...register("direccionl")} />
          </div>
          <div className="formulario">
            <label>CP:</label>
            <input type="text" {...register("cp")} />
          </div>
          <div className="formulario">
            <label>DNI:</label>
            <input type="text" {...register("dni")} />
          </div>
          <div className="formulario">
            <label>CUIT / CUIL:</label>
            <input type="text" {...register("cuitCuil")} />
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
    </div>
  );
};

export default FormularioCompra;
