import { useState, useEffect } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

function ModalProductoEditar({ onEditProducto, articulo }) {
  const [show, setShow] = useState(false);
  const [editProduct, setEditProduct] = useState(
    {
    numero_articulo: articulo.numero_articulo,
    nombre: articulo.nombre,
    descripcion: articulo.descripcion,
    precio_unitario: articulo.precio_unitario,
    talles: [],
    colores: []
    }
  );

  const talles = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
  const colores = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

  useEffect(() => {
    setEditProduct(
      {
        id: articulo.id,
        numero_articulo: articulo.numero_articulo,
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        precio_unitario: articulo.precio_unitario,
        productos: articulo.productos,
        talles,
        colores
      }
    );
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

  const handleTalleChange = (e, index) => {
    const newTalles = [...editProduct.talles];
    newTalles[index] = e.target.value;
    setEditProduct({
      ...editProduct,
      talles: newTalles,
    });
  };

  const addTalleField = () => {
    const lastTalle = editProduct.talles[editProduct.talles.length - 1].trim();
    if (lastTalle !== "") {
      setEditProduct({
        ...editProduct,
        talles: [...editProduct.talles, ""],
      });
    }
  };

  const removeTalleField = (index) => {
    const newTalles = [...editProduct.talles];
    newTalles.splice(index, 1);
    setEditProduct({
      ...editProduct,
      talles: newTalles,
    });
  };

  const handleColorChange = (e, index) => {
    const newColores = [...editProduct.colores];
    newColores[index] = e.target.value;
    setEditProduct({
      ...editProduct,
      colores: newColores,
    });
  };

  const addColorField = () => {
    const lastColor = editProduct.colores[editProduct.colores.length - 1].trim();
    if (lastColor !== "") {
      setEditProduct({
        ...editProduct,
        colores: [...editProduct.colores, ""],
      });
    }
  };

  const removeColorField = (index) => {
    const newColores = [...editProduct.colores];
    newColores.splice(index, 1);
    setEditProduct({
      ...editProduct,
      colores: newColores,
    });
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
         <div className="contenedor-botones">
            <Form.Group>         
              <Form.Label className="boton-talle">Talles</Form.Label>
              {editProduct.talles.map((talle, index) => (
                  <div key={index}>
                  <FormControl
                    placeholder="Talle"
                    value={talle}
                    onChange={(e) => handleTalleChange(e, index)}
                  />
                  {editProduct.talles.length > 1 && (
                    <Button id="boton-menos" onClick={() => removeTalleField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button id="boton-mas" onClick={addTalleField}>
                 +
               </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label className="boton-talle">Colores</Form.Label>
              {editProduct.colores.map((color, index) => (
                  <div key={index}>
                  <FormControl
                    placeholder="Color"
                    value={color}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                  {editProduct.colores.length > 1 && (
                    <Button id="boton-menos" onClick={() => removeColorField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button id="boton-mas" onClick={addColorField}>
                 +
               </Button>
               
            </Form.Group>
         </div>
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
