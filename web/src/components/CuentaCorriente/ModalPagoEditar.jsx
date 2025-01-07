import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalPagoEditar({ data, onClose, onSave }) {
    const [editedData, setEditedData] = useState(data);

    const handleSave = () => {
        const montoValido = parseFloat(editedData.monto);

        if (editedData.monto && !isNaN(montoValido)) {
            onSave({ ...editedData, monto: montoValido })
            onClose()
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedData.monto}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    monto: e.target.value,
                                })
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Destino</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedData.destino}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    destino: e.target.value,
                                })
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
                    Editar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalPagoEditar;
