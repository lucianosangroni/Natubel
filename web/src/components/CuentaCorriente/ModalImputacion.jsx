import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ModalImputacion({ facturas, pagos, onClose, onSave }) {
    const [imputacion, setImputacion] = useState({
        facturas: [""],
        pagos: [""]
    })
    const [totalFacturas, setTotalFacturas] = useState(0)
    const [totalPagos, setTotalPagos] = useState(0)

    const handleSave = () => {
        imputacion.facturas = imputacion.facturas.filter((fac) => fac.trim() !== "")
        imputacion.pagos = imputacion.pagos.filter((pag) => pag.trim() !== "")

        if(imputacion.facturas.length > 0 && totalFacturas <= totalPagos) {
            onSave(imputacion, totalPagos - totalFacturas)
            onClose()
        } else {
            alert("El monto de los pagos debe superar al de las facturas")
        }
    }

    const handleFacturasChange = (e, index) => {
        const newFacturas = [...imputacion.facturas]
        newFacturas[index] = e.target.value

        const nuevoTotalFacturas = newFacturas.reduce((total, facturaId) => {
            const factura = facturas.find(f => f.id === Number(facturaId));
            return factura ? total + factura.monto : total;
        }, 0);

        setImputacion({
            ...imputacion,
            facturas: newFacturas
        })
        setTotalFacturas(nuevoTotalFacturas)
    }

    const addFacturaField = () => {
        const lastFactura = imputacion.facturas[imputacion.facturas.length - 1].trim()
        if(lastFactura !== "") {
            setImputacion({
                ...imputacion,
                facturas: [...imputacion.facturas, ""]
            })
        }
    }

    const removeFacturaField = (index) => {
        const newFacturas = [...imputacion.facturas]
        newFacturas.splice(index, 1)

        const nuevoTotalFacturas = newFacturas.reduce((total, facturaId) => {
            const factura = facturas.find(f => f.id === Number(facturaId));
            return factura ? total + factura.monto : total;
        }, 0);

        setImputacion({
            ...imputacion,
            facturas: newFacturas
        })
        setTotalFacturas(nuevoTotalFacturas)
    }

    const handlePagosChange = (e, index) => {
        const newPagos = [...imputacion.pagos]
        newPagos[index] = e.target.value

        const nuevoTotalPagos = newPagos.reduce((total, pagoId) => {
            const pago = pagos.find(p => p.id === Number(pagoId));
            return pago ? total + pago.monto : total;
        }, 0);
        
        setImputacion({
            ...imputacion,
            pagos: newPagos
        })
        setTotalPagos(nuevoTotalPagos)
    }

    const addPagoField = () => {
        const lastPago = imputacion.pagos[imputacion.pagos.length - 1].trim()
        if(lastPago !== "") {
            setImputacion({
                ...imputacion,
                pagos: [...imputacion.pagos, ""]
            })
        }
    }

    const removePagoField = (index) => {
        const newPagos = [...imputacion.pagos]
        newPagos.splice(index, 1)

        const nuevoTotalPagos = newPagos.reduce((total, pagoId) => {
            const pago = pagos.find(p => p.id === Number(pagoId));
            return pago ? total + pago.monto : total;
        }, 0);

        setImputacion({
            ...imputacion,
            pagos: newPagos
        })
        setTotalPagos(nuevoTotalPagos)
    }

    const formatearNumero = (numero) => {
        if (typeof numero === 'number') {
            const [entero, decimal] = numero.toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    return (
    <>
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Imputar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label className="boton-categoria">Resumen</Form.Label>
                        <div style={{display: "flex", flexDirection: "column", marginLeft: "20px", gap: "5px"}}>
                            <p style={{margin: "0"}}>Total Facturas: ${formatearNumero(totalFacturas)}</p>
                            <p >Total Pagos: ${formatearNumero(totalPagos)}</p>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="boton-categoria">Facturas</Form.Label>
                        {imputacion.facturas.map((factura, index) => (
                            <div key={index} className="input-tallecolor-container">
                                <Form.Select
                                    value={factura}
                                    onChange={(e) => handleFacturasChange(e, index)}
                                >
                                    <option value="">Selecciona una factura</option>
                                        {facturas.map((fac, facIndex) => {
                                            const esVisible = !imputacion.facturas.includes(fac.id.toString());
                                            return (
                                                <option key={facIndex} value={fac.id} hidden={!esVisible}>
                                                    pedido {fac.numero_pedido} . remito {fac.numero_remito} . fecha {fac.fecha} . monto {fac.monto}
                                                </option>
                                            );
                                        })}
                                </Form.Select>
                                {imputacion.facturas.length > 1 && (
                                    <Button id="boton-menos" onClick={() => removeFacturaField(index)}>
                                        -
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button id="boton-mas-cat" onClick={addFacturaField}>
                            +
                        </Button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="boton-categoria">Pagos</Form.Label>
                        {imputacion.pagos.map((pago, index) => (
                            <div key={index} className="input-tallecolor-container">
                                <Form.Select
                                    value={pago}
                                    onChange={(e) => handlePagosChange(e, index)}
                                >
                                    <option value="">Selecciona un pago</option>
                                        {pagos.map((pag, pagIndex) => {
                                            const esVisible = !imputacion.pagos.includes(pag.id.toString());
                                            return (
                                                <option key={pagIndex} value={pag.id} hidden={!esVisible}>
                                                    pago {pag.numero_pago} . fecha {pag.fecha} . monto {pag.monto}
                                                </option>
                                            );
                                        })}
                                </Form.Select>
                                {imputacion.pagos.length > 1 && (
                                    <Button id="boton-menos" onClick={() => removePagoField(index)}>
                                        -
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button id="boton-mas-cat" onClick={addPagoField}>
                            +
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
                    Agregar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default ModalImputacion;
