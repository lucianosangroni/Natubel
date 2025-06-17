import { useEffect, useState  } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ModalCuponEdit({ onClose, onSave, data }) {
    const [nuevoCupon, setNuevoCupon] = useState(data)

    useEffect(() => {
        let dias_validez = 0

        if(data.fecha_fin) {
            const hoy = new Date(); // Asegurate de que esto esté definido antes
            const fechaFin = new Date(data.fecha_fin);
            
            // Calcular la diferencia en milisegundos
            const diferenciaMs = fechaFin - hoy;
            
            // Convertir milisegundos a días (1 día = 86400000 ms)
            dias_validez = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
        }

        setNuevoCupon({
            id: data.id,
            clave: data.clave,
            descuento: data.descuento,
            dias_validez
        });
    }, [data]);

    const handleSave = () => {
        const descuentoValido = parseFloat(nuevoCupon.descuento);
        const dias_validezValido = parseInt(nuevoCupon.dias_validez);

        if(!isNaN(descuentoValido) && descuentoValido > 0 && descuentoValido <= 100 && !isNaN(dias_validezValido) && nuevoCupon.clave.trim() !== "") {       
            let fecha_fin = null;
            if (dias_validezValido !== 0) {
                const hoy = new Date();
                hoy.setDate(hoy.getDate() + parseInt(dias_validezValido));
                fecha_fin = hoy.toISOString().split('T')[0];
            }

            const cuponEditado = {
                id: nuevoCupon.id,
                clave: nuevoCupon.clave,
                descuento: descuentoValido,
                fecha_fin
            }

            onSave(cuponEditado)
            onClose()
        } else {
            alert("Por favor, ingrese datos válidos.");
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cupon de Descuento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Clave</Form.Label>
                        <Form.Control
                            type="text"
                            value={nuevoCupon.clave}
                            onChange={(e) => {
                                setNuevoCupon({
                                    ...nuevoCupon,
                                    clave: e.target.value,
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descuento %</Form.Label>
                        <Form.Control
                            type="text"
                            value={nuevoCupon.descuento}
                            onChange={(e) => {
                                setNuevoCupon({
                                    ...nuevoCupon,
                                    descuento: e.target.value,
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Días de Validez (a partir de hoy)</Form.Label>
                        <Form.Control
                            type="text"
                            value={nuevoCupon.dias_validez}
                            onChange={(e) => {
                                setNuevoCupon({
                                    ...nuevoCupon,
                                    dias_validez: e.target.value,
                                });
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
                    Editar Cupon
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalCuponEdit;