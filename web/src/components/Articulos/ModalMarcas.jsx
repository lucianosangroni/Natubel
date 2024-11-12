import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import ModalMarcasEditar from "./ModalMarcasEditar.jsx";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

function ModalMarcas({ data, onClose, onNuevaMarca, onEditMarca, onEliminarMarca }) {
    const [nuevaMarca, setNuevaMarca] = useState("");
    const [editMarca, setEditMarca] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handleAgregarMarca = () => {
        if (nuevaMarca.trim() !== "") {
            onNuevaMarca(nuevaMarca);
            setNuevaMarca("");
            onClose();
        }
    };

    const handleEditarMarca = (marca) => {
        setEditMarca(marca);
        setIsEditModalOpen(true);
    };

    const handleEditMarca = (nuevaMarca) => {
        onEditMarca(nuevaMarca);
    };

    const handleEliminarMarca = (marca) => {
        const shouldDelete = window.confirm(
            `¿Estas seguro que deseas eliminar la marca ${marca.nombre}?`
        );

        if (shouldDelete) {
            setIsLoading(true)

            fetch(`${apiUrl}/marcas/${marca.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al eliminar marca, intente nuevamente")
                    throw new Error("Error en la solicitud DELETE");
                }
            return response.json();
            })
            .then((result) => {
                if(result.message === "Marca eliminada con éxito") {
                    onEliminarMarca(marca)
                }

                alert(result.message)
                setIsLoading(false)
            })
            .catch(error => {
                console.error("Error en la solicitud DELETE:", error);
            });
        }
    }

    return (
        <>
            {isLoading && <Loading/>}
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Marcas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table 
                        striped
                        bordered
                        hover
                    >
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((marca, index) => (
                                <tr key={index}>
                                    <td>{marca.nombre}</td>
                                    <td>
                                        <Button
                                            style={{
                                                backgroundColor: "#dcd9d9",
                                                color: "black",
                                                borderColor: "black",
                                            }}
                                            size="sm"
                                            onClick={() => handleEditarMarca(marca)}
                                        >
                                        Editar
                                        </Button>
                                        {" "}
                                        <Button
                                            style={{
                                                backgroundColor: "#dcd9d9",
                                                color: "black",
                                                borderColor: "black",
                                            }}
                                            size="sm"
                                            onClick={() => handleEliminarMarca(marca)}
                                        >
                                        Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <Form.Control
                                    type="text"
                                    placeholder="Nueva Marca"
                                    value={nuevaMarca}
                                    onChange={(e) => setNuevaMarca(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        style={{
                                            backgroundColor: "#dcd9d9",
                                            color: "black",
                                            borderColor: "black",
                                        }}
                                        size="sm"
                                        onClick={handleAgregarMarca}
                                    >
                                    Agregar
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            {isEditModalOpen && (
                <ModalMarcasEditar
                    marca={editMarca}
                    onClose={() => setIsEditModalOpen(false)}
                    onEdit={(nuevaMarca) => handleEditMarca(nuevaMarca)}
                />
            )}
        </>
    );
}

export default ModalMarcas;
