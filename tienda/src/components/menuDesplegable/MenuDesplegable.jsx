import './menuDesplegable.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


const MenuDesplegable = () => {

    const [dropDown, setDropDown] = useState(false);

    const abrirCerrarMenuDesplegable = () => {
        setDropDown(!dropDown);
    }

  return (
    <div >
        <Dropdown isOpen={dropDown} toggle={abrirCerrarMenuDesplegable}>
            <DropdownToggle className='desplegable'>
                Categorias
            </DropdownToggle>

            <DropdownMenu>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/mujer'>Mujer</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/hombres'>Hombres</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/reductores'>Reductores</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/conjuntos'>Conjuntos</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/corpiños'>Corpiños</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/bodys'>Bodys</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/packx3'>Pack x 3</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/tallesEspeciales'>Talles Especiales</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/boxer'>Boxer</Link></DropdownItem>
                <DropdownItem><Link className='desplegable-menu' to='/catalogo/boxerJuvenil'>Boxer Juvenil</Link></DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
  )
}

export default MenuDesplegable