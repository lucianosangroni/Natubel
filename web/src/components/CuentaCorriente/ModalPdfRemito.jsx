import { useState  } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ModalPdfRemito({ onClose, onSave }) {
    const [tipo, setTipo] = useState("Natubel")

    const handleGenerarPdf = () => {
        onSave(tipo)
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>PDF Remito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Group>
                        <Form.Check
                            inline
                            type="radio"
                            label="Natubel"
                            checked={tipo === "Natubel"}
                            onChange={() => setTipo("Natubel")}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            inline
                            type="radio"
                            label="Lody"
                            checked={tipo === "Lody"}
                            onChange={() => setTipo("Lody")}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            inline
                            type="radio"
                            label="Maxima"
                            checked={tipo === "Maxima"}
                            onChange={() => setTipo("Maxima")}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleGenerarPdf}>
                    Generar PDF
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalPdfRemito;
