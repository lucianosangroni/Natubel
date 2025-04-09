import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

const Imputacion = () => {
    const { numeroImputacion } = useParams();
    const navigate = useNavigate();
    const { clientesData, proveedoresData, facturasData, remitosData, pagosData, imputacionesData } = useData()
    const [imputacion, setImputacion] = useState({
        facturas: [],
        pagos: []
    })

    useEffect(() => {
        const filasImputacionCorrespondientes = imputacionesData.filter(imp => imp.numero_imputacion === parseInt(numeroImputacion))

        const facturasUnicasID = Array.from(new Set(filasImputacionCorrespondientes.map(filaImputacion => filaImputacion.factura_id)));
        const pagosUnicosID = Array.from(new Set(filasImputacionCorrespondientes.map(filaImputacion => filaImputacion.pago_id)));
        
        const facturas = facturasData.filter(fac => {
            return facturasUnicasID.some(facId => fac.id === facId);
        })
        const pagos = pagosData.filter(pag => {
            return pagosUnicosID.some(pagoId => pag.id === pagoId)
        })

        const montoImputacion = facturas.reduce((total, factura) => {
            return total + (factura ? factura.monto : 0);
        }, 0);

        const montoSobrante = pagos.reduce((total, pago) => {
            return total + (pago ? pago.monto : 0)
        }, 0) - montoImputacion

        const cliente = clientesData.find(cli => cli.persona_id === facturas[0]?.persona_id)
        const proveedor = proveedoresData.find(pro => pro.id === facturas[0]?.persona_id)

        let emailPersona = ""
        if(cliente) emailPersona = cliente.email
        else if(proveedor) emailPersona = proveedor.email

        const facturasParsed = []
        const pagosParsed = []

        for(const factura of facturas) {
            const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);

            const newFactura = {
                numero_pedido: factura.pedido_id,
                numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                fecha: formatearFecha(factura.createdAt),
                total: remitoCorrespondiente? formatearNumero(factura.monto / (1 - remitoCorrespondiente.descuento / 100)) : formatearNumero(factura.monto),
                descuento: remitoCorrespondiente? remitoCorrespondiente.descuento: "0",
                a_pagar: formatearNumero(factura.monto)
            }

            facturasParsed.push(newFactura)
        }

        facturasParsed.sort((a, b) => a.numero_pedido - b.numero_pedido)

        for(const pago of pagos) {
            const newPago = {
                id: pago.id,
                fecha: formatearFechaPago(pago.fecha),
                monto: pago.monto
            }

            pagosParsed.push(newPago)
        }

        pagosParsed.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            
            return fechaA - fechaB;
        })

        const imputacionCorrespondiente = {
            personaEmail: emailPersona,
            personaNombre: facturas[0]?.persona_nombre,
            fecha: formatearFecha(filasImputacionCorrespondientes[0]?.createdAt),
            facturas: facturasParsed,
            pagos: pagosParsed,
            montoImputacion,
            montoSobrante
        }

        setImputacion(imputacionCorrespondiente)
    }, [imputacionesData, numeroImputacion, clientesData, proveedoresData, facturasData, pagosData, remitosData]);

    const formatearFecha = (fechaDateTime) => {
        const fecha = new Date(fechaDateTime);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    };

    const formatearFechaPago = (fechaDateOnly) => {
        const [anio, mes, dia] = fechaDateOnly.split('-');
        
        return `${dia}/${mes}/${anio}`;
    };

    const formatearNumero = (numero) => {
        if (typeof numero === 'number') {
            const [entero, decimal] = numero.toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    const handleHistorial = () => {
        navigate(`/admin/cuenta-corriente/${imputacion.personaEmail}/historial`);
    }

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${imputacion.personaEmail}`);
    }

    return (
        <>
            <NavbarAdm/>
            {imputacion.facturas.length > 0 && (
                <>
                    <h1 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "50px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>
                        Imputación N°{numeroImputacion}
                    </h1>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Detalles</h2>

                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: ".6rem"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                            <span style={{ fontWeight: "bold" }}>CLIENTE: <span style={{fontWeight: "normal"}}>{imputacion.personaNombre}</span></span>
                            <span style={{ fontWeight: "bold" }}>FECHA: <span style={{fontWeight: "normal"}}>{imputacion.fecha}</span></span>
                            <span style={{ fontWeight: "bold" }}>MONTO: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoImputacion)}</span></span>
                            <span style={{ fontWeight: "bold" }}>PAGADO: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoImputacion + imputacion.montoSobrante)}</span></span>
                            <span style={{ fontWeight: "bold" }}>SOBRANTE: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoSobrante)}</span></span>
                        </div>
                    </div>

                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>
                    
                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Facturas</h2>

                    <div className="tableDivContainer">
                        <table className="tableContainerSinPaginacion">
                            <thead>
                                <tr>
                                    <th>N° Pedido</th>
                                    <th>N° Remito</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Descuento</th>
                                    <th>A Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imputacion.facturas.map((factura, index) => (
                                    <tr key={index}>
                                        <td>{factura.numero_pedido}</td>
                                        <td>{factura.numero_remito}</td>
                                        <td>{factura.fecha}</td>
                                        <td>${formatearNumero(factura.total)}</td>
                                        <td>{factura.descuento}%</td>
                                        <td>${formatearNumero(factura.a_pagar)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td style={{fontWeight: "bold", padding: "5px 8px"}}>TOTAL</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td style={{fontWeight: "bold"}}>${formatearNumero(imputacion.montoImputacion)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>
                    
                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Cobranzas A/C</h2>

                    <div className="tableDivContainer" style={{marginBottom: "100px"}}>
                        <table className="tableContainerSinPaginacion">
                            <thead>
                                <tr>
                                    <th>N° Pago</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>

                                </tr>
                            </thead>
                            <tbody>
                                {imputacion.pagos.map((pago, index) => (
                                    <tr key={index}>
                                        <td>{pago.id}</td>
                                        <td>{pago.fecha}</td>
                                        <td>${formatearNumero(pago.monto)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td style={{fontWeight: "bold", padding: "5px 8px"}}>TOTAL</td>
                                    <td></td>
                                    <td style={{fontWeight: "bold"}}>${formatearNumero(imputacion.montoImputacion + imputacion.montoSobrante)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            

            <Button onClick={handleHistorial}  className="abajoDerecha" id="btnDescargarStock" style={{width: "145px"}}>Historial</Button>
            <Button onClick={handleCuentaCorriente}  className="abajoDerecha" id="btnDescargarStock" style={{width: "200px", right: "180px"}}>Cuenta Corriente</Button>
        </>
    );
}

export default Imputacion;