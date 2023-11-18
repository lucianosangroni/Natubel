import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalProductoEditar({ onEditProducto, articulo }) {
  const [show, setShow] = useState(false);
  const [editProduct, setEditProduct] = useState(articulo);

  useEffect(() => {
    setEditProduct(articulo);
  }, [articulo]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (editProduct.numero_articulo && editProduct.nombre && editProduct.precio_unitario && editProduct.talles.length > 0 && editProduct.colores.length > 0) {
      onEditProducto(editProduct);
      handleClose();
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <>
      <button onClick={handleShow} className="agregar-producto-grilla">
        Editar Producto
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Articulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Número de Artículo</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.numero_articulo}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    numero_articulo: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.nombre}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    nombre: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.descripcion}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    descripcion: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_unitario}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProductoEditar;
