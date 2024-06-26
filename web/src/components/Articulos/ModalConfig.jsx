import { useEffect, useState, useContext  } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiUrl, bearerToken } from "../../config/config";
import { useData } from "../../context/DataContext";

function ModalConfig({ onClose }) {
    const { montoMinimoMayorista, montoMinimoDistribuidor, refreshConfig } = useData();
    const [ data, setData ] = useState({montoMinimoMayorista, montoMinimoDistribuidor})

    const handleSave = () => {
        if(data.montoMinimoMayorista !== "" && data.montoMinimoDistribuidor !== "") {
            const requestData = {
                montoMinimoMayorista: data.montoMinimoMayorista,
                montoMinimoDistribuidor: data.montoMinimoDistribuidor
            }

            fetch(`${apiUrl}/config`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`
                },
                body: JSON.stringify(requestData)
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al editar, intente nuevamente")
                    throw new Error("Error en la solicitud PUT");
                }
                return response.json();
            })
            .then((result) => {
                refreshConfig(data.montoMinimoMayorista, data.montoMinimoDistribuidor)
                onClose()
            })
            .catch((error) => {
                console.error("Error en la solicitud GET:", error)
            });
        } else {
            alert("Los valores son inválidos.")
        }
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Configuración</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Monto de Compra Mínima Mayorista</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.montoMinimoMayorista}
                            onChange={(e) => {
                                if(e.target.value.trim() === "" || !isNaN(e.target.value)){
                                    setData({
                                        ...data,
                                        montoMinimoMayorista: e.target.value.trim() === "" ? "" : parseFloat(e.target.value),
                                    });
                                }
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Monto de Compra Mínima de Distribuidor</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.montoMinimoDistribuidor}
                            onChange={(e) => {
                                if(e.target.value.trim() === "" || !isNaN(e.target.value)){
                                    setData({
                                        ...data,
                                        montoMinimoDistribuidor: e.target.value.trim() === "" ? "" : parseFloat(e.target.value),
                                    });
                                }
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
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalConfig;
