import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalClienteEditar({ data, onClose, onSave }) {
  const [editedData, setEditedData] = useState(data);

  const handleSave = () => {
    // Realiza alguna validación si es necesario antes de guardar los cambios
    if (editedData.nombreCompleto && editedData.tipo) {
      onSave(editedData); // Llama a la función onSave pasando los datos editados
      onClose(); // Cierra el modal de edición
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              value={editedData.nombreCompleto}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  nombreCompleto: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>CUIT CUIL</Form.Label>
            <Form.Control
              type="text"
              value={editedData.cuitcuil}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  cuitcuil: e.target.value,
                })
              }
            />
          </Form.Group>
          {/* Agrega aquí los campos restantes de acuerdo a tus necesidades */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalClienteEditar;
