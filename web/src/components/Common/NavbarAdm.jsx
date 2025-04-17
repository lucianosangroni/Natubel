import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

function NavbarAdm({ selected }) {

  const { logout } = useAuth()

  const handleLogout = () => {
    const shouldLogout = window.confirm(
      "¿Estas seguro que quieres cerrar sesion?"
    );
    if (shouldLogout) {
      logout()
    }
  }

  return (
    <nav className="navbar-adm">
      <div className="navbar-container">
        <h4 className="navbar-username">{localStorage.getItem('username')}</h4>

        <div className="navbar-links">
          <Link
            className={`navbar-link ${selected === 'Cargar Pedido' ? 'active' : ''}`}
            to="/admin/cargar-pedido"
          >
            Cargar Pedido
          </Link>
          <Link
            className={`navbar-link ${selected === 'Proveedores' ? 'active' : ''}`}
            to="/admin/proveedores"
          >
            Proveedores
          </Link>
          <Link
            className={`navbar-link ${selected === 'Clientes' ? 'active' : ''}`}
            to="/admin/clientes"
          >
            Clientes
          </Link>
          <Link
            className={`navbar-link ${selected === 'Articulos' ? 'active' : ''}`}
            to="/admin/articulos"
          >
            Artículos
          </Link>
          <Link
            className={`navbar-link ${selected === 'Pedidos' ? 'active' : ''}`}
            to="/admin/pedidos"
          >
            Pedidos
          </Link>
        </div>

        <button className="navbar-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default NavbarAdm;
