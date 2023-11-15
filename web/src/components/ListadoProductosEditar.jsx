import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ListadoProductosEditar({ product, onClose, onSave }) {
  useEffect(() => {
    // Verificamos que el producto tenga la propiedad datosPorTalleYColor
    if (product && product.datosPorTalleYColor) {
      setEditedproduct({
        datosPorTalleYColor: { ...product.datosPorTalleYColor },
      });
    }
  }, [product]);

  const [editedproduct, setEditedproduct] = useState({
    datosPorTalleYColor: {},
  });

  const handleSave = () => {
    // Realiza alguna validación si es necesario antes de guardar los cambios
    if (editedproduct.datosPorTalleYColor) {
      onSave({
        ...product,
        datosPorTalleYColor: editedproduct.datosPorTalleYColor,
      }); // Llama a la función onSave pasando los datos editados
      onClose(); // Cierra el modal de edición
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Articulo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Talle</Form.Label>
            <Form.Control
              type="text"
              value={editedproduct.datosPorTalleYColor.talle || ""}
              onChange={(e) =>
                setEditedproduct({
                  ...editedproduct,
                  datosPorTalleYColor: {
                    ...editedproduct.datosPorTalleYColor,
                    talle: e.target.value,
                  },
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>color</Form.Label>
            <Form.Control
              type="text"
              value={editedproduct.datosPorTalleYColor.color || ""}
              onChange={(e) =>
                setEditedproduct({
                  ...editedproduct,
                  datosPorTalleYColor: {
                    ...editedproduct.datosPorTalleYColor,
                    color: e.target.value,
                  },
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

export default ListadoProductosEditar;
