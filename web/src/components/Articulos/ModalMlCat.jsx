import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

function ModalMlCat({ articulo, onClose, onConfirmarMlCat }) {
    const [isLoading, setIsLoading] = useState(false)
    const [catInput, setCatInput] = useState("");
    const [mlCatOptions, setMlCatOptions] = useState([])
    const [mlCatSelected, setMlCatSelected] = useState(null)

    const handleBuscarCategoria = () => {
        setIsLoading(true)

        fetch(`${apiUrl}/ml/categoria?filtro=${encodeURIComponent(catInput)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al buscar categoría, verifique los datos ingresados");
                throw new Error("Error en la solicitud GET");
            }
            return response.json();
        })
        .then((result) => {
            setMlCatOptions(result.catOptions)

            setIsLoading(false)
        })
        .catch((error) => {
            setIsLoading(false)
            console.error("Error en la solicitud GET:", error);
        });
    };

    const handleConfirmar = () => {
        onConfirmarMlCat(mlCatSelected)
        onClose()
    }

    const handleClose = () => {
        setCatInput("")
        setMlCatOptions([])
        setMlCatSelected(null)
        onClose()
    }

    return (
        <>
            {isLoading && <Loading/>}
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Categoría de MercadoLibre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Articulo {articulo.numero_articulo}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Descripción para la categoría"
                            value={catInput}
                            onChange={(e) => {
                                setCatInput(e.target.value);
                            }}
                        />
                        <Button
                            style={{
                                marginTop: "5px",
                                backgroundColor: "#dcd9d9",
                                color: "black",
                                borderColor: "black",
                            }}
                            size="sm"
                            onClick={handleBuscarCategoria}
                        >
                            Buscar
                        </Button>
                    </Form.Group>
                    {mlCatOptions.length >= 1 && (
                        <Form.Group style={{marginTop: ".7rem"}}>
                            <select onChange={(e) => setMlCatSelected(e.target.value)}>
                                <option value="">Seleccionar categoría</option>
                                {mlCatOptions.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.domain_name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
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
                    <Button id="botonNuevoCliente" variant="primary" onClick={handleConfirmar} disabled={!mlCatSelected?.trim()}>
                        Confirmar Categoría
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalMlCat;
