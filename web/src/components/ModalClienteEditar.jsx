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
            <Form.Label>CP</Form.Label>
            <Form.Control
              type="text"
              value={editedData.cp}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  cp: e.target.value,
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
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              value={editedData.dni}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  dni: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={editedData.ciudad}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  ciudad: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              type="text"
              value={editedData.provincia}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  provincia: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Formas de envio</Form.Label>
            <Form.Control
              type="text"
              value={editedData.envio}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  envio: e.target.value,
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
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              value={editedData.tipo}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  tipo: e.target.value,
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

export default ModalClienteEditar;
