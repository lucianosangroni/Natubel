import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalCliente({ onAddClient }) {
  const [show, setShow] = useState(false);
  const [newClient, setNewClient] = useState({
    nombre: "",
    cuitcuil: "",
    direccion: "",
    cp: "",
    telefono: "",
    dni: "",
    ciudad: "",
    provincia: "",
    envio: "",
    email: "",
    tipo: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (newClient.nombreCompleto && newClient.tipo) {
      onAddClient(newClient);
      setNewClient({
        nombreCompleto: "",
        cuitcuil: "",
        direccion: "",
        cp: "",
        telefono: "",
        dni: "",
        ciudad: "",
        provincia: "",
        envio: "",
        email: "",
        tipo: "",
      });
      handleClose();
    } else {
      console.log("Por favor, complete nombre y tipo.");
    }
  };

  return (
    <>
      <Button id="botonNuevoCliente" variant="primary" onClick={handleShow}>
        Nuevo cliente
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Cliente</Modal.Title>
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
              <Form.Label>CUIT CUIL</Form.Label>
              <Form.Control
                type="text"
                value={newClient.cuitcuil}
                onChange={(e) => {
                  setNewClient({ ...newClient, cuitcuil: e.target.value });
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
              <Form.Label>CP</Form.Label>
              <Form.Control
                type="text"
                value={newClient.cp}
                onChange={(e) => {
                  setNewClient({ ...newClient, cp: e.target.value });
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
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={newClient.dni}
                onChange={(e) => {
                  setNewClient({ ...newClient, dni: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                value={newClient.ciudad}
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    ciudad: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Provincia</Form.Label>
              <Form.Control
                type="text"
                value={newClient.provincia}
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    provincia: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Forma de envio</Form.Label>
              <Form.Control
                type="text"
                value={newClient.envio}
                onChange={(e) => {
                  setNewClient({ ...newClient, envio: e.target.value });
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
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={newClient.tipo}
                onChange={(e) => {
                  setNewClient({ ...newClient, tipo: e.target.value });
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

export default ModalCliente;
