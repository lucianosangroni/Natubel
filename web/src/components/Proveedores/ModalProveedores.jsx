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
    cuit_cuil: "",
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
        cuit_cuil: "",
      });
      handleClose();
    } else {
      alert("Por favor, complete los campos.");
    }
  };

  return (
    <>
      <Button id="boton-nuevo-proveedor"  onClick={handleShow}>
        Nuevo Proveedor
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
              <Form.Label>Nombre</Form.Label>
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
              <Form.Label>CUIT/CUIL</Form.Label>
              <Form.Control
                type="text"
                value={newProveedor.cuit_cuil}
                onChange={(e) => {
                  setNewProveedor({ ...newProveedor, cuit_cuil: e.target.value });
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
            id="cerrar"          
            onClick={handleClose}
          >
            Cerrar
          </Button>
          <Button id="agregar" onClick={handleSave}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProveedores;
