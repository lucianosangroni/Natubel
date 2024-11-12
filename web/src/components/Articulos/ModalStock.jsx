import { useState  } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ModalStock({ onClose, tipo, onGenerarPdf, marcas }) {
    const [marcaElegida, setMarcaElegida] = useState("todas");
    const [flagSinStock, setFlagSinStock] = useState(false);

    const handleGenerarPdf = () => {
        onGenerarPdf(marcaElegida, flagSinStock)
    }

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Stock {tipo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Incluir articulos sin stock</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                type="radio"
                                label="Sí"
                                name="stockOption"
                                checked={flagSinStock === true}
                                onChange={() => setFlagSinStock(true)}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="No"
                                name="stockOption"
                                checked={flagSinStock === false}
                                onChange={() => setFlagSinStock(false)}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            as="select"
                            value={marcaElegida}
                            onChange={(e) => {
                                setMarcaElegida(e.target.value);
                            }}>
                            <option value={"todas"}>Todas las marcas</option>
                            {marcas.map((mar, marIndex) => {
                                return (
                                    <option key={marIndex} value={mar.id}>
                                        {mar.nombre}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleGenerarPdf}>
                    Generar PDF
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalStock;
