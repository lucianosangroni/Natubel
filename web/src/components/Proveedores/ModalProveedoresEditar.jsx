import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalProveedoresEditar({ data, onClose, onSave }) {
  const [editedData, setEditedData] = useState(data);

  const handleSave = () => {
    // Realiza alguna validación si es necesario antes de guardar los cambios
    if (editedData.nombre && editedData.telefono) {
      onSave(editedData); // Llama a la función onSave pasando los datos editados
      onClose(); // Cierra el modal de edición
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              value={editedData.nombre}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  nombre: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              type="text"
              value={editedData.direccion}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  direccion: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              value={editedData.telefono}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  telefono: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={editedData.email}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  email: e.target.value,
                })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button id="botonNuevoCliente" variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalProveedoresEditar;
