import { useState, useEffect } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

function ModalProductoEditar({ onEditProducto, articulo }) {
  const [show, setShow] = useState(false);
  const [editProduct, setEditProduct] = useState(
    {
    numero_articulo: articulo.numero_articulo,
    descripcion: articulo.descripcion,
    precio_minorista: articulo.precio_minorista,
    precio_mayorista: articulo.precio_mayorista,
    precio_distribuidor: articulo.precio_distribuidor,
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
        descripcion: articulo.descripcion,
        precio_minorista: articulo.precio_minorista,
        precio_mayorista: articulo.precio_mayorista,
        precio_distribuidor: articulo.precio_distribuidor,
        productos: articulo.productos,
        talles,
        colores
      }
    );
  }, [articulo]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    if (editProduct.numero_articulo && editProduct.precio_minorista && editProduct.precio_mayorista && editProduct.precio_distribuidor && editProduct.talles.length > 0 && editProduct.colores.length > 0) {
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
      <button onClick={handleShow} className="agregar-producto-grilla" style={{ marginTop: '2rem' }}>
        Editar Articulo
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
            {/*<Form.Group>
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
            </Form.Group>*/}
            <Form.Group>
              <Form.Label>Precio Minorista</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_minorista}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_minorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Mayorista</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_mayorista}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_mayorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Distribuidor</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_distribuidor}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_distribuidor: e.target.value,
                  });
                }}
              />
            </Form.Group>
         <div className="contenedor-botones">
            <Form.Group>         
              <Form.Label className="boton-talle">Talles</Form.Label>
              {editProduct.talles.map((talle, index) => (
                  <div key={index} className="input-tallecolor-container">
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
                  <div key={index} className="input-tallecolor-container">
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
