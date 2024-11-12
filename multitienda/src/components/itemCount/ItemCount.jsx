import './itemCount.css';

const ItemCount = ( {cantidad, handleRestar, handleSumar, handleAgregar} ) => {

  return (
    <div>
        <div className='item-count'>
            <button onClick={handleRestar}>-</button>
            <p className='numeroCantidad'>{cantidad}</p>
            <button onClick={handleSumar}>+</button>
        </div>
        <button className='agregar-al-carrito' onClick={handleAgregar}>Agregar al carrito</button>
    </div>
  )
}

export default ItemCount