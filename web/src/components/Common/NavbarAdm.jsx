import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
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
    <>
      <Navbar data-bs-theme="light" className="nav">
        <Container className="navBarElementsContainer" style={{ margin: 0 }}>
          <h4 className="navUsername">{localStorage.getItem('username')}</h4>
          <Nav className="navPantallasContainer">
              <Nav.Link className={`botonNav ${selected === 'Cargar Pedido' ? 'selectedNavBar' : ''}`} as={Link} to="/admin/cargar-pedido">
                Cargar Pedido
              </Nav.Link>
              <Nav.Link className={`botonNav ${selected === 'Proveedores' ? 'selectedNavBar' : ''}`} as={Link} to="/admin/proveedores">
                Proveedores
              </Nav.Link>
              <Nav.Link className={`botonNav ${selected === 'Clientes' ? 'selectedNavBar' : ''}`} as={Link} to="/admin/clientes">
                Clientes
              </Nav.Link>
              <Nav.Link className={`botonNav ${selected === 'Articulos' ? 'selectedNavBar' : ''}`} as={Link} to="/admin/articulos">
                Artículos
              </Nav.Link>
              <Nav.Link className={`botonNav ${selected === 'Pedidos' ? 'selectedNavBar' : ''}`} as={Link} to="/admin/pedidos">
                Pedidos
              </Nav.Link>
          </Nav>
          <button className="botonCerrarSesion" onClick={handleLogout}>
            Cerrar Sesion
          </button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarAdm;
