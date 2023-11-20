import { useState } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

function ModalProducto({ onAddProducto }) {
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState({
    numero_articulo: "",
    nombre: "",
    descripcion: "",
    precio_unitario: "",
    talles: [""],
    colores: [""],
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    newProduct.talles = newProduct.talles.filter((talle) => talle.trim() !== "");
    newProduct.colores = newProduct.colores.filter((color) => color.trim() !== "");

    if (newProduct.numero_articulo && newProduct.nombre && newProduct.precio_unitario && newProduct.talles.length > 0 && newProduct.colores.length > 0) {
      onAddProducto(newProduct);
      setNewProduct({
        numero_articulo: "",
        nombre: "",
        descripcion: "",
        precio_unitario: "",
        talles: [""],
        colores: [""],
      });
      handleClose();
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  const handleTalleChange = (e, index) => {
    const newTalles = [...newProduct.talles];
    newTalles[index] = e.target.value;
    setNewProduct({
      ...newProduct,
      talles: newTalles,
    });
  };

  const addTalleField = () => {
    const lastTalle = newProduct.talles[newProduct.talles.length - 1].trim();
    if (lastTalle !== "") {
      setNewProduct({
        ...newProduct,
        talles: [...newProduct.talles, ""],
      });
    }
  };

  const removeTalleField = (index) => {
    const newTalles = [...newProduct.talles];
    newTalles.splice(index, 1);
    setNewProduct({
      ...newProduct,
      talles: newTalles,
    });
  };

  const handleColorChange = (e, index) => {
    const newColores = [...newProduct.colores];
    newColores[index] = e.target.value;
    setNewProduct({
      ...newProduct,
      colores: newColores,
    });
  };

  const addColorField = () => {
    const lastColor = newProduct.colores[newProduct.colores.length - 1].trim();
    if (lastColor !== "") {
      setNewProduct({
        ...newProduct,
        colores: [...newProduct.colores, ""],
      });
    }
  };

  const removeColorField = (index) => {
    const newColores = [...newProduct.colores];
    newColores.splice(index, 1);
    setNewProduct({
      ...newProduct,
      colores: newColores,
    });
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
            <Form.Group>
              <Form.Label>Talles</Form.Label>
              {newProduct.talles.map((talle, index) => (
                  <div key={index}>
                  <FormControl
                    placeholder="Talle"
                    value={talle}
                    onChange={(e) => handleTalleChange(e, index)}
                  />
                  {newProduct.talles.length > 1 && (
                    <Button variant="outline-secondary" onClick={() => removeTalleField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button variant="outline-secondary" onClick={addTalleField}>
                 +
               </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label>Colores</Form.Label>
              {newProduct.colores.map((color, index) => (
                  <div key={index}>
                  <FormControl
                    placeholder="Color"
                    value={color}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                  {newProduct.colores.length > 1 && (
                    <Button variant="outline-secondary" onClick={() => removeColorField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button variant="outline-secondary" onClick={addColorField}>
                 +
               </Button>
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
