import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

const Imputacion = () => {
    const { numeroImputacion } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { clientesData, proveedoresData, facturasData, remitosData, pagosData, imputacionesData } = useData()
    const [imputacion, setImputacion] = useState({
        facturas_pagos: []
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
            let numero_remito = "-";
            let total = "$" + formatearNumero(factura.monto);
            let descuento = "0%";

            if (cliente) {
                const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);

                if (remitoCorrespondiente) {
                    numero_remito = remitoCorrespondiente.numero_remito;
                    total = "$" + formatearNumero(factura.monto / (1 - remitoCorrespondiente.descuento / 100));
                    descuento = remitoCorrespondiente.descuento + "%";
                }
            }

            const newFactura = {
                tipo: "FAC",
                numero: cliente ? (<span
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => handleVerPedido(factura.pedido_id)}
                        >
                            {factura.pedido_id}
                        </span>) : factura.numero_factura,
                numero_remito,
                fecha: formatearFechaPago(factura.fecha),
                total,
                descuento,
                a_pagar: formatearNumero(factura.monto)
            }

            facturasParsed.push(newFactura)
        }

        facturasParsed.sort((a, b) => a.numero - b.numero)

        for(const pago of pagos) {
            const newPago = {
                tipo: "COB A/C",
                numero: pago.id,
                numero_remito: "-",
                fecha: formatearFechaPago(pago.fecha),
                total: "-",
                descuento: "-",
                a_pagar: formatearNumero(pago.monto)
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
            facturas_pagos: [...facturasParsed, ...pagosParsed],
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
            const [entero, decimal] = numero.toFixed(2).toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    const generarPdfImputacion = () => {

        setIsLoading(true);
        
        const ventana = window.open(
            `${apiUrl}/pdf/imputacion/${numeroImputacion}`,
            '_blank'
        );
        
        if (!ventana) {
            alert('Habilite las ventanas emergentes para ver o descargar el PDF');
        }
        
        setIsLoading(false);
    }

    const handleHistorial = () => {
        navigate(`/admin/cuenta-corriente/${imputacion.personaEmail}/historial`);
    }

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${imputacion.personaEmail}`);
    }

    const handleVerPedido = (pedidoId) => {
        navigate(`/admin/pedidos?selected=${pedidoId}`);
    }

    return (
        <>
            {isLoading && <Loading/>}
            <NavbarAdm/>
            {imputacion.facturas_pagos.length > 0 && (
                <>
                    <h1 style={{marginTop: "5rem", marginBottom: "0", textAlign: "center", fontSize: "50px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>
                        Cobranza N°{numeroImputacion}
                    </h1>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>

                    <div style={{display: "flex", alignItems: "center", marginTop: "0", marginBottom: "0"}}>
                        <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content", justifyContent: "center"}}>
                                <span style={{ fontWeight: "bold" }}>CLIENTE: <span style={{fontWeight: "normal"}}>{imputacion.personaNombre}</span></span>
                                <span style={{ fontWeight: "bold" }}>FECHA: <span style={{fontWeight: "normal"}}>{imputacion.fecha}</span></span>
                                <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoImputacion)}</span></span>
                                <span style={{ fontWeight: "bold" }}>TOTAL COBRANZAS A/C: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoImputacion + imputacion.montoSobrante)}</span></span>
                                <span style={{ fontWeight: "bold" }}>MONTO SOBRANTE: <span style={{fontWeight: "normal"}}>${formatearNumero(imputacion.montoSobrante)}</span></span>
                            </div>
                        </div>
                        <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Button onClick={handleHistorial} className="btnRemito">Historial</Button>
                            <Button onClick={handleCuentaCorriente} className="btnRemito">Cuenta Corriente</Button>
                            <Button onClick={generarPdfImputacion} className="btnRemito">PDF Cobranza</Button>
                        </div>
                    </div>

                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>

                    <div className="tableDivContainer">
                        <table className="tableContainerSinPaginacion">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Número</th>
                                    <th>Remito</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Descuento</th>
                                    <th>A Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imputacion.facturas_pagos.map((factura_pago, index) => (
                                    <tr key={index} style={{ color: factura_pago.tipo === "COB A/C" ? "red" : "black" }}>
                                        <td>{factura_pago.tipo}</td>
                                        <td>{factura_pago.numero}</td>
                                        <td>{factura_pago.numero_remito}</td>
                                        <td>{factura_pago.fecha}</td>
                                        <td>{factura_pago.total}</td>
                                        <td>{factura_pago.descuento}</td>
                                        <td>${factura_pago.a_pagar}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
}

export default Imputacion;