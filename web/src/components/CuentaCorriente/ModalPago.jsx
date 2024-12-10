import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalPago({ onClose, onSave }) {
    const [monto, setMonto] = useState("")
    const [destino, setDestino] = useState("")

    const handleSave = () => {
        const montoValido = parseFloat(monto);

        if (monto && !isNaN(montoValido)) {
            onSave(montoValido, destino)
            onClose()
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="text"
                            value={monto}
                            onChange={(e) => {
                                setMonto(e.target.value)
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Destino</Form.Label>
                        <Form.Control
                            type="text"
                            value={destino}
                            onChange={(e) => {
                                setDestino(e.target.value)
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
                    Agregar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalPago;
