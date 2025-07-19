import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalFacturaEditar({ data, onClose, onSave }) {
    const [editedData, setEditedData] = useState(data);
    const [fechaInicial, setFechaInicial] = useState(null)
    const [fechaMaxima, setFechaMaxima] = useState(null)

    useEffect(() => {
        const fechaHoy = new Date().toISOString().split("T")[0];
        setFechaMaxima(fechaHoy);

        const fechaFormateada = convertDateToInputFormat(editedData.fecha);
        setEditedData((prevData) => ({
            ...prevData,
            fecha: fechaFormateada,
        }));
        setFechaInicial(fechaFormateada);
    }, []);

    const convertDateToInputFormat = (date) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleSave = () => {
        const montoValido = parseFloat(editedData.total);
        const numeroFacturaValido = parseInt(editedData.numero_pedido);

        if (editedData.total && !isNaN(montoValido) && montoValido > 0) {
            if(editedData.numero_pedido && !isNaN(numeroFacturaValido) && numeroFacturaValido > 0) {
                onSave({ ...editedData, monto: montoValido, numero_factura: numeroFacturaValido });
                onClose();
            } else {
                alert("Por favor, ingrese un número de pedido válido.");
            }
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    };

    const handleFechaBlur = () => {
        if (editedData.fecha && editedData.fecha > fechaMaxima) {
            alert("La fecha no puede ser futura.");
            setEditedData({
                ...editedData,
                fecha: fechaInicial,
            })
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
                        <Form.Label>Número de Factura</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedData.numero_pedido}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    numero_pedido: e.target.value,
                                })
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedData.total}
                            onChange={(e) =>
                                setEditedData({
                                    ...editedData,
                                    total: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            value={editedData.fecha}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    fecha: e.target.value,
                                })
                            }}
                            max={fechaMaxima}
                            onBlur={handleFechaBlur}
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