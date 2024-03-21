import './menuDesplegable.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const MenuDesplegable = () => {
    const { categoriasData } = useData();
    const [ dropDown, setDropDown ] = useState(false);

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
                    {categoriasData.map(categoria => {
                        return (
                            <DropdownItem key={categoria.id} className='fondoItem' >
                                <Link className='desplegable-menu' to={`/catalogo/${categoria.id}`}>{categoria.nombre}</Link>
                            </DropdownItem>
                        );
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default MenuDesplegable