import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalProveedores({ onAddProveedor }) {
  const [show, setShow] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    id: "",
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (newProveedor.nombre && newProveedor.telefono) {
      onAddProveedor(newProveedor);
      setNewProveedor({
        id: "",
        nombre: "",
        direccion: "",
        telefono: "",
        email: "",
      });
      handleClose();
    } else {
      console.log("Por favor, complete el nombre y el telefono.");
    }
  };

  return (
    <>
      <Button id="botonNuevoCliente" variant="primary" onClick={handleShow}>
        Nuevo proveedor
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={newProveedor.nombre}
                onChange={(e) => {
                  setNewProveedor({
                    ...newProveedor,
                    nombre: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={newProveedor.direccion}
                onChange={(e) => {
                  setNewProveedor({ ...newProveedor, direccion: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="text"
                value={newProveedor.telefono}
                onChange={(e) => {
                  setNewProveedor({ ...newProveedor, telefono: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newProveedor.email}
                onChange={(e) => {
                  setNewProveedor({ ...newProveedor, email: e.target.value });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="botonNuevoCliente"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
          <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProveedores;
