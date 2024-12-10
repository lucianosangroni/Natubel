import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function ModalRemitoEditar({ onClose, onSave, remitoEdit }) {
    const [remito, setRemito] = useState(remitoEdit);

    const handleSave = () => {
        const descuentoValido = parseFloat(remito.descuento);
        const dias_vencimientoValido = parseInt(remito.dias_vencimiento);
        const cantidad_cajasValido = parseInt(remito.cantidad_cajas);

        if (remito.descuento && !isNaN(descuentoValido) && descuentoValido >= 0 && descuentoValido <= 100 &&
            remito.dias_vencimiento && !isNaN(dias_vencimientoValido) && dias_vencimientoValido >= 0 &&
            remito.cantidad_cajas && !isNaN(cantidad_cajasValido) && cantidad_cajasValido >= 0
        ) {
            onSave(remito)
            onClose();
        } else {
            alert("Por favor, complete todos los campos con datos válidos.");
        }
    };

    return (
        <>
            <Modal
                show={true}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group> 
                            <Form.Label>Descuento %</Form.Label>
                            <Form.Control
                                type="text"
                                value={remito.descuento}
                                onChange={(e) => {
                                    setRemito({
                                        ...remito,
                                        descuento: e.target.value,
                                    });
                                }}
                            />
                        </Form.Group>
                        <Form.Group> 
                            <Form.Label>Dias de Vencimiento</Form.Label>
                            <Form.Control
                                type="text"
                                value={remito.dias_vencimiento}
                                onChange={(e) => {
                                    setRemito({
                                        ...remito,
                                        dias_vencimiento: e.target.value,
                                    });
                                }}
                            />
                        </Form.Group>
                        <Form.Group> 
                            <Form.Label>Cantidad de Cajas</Form.Label>
                            <Form.Control
                                type="text"
                                value={remito.cantidad_cajas}
                                onChange={(e) => {
                                    setRemito({
                                        ...remito,
                                        cantidad_cajas: e.target.value,
                                    });
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        id="cerrar"          
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                    <Button id="agregar" onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalRemitoEditar;