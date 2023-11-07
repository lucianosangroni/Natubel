import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalProveedores({ onAddClient }) {
  const [show, setShow] = useState(false);
  const [newClient, setNewClient] = useState({
    id: "",
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (newClient.nombreCompleto && newClient.telefono) {
      onAddClient(newClient);
      setNewClient({
        id: "",
        nombreCompleto: "",
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
                value={newClient.nombreCompleto}
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    nombreCompleto: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={newClient.direccion}
                onChange={(e) => {
                  setNewClient({ ...newClient, direccion: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="text"
                value={newClient.telefono}
                onChange={(e) => {
                  setNewClient({ ...newClient, telefono: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newClient.email}
                onChange={(e) => {
                  setNewClient({ ...newClient, email: e.target.value });
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
