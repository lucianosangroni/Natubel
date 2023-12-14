import React from 'react'
import './navbar.css';
import cartIcon from '../../img/carrito.png';



const Navbar = () => {
  return (
    <div>
      <p className='encabezado'>MINIMO DE COMPRAS MAYORISTAS $25.000 || PARA COMPRAS MAYORES A $200.000.- ESCRIBINOS A NUESTRO WHATSAPP</p>
    <nav className='navbar'>
        <h1 className='logo'>Natubel</h1>
        <ul className='menu'>
            <li><a className='menu-link' href='#'>| Inicio |</a></li>
            <li><a className='menu-link' href='#'>Catalogo</a></li>
            <li><a className='menu-link' href='#'>Categorias</a></li>
            <li><a className='menu-link' href='#'>Mayorista</a></li>
        </ul>
        <div className='carrito-container'>
        <a href="#tu-enlace">
          <img src={cartIcon} alt="Carrito" className='carrito' />       
        </a>
        <p className='contador-carrito'>0</p>
        </div>
        
    </nav>
    </div>
  )
}

export default Navbar