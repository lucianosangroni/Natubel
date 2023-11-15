import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ListadoProductosEditar({ product, onClose, onSave }) {
  const [editedproduct, setEditedproduct] = useState({...product});
  const [newTallesList, setNewTallesList] = useState(product.talles);
  const [newColoresList, setNewColoresList] = useState(product.colores);
  const [newTalle, setNewTalle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [addingAnotherTalle, setAddingAnotherTalle] = useState(false);

  const handleSave = () => {
    // Realiza alguna validación si es necesario antes de guardar los cambios
    console.log(editedproduct)
    //if (editedproduct.datosPorTalleYColor) {
    //  onSave({
    //    ...product,
    //    datosPorTalleYColor: editedproduct.datosPorTalleYColor,
    //  }); // Llama a la función onSave pasando los datos editados
    //  onClose(); // Cierra el modal de edición
    //} else {
    //  console.log("Por favor, complete todos los campos.");
    //}
  };

  const handleNewTalleChange = (event) => {
    const { value } = event.target;

    setNewTalle(value);
  };

  const addTalle = () => {
    if (newTalle.trim() !== "") {
      setNewTallesList([...newTallesList, newTalle]);
      setEditedproduct({
        ...editedproduct,
        talles: [
          ...editedproduct.talles.filter((talle) => talle.trim() !== ""),
          newTalle,
        ],
      });
      setNewTalle("");
      setAddingAnotherTalle(true);
    }
  };

  const removeTalle = (index) => {
    const updatedTalles = [...newTallesList];
    updatedTalles.splice(index, 1);
    setNewTallesList(updatedTalles);
  
    setEditedproduct({
      ...editedproduct,
      talles: updatedTalles.filter((talle) => talle.trim() !== ""),
    });
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
                onChange={handleNewTalleChange}
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
            <Form.Label>color</Form.Label>
            <Form.Control
              type="text"
              value={"a"/*editedproduct.datosPorTalleYColor[0].color || ""*/}
              onChange={(e) =>
                console.log(e)
                /*setEditedproduct({
                  ...editedproduct,
                  datosPorTalleYColor: {
                    ...editedproduct.datosPorTalleYColor,
                    color: e.target.value,
                  },
                })*/
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
