import { useState  } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { apiUrl, bearerToken } from "../../config/config";
import ModalNuevoCupon from "./ModalNuevoCupon";
import Loading from "../Common/Loading";
import ModalCuponEdit from "./ModalCuponEdit";

function ModalCupones({ data, onClose, onNuevoCupon, onCambiarActivacion, onDeleteCupon, onEditCupon }) {
    const [isNuevoCuponModalOpen, setIsNuevoCuponModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditCuponModalOpen, setIsEditCuponModalOpen] = useState(false)
    const [editCupon, setEditCupon] = useState(null)

    const handleEditarCupon = (cupon) => {
        setEditCupon(cupon)
        setIsEditCuponModalOpen(true)
    }

    const handleDesactivarCupon = (cupon) => {
        setIsLoading(true)

        fetch(`${apiUrl}/cupones/activacion/${cupon.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al editar cupon, verifique los datos ingresados");
                    throw new Error("Error en la solicitud PUT");
                }
                return response.json();
            })
            .then(() => {
                onCambiarActivacion(cupon)
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                console.error("Error en la solicitud PUT:", error);
            });
    }

    const handleEliminarCupon = (cupon) => {
        const shouldDelete = window.confirm(
            `¿Estas seguro que deseas eliminar el cupon ${cupon.clave}?`
        );

        if (shouldDelete) {
            setIsLoading(true)

            fetch(`${apiUrl}/cupones/${cupon.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                })
                .then((response) => {
                    if (!response.ok) {
                        alert("Error al eliminar cupon, intente nuevamente");
                        throw new Error("Error en la solicitud DELETE");
                    }
                    return response.json();
                })
                .then(() => {
                    onDeleteCupon(cupon)
                    setIsLoading(false)
                })
                .catch((error) => {
                    setIsLoading(false)
                    console.error("Error en la solicitud DELETE:", error);
                });
        }
    }

    const formatearCreatedAt = (fecha) => {
        return new Date(fecha)
            .toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
    }

    const formatearFechaFinCupon = (fecha) => {
        if (fecha === null) {
            return "INDETERMINADO"
        } else {
            const [anio, mes, dia] = fecha.split('-');
            return `${dia}/${mes}/${anio}`;
        };
    }

    const estadoCupon = (cupon) => {
        if(cupon.flag_activo === false) {
            return "DESACTIVADO"
        } else if (cupon.fecha_fin !== null && estaVencido(cupon.fecha_fin)) {
            return "VENCIDO"
        } else return "ACTIVO"
    }

    const estaVencido = (fecha_fin) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ignoramos la hora

        const fechaFin = new Date(fecha_fin);
        return fechaFin < hoy;
    };

    return (
    <>
        {isLoading && <Loading/>}
        <Modal show={true} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Cupones de Descuento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table 
                    striped
                    bordered
                    hover
                >
                    <thead>
                        <tr>
                            <th>Clave</th>
                            <th>Descuento</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((cupon, index) => (
                            <tr key={index}>
                                <td>{cupon.clave}</td>
                                <td>{cupon.descuento}%</td>
                                <td>{formatearCreatedAt(cupon.createdAt)}</td>
                                <td>{formatearFechaFinCupon(cupon.fecha_fin)}</td>
                                <td>{estadoCupon(cupon)}</td>
                                <td style={{display: "flex", gap: "10px"}}>
                                    <Button
                                        style={{
                                            backgroundColor: "#dcd9d9",
                                            color: "black",
                                            borderColor: "black",
                                        }}
                                        size="sm"
                                        onClick={() => handleEditarCupon(cupon)}
                                    >
                                    Editar
                                    </Button>
                                    {" "}
                                    <Button
                                        style={{
                                            backgroundColor: "#dcd9d9",
                                            color: "black",
                                            borderColor: "black",
                                            minWidth: "85px",
                                        }}
                                        size="sm"
                                        onClick={() => handleDesactivarCupon(cupon)}
                                    >
                                    {cupon.flag_activo === true? "Desactivar" : "Activar"}
                                    </Button>
                                    {" "}
                                    <Button
                                        style={{
                                            backgroundColor: "#dcd9d9",
                                            color: "black",
                                            borderColor: "black",
                                        }}
                                        size="sm"
                                        onClick={() => handleEliminarCupon(cupon)}
                                    >
                                    Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={() => setIsNuevoCuponModalOpen(true)}>
                    Nuevo Cupon
                </Button>
            </Modal.Footer>
        </Modal>
        {isNuevoCuponModalOpen && (
            <ModalNuevoCupon
                onClose={() => setIsNuevoCuponModalOpen(false)}
                onSave={(nuevoCupon) => onNuevoCupon(nuevoCupon)}
            />
        )}
        {isEditCuponModalOpen && (
            <ModalCuponEdit
                data={editCupon}
                onClose={() => setIsEditCuponModalOpen(false)}
                onSave={(cuponEditado) => onEditCupon(cuponEditado)}
            />
        )}
    </>
    );
}

export default ModalCupones;