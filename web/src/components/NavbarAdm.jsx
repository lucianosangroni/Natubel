import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavbarAdm() {
  return (
    <>
      <Navbar data-bs-theme="light" className="nav">
        <Container>
          <Navbar.Brand className="navContainer">Natubel Adm</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link className="botonNav" as={Link} to="/admin/cargarPedido">
              Pedido clientes
            </Nav.Link>
            <Nav.Link
              className="botonNav"
              as={Link}
              to="/admin/listadoproveedores"
            >
              Proveedores
            </Nav.Link>
            <Nav.Link className="botonNav" as={Link} to="/admin/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link
              className="botonNav"
              as={Link}
              to="/admin/listadodeproductos"
            >
              Listado de productos
            </Nav.Link>
            <Nav.Link
              className="botonNav"
              as={Link}
              to="/admin/historialdepedidos"
            >
              Historial de pedidos
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarAdm;
