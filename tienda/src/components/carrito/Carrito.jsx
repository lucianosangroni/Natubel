import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'


const Carrito = () => {

    const { carrito, precioTotal, vaciarCarrito } = useContext(CartContext);

    const handleVaciar = () => {
        vaciarCarrito();
    }

  return (
    <div className='container'>
        <h1 className='main-title'>Carrito</h1>
        {
            carrito.map((prod) => (
                <div key={prod.id}>
                    <h3>{prod.art}</h3>
                    <p>Precio unitario: ${prod.price}</p>
                    <p>Precio total: ${prod.price * prod.cantidad}</p>
                    <p>Cantidad: {prod.cantidad}</p>
                </div>
            ))
        }
        {
            carrito.length > 0 ? 
            <div>
                <h2>Precio total: ${precioTotal()}</h2>
                <button onClick={handleVaciar}>Vaciar carrito</button>
            </div> :
            <h2>El carrito esta vacio</h2>

        }

    </div>
  )
}

export default Carrito