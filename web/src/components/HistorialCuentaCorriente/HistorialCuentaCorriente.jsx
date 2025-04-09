import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
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
    const navigate = useNavigate();
    
    useEffect(() => {
        const cliente = clientesData.find(cliente => cliente.email === email);
        const proveedor = proveedoresData.find(proveedor => proveedor.email === email);

        if (cliente && !proveedor) {
            setPersona(cliente);
        } else if (!cliente && proveedor) {
            setPersona(proveedor)
        }
    }, [email, clientesData, proveedoresData]);

    useEffect(() => {
        if (persona) {      
            const facturasCorrespondientes = facturasData.filter(factura => factura.persona_nombre === persona.nombre && factura.flag_cancelada === false)
                .map(factura => {
                    const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);
                    return {
                        id: factura.id,
                        numero_pedido: factura.pedido_id,
                        numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                        flag_imputada: factura.flag_imputada,
                        a_pagar: factura.monto,
                        total: remitoCorrespondiente? factura.monto / (1 - remitoCorrespondiente.descuento / 100) : factura.monto,
                        descuento: remitoCorrespondiente? remitoCorrespondiente.descuento: 0,
                        fecha: formatearFecha(factura.createdAt)
                    };
                })
                .sort((a, b) => b.numero_pedido - a.numero_pedido)

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
            const [entero, decimal] = numero.toString().split('.');
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
            setIsLoading(true)

            fetch(`${apiUrl}/pdf/remito/${factura.numero_pedido}`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                }
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al generar el pdf, intente nuevamente");
                    throw new Error("Error en la solicitud GET");
                }
                return response.blob();
            })
            .then((result) => {
                const url = URL.createObjectURL(result);

                const newWindow = window.open(url, '_blank');

                if (!newWindow) {
                    alert('Habilite las ventanas emergentes para descargar el PDF');
                }

                URL.revokeObjectURL(url);

                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                console.error('Error en la solicitud GET:', error);
            });
        }
    }

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${email}`);
    }

    const detallesImputacion = (imputacion) => {
        navigate(`/admin/imputaciones/${imputacion.numero_imputacion}`)
    }

    return (
        <>
            {isLoading && <Loading/>}
            <NavbarAdm/>
            {persona && (
                <>
                    <h1 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "50px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>
                        Historial de {persona.nombre}
                    </h1>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>
                </>
            )}

            <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                sans-serif`}}>Montos Totales Históricos</h2>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: ".6rem"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                    {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL COBRANZAS A/C: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                    {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
                </div>
            </div>

            {Object.keys(facturasPorMes).length > 0 ? (
                <>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Cobranzas A/C</h2>

                    {pagos.length > 0 ? (
                        <>
                            <div className="tableDivContainer">
                                <table className="tableContainer">
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

                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Facturas</h2>

                    {Object.entries(facturasPorMes).map(([mesAnio, facturas]) => {
                        return (
                            <>
                                <h2 style={{marginBottom: "1rem", marginTop: "2rem",textAlign: "center", fontSize: "22px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                    sans-serif`}}>{obtenerNombreMes(mesAnio)}</h2>

                                <div className="tableDivContainer">
                                    <table className="tableContainer">
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
                                                        <button onClick={() => generarPdfRemito(factura)} className="botonEliminar">
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

                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>
                        Imputaciones
                    </h2>

                    {imputaciones.length > 0 ? (
                        <div className="tableDivContainer" style={{marginBottom: "100px"}}>
                            <table className="tableContainer">
                                <thead>
                                    <tr>
                                        <th>N° Imputación</th>
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
                                                <button onClick={() => detallesImputacion(imputacion)} className="botonEliminar">
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
                            No hay imputaciones para mostrar.
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

            <Button onClick={handleCuentaCorriente}  className="abajoDerecha" id="btnDescargarStock" style={{width: "200px"}}>Cuenta Corriente</Button>
        </>
    );
}

export default HistorialCuentaCorriente;
