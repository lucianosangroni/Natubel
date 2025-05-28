import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const HistorialCuentaCorriente = () => {
    const { email } = useParams();
    const { clientesData, proveedoresData, facturasData, remitosData, pagosData, imputacionesData } = useData()
    const [ persona, setPersona ] = useState(null);
    const [ facturasPorMes, setFacturasPorMes ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagos, setPagos] = useState([])
    const [totalPagadoFactura, setTotalPagadoFactura] = useState(null)
    const [montoRestanteFactura, setMontoRestanteFactura] = useState(null)
    const [imputaciones, setImputaciones] = useState([])
    const [flagCliente, setFlagCliente] = useState(false)
    const navigate = useNavigate();
    
    useEffect(() => {
        const cliente = clientesData.find(cliente => cliente.email === email);
        const proveedor = proveedoresData.find(proveedor => proveedor.email === email);

        if (cliente && !proveedor) {
            setPersona(cliente);
            setFlagCliente(true);
        } else if (!cliente && proveedor) {
            setPersona(proveedor)
            setFlagCliente(false);
        }
    }, [email, clientesData, proveedoresData]);

    useEffect(() => {
        if (persona) {      
            const facturasCorrespondientes = facturasData.filter(factura => factura.persona_nombre === persona.nombre && factura.flag_cancelada === false)
                .map(factura => {
                    if (!flagCliente) {
                        return {
                            id: factura.id,
                            numero_pedido: factura.pedido_id,
                            numero_remito: "-",
                            flag_imputada: factura.flag_imputada,
                            a_pagar: factura.monto,
                            total: factura.monto,
                            descuento: 0,
                            fecha: formatearFechaPago(factura.fecha)
                        };
                    } else {
                        const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);
                        return {
                            id: factura.id,
                            numero_pedido: <span
                                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                                onClick={() => handleVerPedido(factura.pedido_id)}
                                            >
                                                {factura.pedido_id}
                                            </span>,
                            numero_pedidoID: factura.pedido_id,
                            numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                            flag_imputada: factura.flag_imputada,
                            a_pagar: factura.monto,
                            total: remitoCorrespondiente? factura.monto / (1 - remitoCorrespondiente.descuento / 100) : factura.monto,
                            descuento: remitoCorrespondiente? remitoCorrespondiente.descuento: 0,
                            fecha: formatearFechaPago(factura.fecha)
                        };
                    }
                })
                .sort((a, b) => {
                    if (flagCliente) {
                        return b.id - a.id;
                    } else {
                        const [diaA, mesA, anioA] = a.fecha.split("/");
                        const [diaB, mesB, anioB] = b.fecha.split("/");
                        const fechaA = new Date(`${anioA}-${mesA}-${diaA}`);
                        const fechaB = new Date(`${anioB}-${mesB}-${diaB}`);
                        return fechaB - fechaA;
                    }
                });

            let personaId;

            if(persona.persona_id) {
                personaId = persona.persona_id
            } else {
                personaId = persona.id
            }

            const pagosCorrespondientes = pagosData.filter(pago => pago.persona_id === personaId).filter(pago => pago.pago_padre_id === null)
                .sort((a, b) => {
                    const fechaA = new Date(a.fecha);
                    const fechaB = new Date(b.fecha);
                    
                    return fechaB - fechaA;
                })
                .map((pago, index) => ({
                    id: pago.id,
                    flag_imputado: pago.flag_imputado,
                    fecha: formatearFechaPago(pago.fecha),
                    monto: pago.monto,
                    destino: pago.destino,
                }))

            const facturasOrdenadas = facturasCorrespondientes.reverse()
            const pagosOrdenados = pagosCorrespondientes.reverse()

            setPagos(pagosOrdenados)
            setFacturasPorMes(agruparPorMes(facturasOrdenadas))

            const totalPagado = pagosOrdenados.reduce((sum, pago) => sum + pago.monto, 0)
            const montoRestante = facturasOrdenadas.reduce((sum, fac) => sum + fac.a_pagar, 0)
            setTotalPagadoFactura(totalPagado)
            setMontoRestanteFactura(montoRestante)

            const imputacionesFiltradas = imputacionesData.filter(imputacion => {
                return facturasCorrespondientes.some(fac => fac.id === imputacion.factura_id);
            });

            const imputacionesGroup = imputacionesFiltradas.reduce((acc, imputacion) => {
                const numeroImputacion = imputacion.numero_imputacion;
                
                if (!acc[numeroImputacion]) {
                    acc[numeroImputacion] = [];
                }
                
                acc[numeroImputacion].push(imputacion);
                
                return acc;
            }, {});

            const detailedImputaciones = Object.keys(imputacionesGroup).map(numeroImputacion => {
                const imputaciones = imputacionesGroup[numeroImputacion];
                
                const fecha = imputaciones[0].createdAt;
            
                const facturasUnicas = Array.from(new Set(imputaciones.map(imputacion => imputacion.factura_id)));

                const pagosUnicos = Array.from(new Set(imputaciones.map(imputacion => imputacion.pago_id)));

                const montoImputacion = facturasUnicas.reduce((total, factura_id) => {
                    const factura = facturasCorrespondientes.find(fac => fac.id === factura_id);
                    return total + (factura ? factura.a_pagar : 0);
                }, 0);

                const montoSobrante = pagosUnicos.reduce((total, pago_id) => {
                    const pago = pagosData.find(pago => pago.id === pago_id);
                    return total + (pago ? pago.monto : 0); 
                }, 0) - montoImputacion; 
            
                return {
                    numero_imputacion: numeroImputacion,
                    fecha: formatearFecha(fecha),
                    montoImputacion,
                    montoSobrante
                };
            });

            setImputaciones(detailedImputaciones)
        }
    }, [persona, facturasData, remitosData, pagosData, imputacionesData]);   

    const agruparPorMes = (facturas) => {
        const facturasAgrupadas = {};
    
        facturas.forEach((factura) => {
            const [dia, mes, anio] = factura.fecha.split('/');
            const fecha = new Date(`${anio}-${mes}-${dia}`);
    
            const mesAño = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`;
            
            if (!facturasAgrupadas[mesAño]) {
                facturasAgrupadas[mesAño] = [];
            }
    
            facturasAgrupadas[mesAño].push(factura);
        });
    
        return facturasAgrupadas;
    };

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

    const obtenerNombreMes = (mesAnyo) => {
        const [mes, anyo] = mesAnyo.split("-");
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return `${meses[parseInt(mes) - 1]} ${anyo}`;
    };

    const generarPdfRemito = (factura) => {
        if(factura.numero_remito === "-") {
            alert("No se puede imprimir la factura sin antes crear el remito")
        } else {
            setIsLoading(true);
                    
            const ventana = window.open(
                `${apiUrl}/pdf/remito/${factura.numero_pedidoID}`,
                '_blank'
            );
            
            if (!ventana) {
                alert('Habilite las ventanas emergentes para ver o descargar el PDF');
            }
            
            setIsLoading(false);
        }
    }

    const generarPdfHistorial = () => {
        setIsLoading(true)

        let personaId;

        if(persona.persona_id) {
            personaId = persona.persona_id
        } else {
            personaId = persona.id
        }
        
        const ventana = window.open(
            `${apiUrl}/pdf/historial/${personaId}`,
            '_blank'
        );
        
        if (!ventana) {
            alert('Habilite las ventanas emergentes para ver o descargar el PDF');
        }
        
        setIsLoading(false);
    }

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${email}`);
    }

    const detallesImputacion = (imputacion) => {
        navigate(`/admin/cobranzas/${imputacion.numero_imputacion}`)
    }

    const handleVerPedido = (pedidoId) => {
        navigate(`/admin/pedidos?selected=${pedidoId}`);
    }

    return (
        <>
            {isLoading && <Loading/>}
            <NavbarAdm/>
            <div className="fixedCuentaCorriente">
                {persona && (
                    <div style={{width: "100%"}}>
                        <h1 style={{marginTop: "0", marginBottom: "0", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                            sans-serif`}}>
                            Historial de {persona.nombre}
                        </h1>
                        <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                    </div>
                )}

                <div style={{display: "flex", alignItems: "center", marginTop: "0", width: "100%"}}>
                    <div style={{width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                                {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
                                {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL COBRANZAS A/C: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                                <span style={{ fontWeight: "bold" }}>{montoRestanteFactura - totalPagadoFactura >= 0 ? "SALDO DEUDOR: " : "SALDO ACREEDOR: "}<span style={{ fontWeight: "normal" }}>${formatearNumero(Math.abs(montoRestanteFactura - totalPagadoFactura))}</span></span>
                            </div>
                        </div>
                    </div>
                    <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Button onClick={handleCuentaCorriente} className="btnRemito">Cuenta Corriente</Button>
                        <Button onClick={generarPdfHistorial} className="btnRemito">PDF Historial</Button>
                    </div>
                </div>
            </div>

            <div style={{marginTop: "calc(180px + 4.5rem)"}}>
                {Object.keys(facturasPorMes).length > 0 ? (
                    <>
                        <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Cobranzas A/C</h2>

                        {pagos.length > 0 ? (
                            <>
                                <div className="tableDivContainer">
                                    <table className="tableContainerSinPaginacion">
                                        <thead>
                                            <tr>
                                                <th>N° Pago</th>
                                                <th>Fecha</th>
                                                <th>Monto</th>
                                                <th>Destino</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagos.map((pago, index) => (
                                                <tr key={index}>
                                                    <td>{pago.id}</td>
                                                    <td>{pago.fecha}</td>
                                                    <td>${formatearNumero(pago.monto)}</td>
                                                    <td>{pago.destino}</td>
                                                    <td>{pago.flag_imputado ? "IMPUTADA" : "PENDIENTE"}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td style={{fontWeight: "bold"}}>TOTAL</td>
                                                <td></td>
                                                <td style={{fontWeight: "bold"}}>${formatearNumero(totalPagadoFactura)}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>  
                        ) : (
                            <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>
                                No hay Cobranzas A/C para mostrar.
                            </p>
                        )}

                        <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                        <h2 style={{marginTop: "0", marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Facturas</h2>

                        {Object.entries(facturasPorMes).map(([mesAnio, facturas]) => {
                            return (
                                <>
                                    <h2 style={{marginBottom: "0", marginTop: "1rem",textAlign: "center", fontSize: "22px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                        sans-serif`}}>{obtenerNombreMes(mesAnio)}</h2>

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
                                                    <th>Estado</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {facturas.map((factura, index) => (
                                                    <tr key={index}>
                                                        <td>{factura.numero_pedido}</td>
                                                        <td>{factura.numero_remito}</td>
                                                        <td>{factura.fecha}</td>
                                                        <td>${formatearNumero(factura.total)}</td>
                                                        <td>{factura.descuento}%</td>
                                                        <td>${formatearNumero(factura.a_pagar)}</td>
                                                        <td>{factura.flag_imputada ? "IMPUTADA" : "PENDIENTE"}</td>
                                                        <td>
                                                            <button onClick={() => generarPdfRemito(factura)} className="botonEliminar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                                <FontAwesomeIcon icon={faFileAlt} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td style={{fontWeight: "bold"}}>TOTAL</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{fontWeight: "bold"}}>${formatearNumero(facturas.reduce((total, factura) => total + factura.a_pagar, 0))}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )
                        })}

                        <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                        <h2 style={{marginTop: "0", marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>
                            Cobranzas
                        </h2>

                        {imputaciones.length > 0 ? (
                            <div className="tableDivContainer" style={{marginBottom: "1rem"}}>
                                <table className="tableContainerSinPaginacion">
                                    <thead>
                                        <tr>
                                            <th>N° Cobranza</th>
                                            <th>Fecha</th>
                                            <th>Monto</th>
                                            <th>Pagado</th>
                                            <th>Sobrante</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {imputaciones.map((imputacion, index) => (
                                            <tr key={index}>
                                                <td>{imputacion.numero_imputacion}</td>
                                                <td>{imputacion.fecha}</td>
                                                <td>${formatearNumero(imputacion.montoImputacion)}</td>
                                                <td>${formatearNumero(imputacion.montoImputacion + imputacion.montoSobrante)}</td>
                                                <td>${formatearNumero(imputacion.montoSobrante)}</td>
                                                <td>
                                                    <button onClick={() => detallesImputacion(imputacion)} className="botonEliminar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>
                                No hay cobranzas para mostrar.
                            </p>
                        )}
                    </>
                ) : (
                    <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>
                        No hay facturas para mostrar.
                    </p>
                )}
            </div>
        </>
    );
}

export default HistorialCuentaCorriente;
