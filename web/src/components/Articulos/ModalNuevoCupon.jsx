import { useEffect, useState, useContext  } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiUrl, bearerToken } from "../../config/config";
import Loading from "../Common/Loading";

function ModalNuevoCupon({ onClose, onSave }) {
    const [isLoading, setIsLoading] = useState(false)
    const [nuevoCupon, setNuevoCupon] = useState({
        clave: "",
        descuento: 0,
        dias_validez: 0,
    });

    const handleSave = () => {
        const descuentoValido = parseFloat(nuevoCupon.descuento);
        const dias_validezValido = parseInt(nuevoCupon.dias_validez);

        if(!isNaN(descuentoValido) && descuentoValido > 0 && descuentoValido <= 100 && !isNaN(dias_validezValido) && nuevoCupon.clave.trim() !== "") {
            setIsLoading(true)
            
            const requestData = {
                clave: nuevoCupon.clave,
                descuento: descuentoValido,
                dias_validez: dias_validezValido
            }

            fetch(`${apiUrl}/cupones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(requestData),
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al agregar cupon, verifique los datos ingresados");
                    throw new Error("Error en la solicitud POST");
                }
                return response.json();
            })
            .then((result) => {
                const hoy = new Date();
                let fecha_fin = null;
                if (dias_validezValido !== 0) {
                    const fin = new Date();
                    fin.setDate(fin.getDate() + parseInt(dias_validezValido));
                    fecha_fin = fin.toISOString().split('T')[0];
                }

                const newCuponRefresh = {
                    id: result.id,
                    clave: nuevoCupon.clave,
                    descuento: descuentoValido,
                    fecha_fin,
                    flag_activo: true,
                    createdAt: hoy.toISOString().split('T')[0],
                }

                onSave(newCuponRefresh)

                alert("Cupon creado con éxito")

                setNuevoCupon({
                    clave: "",
                    descuento: 0,
                    dias_validez: 0,
                });
                setIsLoading(false)
                onClose()
            })
            .catch((error) => {
                setIsLoading(false)
                console.error("Error en la solicitud POST:", error);
            });
        } else {
            alert("Por favor, ingrese datos válidos.");
        }
    }

    return (
    <>
        {isLoading && <Loading/>}
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Cupon de Descuento</Modal.Title>
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
                        <Form.Label>Días de Validez (0 = plazo indeterminado)</Form.Label>
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
                    Agregar Cupon
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalNuevoCupon;