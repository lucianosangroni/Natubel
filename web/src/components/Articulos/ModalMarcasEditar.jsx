import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ModalMarcasEditar({ marca, onClose, onEdit }) {
    const [nuevaMarca, setNuevaMarca] = useState(marca);

    const handleMarcaChange = (e) => {
        const newMarca = { ...nuevaMarca, nombre: e.target.value };
        setNuevaMarca(newMarca);
    };

    const handleEdit = () => {
        if(nuevaMarca.nombre.trim() !== "") {
            onEdit(nuevaMarca)
            onClose()
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Marca</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <td>
                    <Form.Control
                        type="text"
                        placeholder="Marca"
                        value={nuevaMarca.nombre}
                        onChange={(e) => handleMarcaChange(e)}
                    />
                </td>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleEdit}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    </>    
    );
}

export default ModalMarcasEditar;