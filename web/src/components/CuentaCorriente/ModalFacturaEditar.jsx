import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalFacturaEditar({ data, onClose, onSave }) {
    const [editedData, setEditedData] = useState(data);

    const handleSave = () => {
        const montoValido = parseFloat(editedData.monto);

        if (editedData.monto && !isNaN(montoValido)) {
            onSave({ ...editedData, monto: montoValido });
            onClose();
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Factura</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nuevo Monto</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedData.monto}
                            onChange={(e) =>
                                setEditedData({
                                    ...editedData,
                                    monto: e.target.value,
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

export default ModalFacturaEditar;