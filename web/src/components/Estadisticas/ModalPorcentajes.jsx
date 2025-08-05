import { Modal, Button, Table, Form } from "react-bootstrap";
import { useData } from "../../context/DataContext";
import { useState, useEffect } from "react";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

function ModalPorcentajes({ onClose }) {
    const { marcasData, porcentajesData, refreshPorcentajes } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [porcentajes, setPorcentajes] = useState({});

    useEffect(() => {
        if (marcasData.length > 0) {
            const initial = {};
            marcasData.forEach(marca => {
                initial[marca.id] = {
                    minorista: porcentajesData?.[marca.id]?.minorista ?? "",
                    mayorista: porcentajesData?.[marca.id]?.mayorista ?? "",
                    distribuidor: porcentajesData?.[marca.id]?.distribuidor ?? "",
                    deMarca: porcentajesData?.[marca.id]?.deMarca ?? "",
                    cinco: porcentajesData?.[marca.id]?.cinco ?? "",
                    diez: porcentajesData?.[marca.id]?.diez ?? ""
                };
            });
            setPorcentajes(initial);
        }
    }, [marcasData]);

    const handleChange = (marcaId, tipo, value) => {
        setPorcentajes(prev => ({
            ...prev,
            [marcaId]: {
                ...prev[marcaId],
                [tipo]: value
            }
        }));
    };

    const handleSave = () => {
        setIsLoading(true)

        const porcentajesParsed = {};
        for (const marcaId in porcentajes) {
            porcentajesParsed[marcaId] = {};
            for (const tipo in porcentajes[marcaId]) {
                const val = porcentajes[marcaId][tipo];
                porcentajesParsed[marcaId][tipo] = val !== "" ? parseFloat(val) : null;
            }
        }

        const requestData = { porcentajes: porcentajesParsed }
        
        fetch(`${apiUrl}/porcentajes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al actualizar los porcentajes, verifique los datos ingresados")
                throw new Error("Error en la solicitud POST");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Porcentajes actualizados con éxito") {
                refreshPorcentajes(porcentajesParsed)
            }
    
            alert(result.message)
            setIsLoading(false)
            onClose()
        })
        .catch(error => {
            setIsLoading(false)
            onClose()
            console.error("Error en la solicitud POST:", error);
        });
    }

    return (
    <>
        {(isLoading) && <Loading/>}
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Porcentajes de Ganancia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Minorista</th>
                            <th>Mayorista</th>
                            <th>Distribuidor</th>
                            <th>De Marca</th>
                            <th>5%</th>
                            <th>10%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcasData.map(marca => (
                            <tr key={marca.id}>
                                <td>{marca.nombre}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.minorista}
                                        onChange={e =>
                                            handleChange(marca.id, "minorista", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.mayorista}
                                        onChange={e =>
                                            handleChange(marca.id, "mayorista", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.distribuidor}
                                        onChange={e =>
                                            handleChange(marca.id, "distribuidor", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.deMarca}
                                        onChange={e =>
                                            handleChange(marca.id, "deMarca", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.cinco}
                                        onChange={e =>
                                            handleChange(marca.id, "cinco", e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="no-spinner"
                                        style={{width: "65px"}}
                                        value={porcentajes[marca.id]?.diez}
                                        onChange={e =>
                                            handleChange(marca.id, "diez", e.target.value)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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

export default ModalPorcentajes;
