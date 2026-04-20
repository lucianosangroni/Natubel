import { useState } from "react";
import { Modal, Button, Form, Table, FormGroup } from "react-bootstrap";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { useEffect } from "react";

function ModalMlAtributos({ categoria, onClose, onPublicarArticuloMl }) {
    const [isLoading, setIsLoading] = useState(false)
    const [atributos, setAtributos] = useState([])

    useEffect(() => {
        setIsLoading(true)

        fetch(`https://api.mercadolibre.com/categories/${categoria}/attributes`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al buscar atributos, verifique los datos ingresados");
                throw new Error("Error en la solicitud GET");
            }
            return response.json();
        })
        .then((result) => {
            const atributosRequired = result.filter(a => a.tags?.required);

            const atributosSinTalleNiColor = atributosRequired.filter(a => a.name !== "Color" && a.name !== "Talle")

            const atributosFinal = atributosSinTalleNiColor.map(a => ({
                ...a,
                respuestaNatubel: ""
            }));

            setAtributos(atributosFinal)

            setIsLoading(false)
        })
        .catch((error) => {
            setIsLoading(false)
            console.error("Error en la solicitud GET:", error);
        });
    }, [categoria]);

    const handleConfirmar = () => {
        const todosCompletos = atributos.every(a => a.respuestaNatubel && a.respuestaNatubel.trim() !== "");

        if (!todosCompletos) {
            alert("Completa todos los atributos");
            return;
        }

        onPublicarArticuloMl(atributos)
        onClose()
    }

    const handleClose = () => {
        setAtributos([])
        onClose()
    }

    return (
        <>
            {isLoading && <Loading/>}
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Publicar artículo en MercadoLibre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {atributos.map((a) =>
                        <FormGroup key={a.id}>
                            <Form.Label>{a.name}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={a.hint || a.values?.map(v => v.name).join(", ")}
                                value={a.respuestaNatubel}
                                onChange={(e) => {
                                    const newValue = e.target.value;

                                    setAtributos(prev =>
                                        prev.map(attr =>
                                            attr.id === a.id
                                                ? { ...attr, respuestaNatubel: newValue }
                                                : attr
                                        )
                                    );
                                }}
                            />
                        </FormGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        id="botonNuevoCliente"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cerrar
                    </Button>
                    <Button id="botonNuevoCliente" variant="primary" onClick={handleConfirmar}>
                        Publicar Artículo
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalMlAtributos;