import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalPagoEditar({ data, onClose, onSave }) {
    const [editedData, setEditedData] = useState(data);
    const [fechaMaxima, setFechaMaxima] = useState(null)
    const [fechaDelPago, setFechaDelPago] = useState(null)

    useEffect(() => {
            const fechaHoy = new Date().toISOString().split("T")[0];
            setFechaMaxima(fechaHoy);

            setFechaDelPago(convertirFechaParaInput(data.fecha))
        }, []);
    
    const convertirFechaParaInput = (fecha) => {
        const [dia, mes, anio] = fecha.split('/');
    
        return `${anio}-${mes}-${dia}`;
    };

    const handleSave = () => {
        const montoValido = parseFloat(editedData.monto);

        if (editedData.monto && !isNaN(montoValido)) {
            onSave({ ...editedData, monto: montoValido, fecha: fechaDelPago })
            onClose()
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    }

    const handleFechaBlur = () => {
        if (fechaDelPago && fechaDelPago > fechaMaxima) {
            alert("La fecha no puede ser futura.");
            setFechaDelPago(convertirFechaParaInput(data.fecha));
        }
    };

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cobranza A/C</Modal.Title>
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
                    {!editedData.flagSobrante && (
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
                    )}
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaDelPago}
                            onChange={(e) => {
                                setFechaDelPago(e.target.value)
                            }}
                            max={fechaMaxima}
                            onBlur={handleFechaBlur}
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
