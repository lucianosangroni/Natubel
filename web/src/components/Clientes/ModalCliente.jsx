import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalCliente({ onAddClient, refreshCliente, onClienteRefresheado }) {
  const [show, setShow] = useState(false);
  const [newClient, setNewClient] = useState({
      nombre: "",
      cuit_cuil: "",
      direccion: "",
      codigo_postal: "",
      telefono: "",
      dni: "",
      ciudad: "",
      provincia: "",
      forma_de_envio: "",
      tipo_envio: "DOMICILIO",
      email: "",
      tipo_cliente: "MINORISTA",
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const clienteVacio = {
      nombre: "",
      cuit_cuil: "",
      direccion: "",
      codigo_postal: "",
      telefono: "",
      dni: "",
      ciudad: "",
      provincia: "",
      forma_de_envio: "",
      tipo_envio: "DOMICILIO",
      email: "",
      tipo_cliente: "MINORISTA",
    }

    setNewClient(clienteVacio)
    onClienteRefresheado()
  }, [refreshCliente]);

  const handleSave = () => {
    if (newClient.nombre && newClient.email && newClient.telefono) {
      onAddClient(newClient);
      handleClose();
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    }
  };

  return (
    <>
      <Button id="botonNuevoCliente" variant="primary" onClick={handleShow}>
        Nuevo Cliente
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
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={newClient.nombre}
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    nombre: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={newClient.email}
                onChange={(e) => {
                  setNewClient({ ...newClient, email: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefono *</Form.Label>
              <Form.Control
                type="text"
                value={newClient.telefono}
                onChange={(e) => {
                  setNewClient({ ...newClient, telefono: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>CUIT/CUIL (11 digitos)</Form.Label>
              <Form.Control
                type="text"
                value={newClient.cuit_cuil}
                onChange={(e) => {
                  setNewClient({ ...newClient, cuit_cuil: e.target.value });
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
                value={newClient.codigo_postal}
                onChange={(e) => {
                  setNewClient({ ...newClient, codigo_postal: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>DNI (8 digitos)</Form.Label>
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
              <Form.Label>Envio</Form.Label>
              <Form.Control
                as="select"
                value={newClient.tipo_envio}
                onChange={(e) => {
                  setNewClient({ ...newClient, tipo_envio: e.target.value });
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
                value={newClient.forma_de_envio}
                onChange={(e) => {
                  setNewClient({ ...newClient, forma_de_envio: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                value={newClient.tipo_cliente}
                onChange={(e) => {
                  setNewClient({ ...newClient, tipo_cliente: e.target.value });
                }}>
                <option value="MINORISTA">MINORISTA</option>
                <option value="MAYORISTA">MAYORISTA</option>
                <option value="DISTRIBUIDOR">DISTRIBUIDOR</option>
              </Form.Control>
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
