import { useState  } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { apiUrl, bearerToken } from "../../config/config";
import ModalNuevoCupon from "./ModalNuevoCupon";

function ModalCupones({ data, onNuevoCupon, onClose }) {
    const [isNuevoCuponModalOpen, setIsNuevoCuponModalOpen] = useState(false)

    const handleEditarCupon = () => {

    }

    const handleDesactivarCupon = () => {

    }

    const handleEliminarCupon = () => {

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
                                <td>
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
    </>
    );
}

export default ModalCupones;