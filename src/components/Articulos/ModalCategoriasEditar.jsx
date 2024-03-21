import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ModalCategoriasEditar({ categoria, onClose, onEdit }) {
    const [nuevaCategoria, setNuevaCategoria] = useState(categoria);

    const handleCategoriaChange = (e) => {
        const newCategoria = { ...nuevaCategoria, nombre: e.target.value };
        setNuevaCategoria(newCategoria);
    };

    const handleEdit = () => {
        if(nuevaCategoria.nombre.trim() !== "") {
            onEdit(nuevaCategoria)
            onClose()
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <td>
                    <Form.Control
                        type="text"
                        placeholder="Categoria"
                        value={nuevaCategoria.nombre}
                        onChange={(e) => handleCategoriaChange(e)}
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

export default ModalCategoriasEditar;