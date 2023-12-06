import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

function NavbarAdm() {

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
        <Container>
          <Navbar.Brand className="navContainer">Natubel Adm</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link className="botonNav" as={Link} to="/admin/cargar-pedido">
              Cargar Pedido
            </Nav.Link>
            <Nav.Link className="botonNav" as={Link} to="/admin/proveedores">
              Proveedores
            </Nav.Link>
            <Nav.Link className="botonNav" as={Link} to="/admin/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link className="botonNav" as={Link} to="/admin/articulos">
              Artículos
            </Nav.Link>
            <Nav.Link className="botonNav" as={Link} to="/admin/pedidos">
              Pedidos
            </Nav.Link>
            <Nav.Link className="botonNav" onClick={handleLogout}>
              Cerrar Sesion
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarAdm;
