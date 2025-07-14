import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalClienteEditar({ data, onClose, onSave }) {
  const [editedData, setEditedData] = useState(data);

  const handleSave = () => {
    // Realiza alguna validación si es necesario antes de guardar los cambios
    if (editedData.nombre && editedData.tipo_cliente) {
      onSave(editedData); // Llama a la función onSave pasando los datos editados
      onClose(); // Cierra el modal de edición
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
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
            <Form.Label>Nombre *</Form.Label>
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
            <Form.Label>Email *</Form.Label>
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
            <Form.Label>Telefono *</Form.Label>
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
            <Form.Label>CUIT/CUIL (11 digitos)</Form.Label>
            <Form.Control
              type="text"
              value={editedData.cuit_cuil}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  cuit_cuil: e.target.value,
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
              value={editedData.codigo_postal}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  codigo_postal: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>DNI (8 digitos)</Form.Label>
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
            <Form.Label>Descuento Predeterminado</Form.Label>
            <Form.Control
              type="text"
              value={editedData.descuento}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  descuento: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
              <Form.Label>Envio</Form.Label>
              <Form.Control
                as="select"
                value={editedData.tipo_envio}
                onChange={(e) => {
                  setEditedData({ ...editedData, tipo_envio: e.target.value });
                }}>
                <option value="DOMICILIO">ENVIO A DOMICILIO</option>
                <option value="SUCURSAL">RETIRA EN SUCURSAL</option>
                <option value="DEPOSITO">RETIRA EN DEPOSITO</option>
              </Form.Control>
            </Form.Group>
          <Form.Group>
            <Form.Label>Transporte</Form.Label>
            <Form.Control
              type="text"
              value={editedData.forma_de_envio}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  forma_de_envio: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={editedData.tipo_cliente}
              onChange={(e) => {
                setEditedData({ ...editedData, tipo_cliente: e.target.value });
              }}>
              <option value="MINORISTA">MINORISTA</option>
              <option value="MAYORISTA">MAYORISTA</option>
              <option value="DISTRIBUIDOR">DISTRIBUIDOR</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>PDF Remito Predeterminado</Form.Label>
            <Form.Control
              as="select"
              value={editedData.tipo_pdf_remito}
              onChange={(e) => {
                setEditedData({ ...editedData, tipo_pdf_remito: e.target.value });
              }}>
              <option value="Natubel">Natubel</option>
              <option value="Lody">Lody</option>
              <option value="Maxima">Maxima</option>
            </Form.Control>
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
