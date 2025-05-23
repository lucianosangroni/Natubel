import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalObservacionesEditar({ data, onClose, onSave }) {
    const [nuevoTexto, setNuevoTexto] = useState(data)

    const handleSave = () => {
        if (nuevoTexto !== data) {
            onSave(nuevoTexto)
        }
        onClose()
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Observaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={nuevoTexto}
                            onChange={(e) => {
                                setNuevoTexto(e.target.value)
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
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalObservacionesEditar;
