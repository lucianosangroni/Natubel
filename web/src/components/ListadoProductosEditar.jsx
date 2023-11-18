import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ListadoProductosEditar({ product, onClose, onSave }) {
  const [editedProduct, setEditedProduct] = useState({...product});
  const [newTallesList, setNewTallesList] = useState(product.talles);
  const [newColoresList, setNewColoresList] = useState(product.colores);
  const [newTalle, setNewTalle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [addingAnotherTalle, setAddingAnotherTalle] = useState(true);
  const [addingAnotherColor, setAddingAnotherColor] = useState(true);

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  const addTalle = () => {
    if (newTalle.trim() !== "") {
      setNewTallesList([...newTallesList, newTalle]);
      setEditedProduct({
        ...editedProduct,
        talles: [
          ...editedProduct.talles.filter((talle) => talle.trim() !== ""),
          newTalle,
        ],
      });
      setNewTalle("");
      setAddingAnotherTalle(true);
    }
  };

  const removeTalle = (index) => {
    console.log(index)
    console.log(newTallesList)

    //const updatedTalles = [...newTallesList];
//
    //console.log(updatedTalles)
    //updatedTalles.splice(index, 1);
    //setNewTallesList(updatedTalles);
//
    //console.log(newTallesList)

    //setEditedProduct({
    //  ...editedProduct,
    //  talles: updatedTalles.filter((talle) => talle.trim() !== ""),
    //});
//
    //if(editedProduct.talles.length === 0) {
    //  setAddingAnotherTalle(false)
    //}
  };


  const addColor = () => {
    if (newColor.trim() !== "") {
      setNewColoresList([...newColoresList, newColor]);
      setEditedProduct({
        ...editedProduct,
        colores: [
          ...editedProduct.colores.filter((color) => color.trim() !== ""),
          newColor,
        ],
      });
      setNewColor("");
      setAddingAnotherColor(true);
    }
  };

  const removeColor = (index) => {
    const updatedColor = [...newColoresList];
    updatedColor.splice(index, 1);
    setNewColoresList(updatedColor);
  
    setEditedProduct({
      ...editedProduct,
      colores: updatedColor.filter((color) => color.trim() !== ""),
    });

    if(editedProduct.colores.length === 0) {
      setAddingAnotherColor(false)
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
            <div className="input-with-button">
              <Form.Control
                type="text"
                value={newTalle}
                onChange={(e) => {
                  setNewTalle(e.target.value);
                }}
              />
              <Button id="botonNuevoCliente" onClick={addTalle}>
                {addingAnotherTalle ? "Agregar otro" : "Agregar"}
              </Button>
            </div>
            {newTallesList.length > 0 && (
              <div>
                <p>Talles Agregados:</p>
                <ul>
                  {newTallesList.map((talle, index) => (
                    <li key={index} className="talles-agregados">
                      {talle}{" "}
                      <button onClick={() => removeTalle(index)} className="boton-eliminar-agregarProducto">Eliminar</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <div className="input-with-button">
            <Form.Control
            type="text"
            value={newColor}
            onChange={(e) => {
              setNewColor(e.target.value)
            }}            
            />        
            <Button id="botonNuevoCliente" onClick={addColor}>
              {addingAnotherColor ? "Agregar otro" : "Agregar"}
            </Button>
            </div>           
            {newColoresList.length > 0 && (
            <div>
              <p>Colores Agregados:</p>
              <ul>
                {newColoresList.map((color, index) => (
                  <li key={index} className="talles-agregados">
                    {color}{" "}
                    <button onClick={() => removeColor(index)} className="boton-eliminar-agregarProducto">Eliminar</button>
                  </li>
                ))}
              </ul>
            </div>
            )}
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
