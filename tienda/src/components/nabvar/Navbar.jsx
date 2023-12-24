import React from 'react'
import './navbar.css';
import { Link } from 'react-router-dom';
import CartWidget from '../cartWidget/CartWidget';

const Navbar = () => {

  return (
    <div>
      <p className='encabezado'>MINIMO DE COMPRAS MAYORISTAS $25.000 || PARA COMPRAS MAYORES A $200.000.- ESCRIBINOS A NUESTRO WHATSAPP</p>
    <nav className='navbar'>
        <Link to="/" className='logo'><h1>Natubel</h1></Link>
        <ul className='menu'>
            <li><Link className='menu-link' to='/'>| Inicio |</Link></li>
            <li><Link className='menu-link' to='/catalogo'>Catalogo</Link></li>
            <li><Link className='menu-link' to='/catalogo'>Categorias</Link></li>
            <li><Link className='menu-link' to='/catalogo/mujer'>Mujer</Link></li>
            <li><Link className='menu-link' to='/catalogo/reductores'>Reductores</Link></li>
            <li><Link className='menu-link' to='/catalogo/corpiños'>Corpiños</Link></li>
            <li><Link className='menu-link' to='/catalogo/bodys'>Bodys</Link></li>
            <li><Link className='menu-link' to='/catalogo/conjuntos'>Conjuntos</Link></li>
            <li><Link className='menu-link' to='/formulario'>Formulario</Link></li>          
            <li><Link className='menu-link' to='/mayorista'>Mayorista</Link></li>
        </ul>
        <div><CartWidget /></div>
    </nav>
    </div>
  )
}

export default Navbar