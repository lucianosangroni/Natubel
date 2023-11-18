import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalProducto({ onAddProducto }) {
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState({
    numero_articulo: "",
    nombre: "",
    descripcion: "",
    precio_unitario: "",
    talles: ["s"],
    colores: ["blanco"],
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (newProduct.numero_articulo && newProduct.nombre && newProduct.precio_unitario && newProduct.talles.length > 0 && newProduct.colores.length > 0) {
      onAddProducto(newProduct);
      setNewProduct({
        numero_articulo: "",
        nombre: "",
        descripcion: "",
        precio_unitario: "",
        talles: [],
        colores: [],
      });
      handleClose();
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <>
      <button onClick={handleShow} className="agregar-producto-grilla">
        Agregar Producto
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Articulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Número de Artículo</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.numero_articulo}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    numero_articulo: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.nombre}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    nombre: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.descripcion}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    descripcion: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.precio_unitario}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    precio_unitario: e.target.value,
                  });
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
            Agregar Articulo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProducto;
