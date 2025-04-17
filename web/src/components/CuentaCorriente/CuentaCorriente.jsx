import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import ModalPago from "./ModalPago";
import ModalRemito from "./ModalRemito";
import ModalRemitoEditar from "./ModalRemitoEditar";
import ModalFacturaEditar from "./ModalFacturaEditar";
import ModalPagoEditar from "./ModalPagoEditar";
import { useNavigate } from 'react-router-dom';

const CuentaCorriente = () => {
    const { email } = useParams();
    const { clientesData, proveedoresData, facturasData, refreshFacturas, remitosData, refreshRemitos, pagosData, refreshPagos, addImputaciones } = useData()
    const [ persona, setPersona ] = useState(null);
    const [ facturas, setFacturas ] = useState([]);
    const [flagImputando, setFlagImputando] = useState(false)
    const [totalFacturasImputando, setTotalFacturasImputando] = useState(0)
    const [totalPagosImputando, setTotalPagosImputando] = useState(0)
    const [imputacion, setImputacion] = useState({
        facturas: [],
        pagos: []
    })
    const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
    const [isFacturaModalOpen, setIsFacturaModalOpen] = useState(false);
    const [isPagoEditModalOpen, setIsPagoEditModalOpen] = useState(false);
    const [isRemitoModalOpen, setIsRemitoModalOpen] = useState(false);
    const [isRemitoEditModalOpen, setIsRemitoEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowPago, setSelectedRowPago] = useState(null);
    const [remitoExiste, setRemitoExiste] = useState(null);
    const [flagCliente, setFlagCliente] = useState(false)
    const [pagos, setPagos] = useState([])
    const [facturasImputables, setFacturasImputables] = useState([])
    const [totalPagadoFactura, setTotalPagadoFactura] = useState(null)
    const [montoRestanteFactura, setMontoRestanteFactura] = useState(null)
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
            const facturasCorrespondientes = facturasData.filter(factura => factura.flag_imputada === false && factura.persona_nombre === persona.nombre && factura.flag_cancelada === false)
                .map(factura => {
                    const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);
                    return {
                        id: factura.id,
                        numero_pedido: factura.pedido_id,
                        numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
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

            const pagosCorrespondientes = pagosData.filter(pago => pago.persona_id === personaId).filter(pago => pago.flag_imputado === false)
                .sort((a, b) => {
                    const fechaA = new Date(a.fecha);
                    const fechaB = new Date(b.fecha);
                    
                    return fechaB - fechaA;
                })
                .map((pago) => {
                    const isSobrante = pago.pago_padre_id !== null
                    
                    return {
                        id: pago.id,
                        fecha: formatearFechaPago(pago.fecha),
                        monto: pago.monto,
                        destino: isSobrante ? (
                            <span
                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => handleVerImputacion(pago.destino.split(" ")[3])}
                            >
                                {pago.destino}
                            </span>
                        ) : pago.destino,
                        flagSobrante: isSobrante,
                    };
                });

            const facturasOrdenadas = facturasCorrespondientes.reverse()
            const pagosOrdenados = pagosCorrespondientes.reverse()

            const facturaPedidoId = facturasOrdenadas[0]?.numero_pedido;
            if (facturaPedidoId) {
                const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === facturaPedidoId);
            
                if (remitoCorrespondiente) {
                    setRemitoExiste(remitoCorrespondiente)
                } else {
                    setRemitoExiste(null)
                }
            } else {
                setRemitoExiste(null)
            }

            setPagos(pagosOrdenados)
            setFacturas(facturasOrdenadas)
            setFacturasImputables(facturasOrdenadas.filter((factura) => !((flagCliente && factura.numero_remito === "-") || factura.a_pagar === 0)))
            setSelectedRow(facturasOrdenadas[0])

            const totalPagado = pagosOrdenados.reduce((sum, pago) => sum + pago.monto, 0)
            const montoRestante = facturasOrdenadas.reduce((sum, fac) => sum + fac.a_pagar, 0)
            setTotalPagadoFactura(totalPagado)
            setMontoRestanteFactura(montoRestante)
        }
    }, [persona, facturasData, remitosData, pagosData]);   

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

    const handleRowClick = (row) => {
        const facturaPedidoId = row.numero_pedido;

        if (facturaPedidoId) {
            const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === facturaPedidoId);

            if (remitoCorrespondiente) {
                setRemitoExiste(remitoCorrespondiente)
            } else {
                setRemitoExiste(null)
            }
        } else {
            setRemitoExiste(null)
        }

        setSelectedRow(row);
    };

    const handleAddRemito = (remito) => {
        setIsLoading(true)

        const requestData = {
            descuento: parseFloat(remito.descuento),
            dias_vencimiento: parseInt(remito.dias_vencimiento),
            cantidad_cajas: parseInt(remito.cantidad_cajas),
            pedido_id: selectedRow.numero_pedido
        }

        fetch(`${apiUrl}/remitos`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al crear remito, verifique los datos ingresados")
                throw new Error("Error en la solicitud POST");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Remito creado con éxito") {
                const facturaCorrespondiente = facturasData.find(fac => fac.pedido_id === selectedRow.numero_pedido);
                const nuevoMonto = facturaCorrespondiente.monto * (1 - remito.descuento / 100);

                const facturaActualizada = {...facturaCorrespondiente, monto: nuevoMonto}

                const updatedFacturas = facturasData.map(fac =>
                    fac.pedido_id === selectedRow.numero_pedido ? facturaActualizada : fac
                );

                const nuevoRemito = {
                    numero_remito: result.numero_remito,
                    descuento: remito.descuento,
                    dias_vencimiento: remito.dias_vencimiento,
                    cantidad_cajas: remito.cantidad_cajas,
                    pedido_id: selectedRow.numero_pedido
                }

                const updatedData = [...remitosData, nuevoRemito];

                refreshFacturas(updatedFacturas)
                setRemitoExiste(nuevoRemito)
                refreshRemitos(updatedData)
            }
            
            alert(result.message)
            setIsLoading(false)
        })
        .catch((error) => {
            setIsLoading(false)
            console.error("Error en la solicitud POST:", error);
        });
    }

    const handleEditRemito = (remitoEdit) => {
        setIsLoading(true)

        const requestData = {
            descuento: parseFloat(remitoEdit.descuento),
            dias_vencimiento: parseInt(remitoEdit.dias_vencimiento),
            cantidad_cajas: parseInt(remitoEdit.cantidad_cajas),
        }

        fetch(`${apiUrl}/remitos/${remitoEdit.pedido_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al editar remito, verifique los datos ingresados")
                throw new Error("Error en la solicitud PUT");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Remito editado con éxito") {
                const facturaCorrespondiente = facturasData.find(fac => fac.pedido_id === selectedRow.numero_pedido);
                const nuevoMonto = result.nuevoMonto

                const facturaActualizada = {...facturaCorrespondiente, monto: nuevoMonto}

                const updatedFacturas = facturasData.map(fac =>
                    fac.pedido_id === selectedRow.numero_pedido ? facturaActualizada : fac
                );

                const nuevoRemito = {
                    numero_remito: remitoEdit.numero_remito,
                    descuento: parseFloat(remitoEdit.descuento),
                    dias_vencimiento: parseInt(remitoEdit.dias_vencimiento),
                    cantidad_cajas: parseInt(remitoEdit.cantidad_cajas),
                    pedido_id: remitoEdit.pedido_id
                }

                const updatedData = remitosData.map(remito =>
                    remito.numero_remito === nuevoRemito.numero_remito ? nuevoRemito : remito
                );

                refreshFacturas(updatedFacturas)
                setRemitoExiste(nuevoRemito)
                refreshRemitos(updatedData)
            }
            
            alert(result.message)
            setIsLoading(false)
        })
        .catch(error => {
            setIsLoading(false)
            console.error("Error en la solicitud PUT:", error);
        });
    }

    const generarPdfRemito = () => {
        setIsLoading(true)

        fetch(`${apiUrl}/pdf/remito/${remitoExiste.pedido_id}`, {
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

    const generarPdfCuenta = () => {
        setIsLoading(true)

        fetch(`${apiUrl}/pdf/cuenta-corriente/${persona.persona_id}`, {
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

    const handleFacturaEdit = (factura) => {
        setIsLoading(true)

        const requestData = {
            monto: factura.monto
        }

        fetch(`${apiUrl}/facturas/${factura.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al editar, intente nuevamente")
                throw new Error("Error en la solicitud PUT");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Factura editada con éxito") {
                const facturaCorrespondiente = facturasData.find(fac => fac.id === factura.id);

                const facturaActualizada = {...facturaCorrespondiente, monto: factura.monto}

                const updatedFacturas = facturasData.map(fac =>
                    fac.id === factura.id ? facturaActualizada : fac
                );

                refreshFacturas(updatedFacturas)
            }
            
            alert(result.message)
            setIsLoading(false)
        })
        .catch((error) => {
            console.error("Error en la solicitud PUT:", error)
            setIsLoading(false)
        });
    }

    const handleAddPago = (monto, destino, fecha) => {
        setIsLoading(true)

        let personaId;

        if(persona.persona_id) {
            personaId = persona.persona_id
        } else {
            personaId = persona.id
        }

        const requestData = {
            monto,
            destino,
            persona_id: personaId,
            fecha
        }

        fetch(`${apiUrl}/pagos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al crear, intente nuevamente")
                throw new Error("Error en la solicitud POST");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Cobranza A/C creada con éxito") {
                const nuevoPago = {
                    id: result.id,
                    fecha: fecha,
                    flag_imputado: false,
                    pago_padre_id: null,
                    destino: destino,
                    monto: monto,
                    persona_id: personaId
                }
                
                const updatedData = [...pagosData, nuevoPago];
                setPagos(updatedData);
                refreshPagos(updatedData)
            }
            
            alert(result.message)
            setIsLoading(false)
        })
        .catch((error) => {
            console.error("Error en la solicitud POST:", error)
            setIsLoading(false)
        });
    }

    const handleEditPago = (row) => {
        if(row.flagSobrante) {
            alert("No se puede editar una cobranza A/C sobrante")
        } else {
            setSelectedRowPago(row)
            setIsPagoEditModalOpen(true)
        }
    }

    const handlePagoEdit = (pago) => {
        setIsLoading(true)

        const requestData = {
            monto: pago.monto,
            destino: pago.flagSobrante ? pago.destino.props.children : pago.destino,
            fecha: pago.fecha
        }

        fetch(`${apiUrl}/pagos/${pago.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (!response.ok) {
                alert("Error al editar, intente nuevamente")
                throw new Error("Error en la solicitud PUT");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === 'Cobranza A/C editada con éxito') {
                const pagoCorrespondiente = pagosData.find(pag => pag.id === pago.id);

                const pagoActualizado = {...pagoCorrespondiente, monto: pago.monto, destino: pago.destino, fecha: pago.fecha}

                const updatedPagos = pagosData.map(pag =>
                    pag.id === pago.id ? pagoActualizado : pag
                );

                refreshPagos(updatedPagos)
            }
            
            alert(result.message)
            setIsLoading(false)
        })
        .catch((error) => {
            console.error("Error en la solicitud PUT:", error)
            setIsLoading(false)
        });
    }

    const handleDeletePago = (row) => {
        const pago = row

        if(pago.flagSobrante) {
            alert("No se puede eliminar una cobranza A/C sobrante")
        } else {
            const shouldDelete = window.confirm(
                `¿Estas seguro que deseas eliminar la cobranza A/C N° ${pago.id}?`
            );
    
            if (shouldDelete) {
                setIsLoading(true)
    
                fetch(`${apiUrl}/pagos/${pago.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                })
                .then((response) => {
                    if (!response.ok) {
                        alert("Error al eliminar pago, intente nuevamente");
                        throw new Error("Error en la solicitud DELETE");
                    }
                    return response.json();
                })
                .then((result) => {
                    if(result.message === "Cobranza A/C eliminada con éxito") {
                        const updatedData = pagosData.filter((pag) => pag.id !== pago.id);
    
                        setPagos(updatedData);
                        refreshPagos(updatedData)
                    }
                    
                    alert(result.message)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error("Error en la solicitud DELETE:", error);
                    setIsLoading(false)
                });
            }
        }
    }

    const handleAddImputacion = () => {
        setIsLoading(true)

        if(imputacion.facturas.length > 0 && totalFacturasImputando <= totalPagosImputando){
            const montoSobrante = totalPagosImputando - totalFacturasImputando

            let personaId;

            if(persona.persona_id) {
                personaId = persona.persona_id
            } else {
                personaId = persona.id
            }

            const requestData = 
            {
                facturas: imputacion.facturas,
                pagos: imputacion.pagos,
                monto_sobrante: montoSobrante,
                persona_id: personaId
            }
        
            fetch(`${apiUrl}/imputaciones`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`
                },
                body: JSON.stringify(requestData)
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al agregar cobranza, verifique los datos ingresados")
                    throw new Error("Error en la solicitud POST");
                }
                return response.json();
            })
            .then((result) => {
                if(result.message === "Cobranza creada con éxito") {
                    const facturasActualizadas = facturasData.map(fac => {
                        if(imputacion.facturas.includes(fac.id)){
                            return {...fac, flag_imputada: true}
                        } else return fac
                    })
                
                    const pagosActualizados = pagosData.map(pag => {
                        if(imputacion.pagos.includes(pag.id)) {
                            return {...pag, flag_imputado: true}
                        } else return pag
                    })

                    if(result.nuevoPago){
                        result.nuevoPago.fecha = new Date().toISOString().split("T")[0];
                        pagosActualizados.push(result.nuevoPago)
                    }

                    const filasImputacion = [];
                    for (const pago_id of imputacion.pagos) {
                        for (const factura_id of imputacion.facturas) {
                            filasImputacion.push({ pago_id, factura_id, createdAt: Date.now() });
                        }
                    }

                    addImputaciones(filasImputacion)
                    setFacturas(facturasActualizadas)
                    setPagos(pagosActualizados)
                    refreshFacturas(facturasActualizadas)
                    refreshPagos(pagosActualizados)
                    setImputacion({
                        facturas: [],
                        pagos: []
                    })
                    setTotalFacturasImputando(0)
                    setTotalPagosImputando(0)
                    setFlagImputando(false)
                }

                alert(result.message)
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false)
                console.error("Error en la solicitud POST:", error);
            });
        } else {
            alert("El monto de los pagos debe superar al de las facturas")
            setIsLoading(false)
        } 
    }

    const handleCheckboxChangeFacturas = (event, factura) => {
        setImputacion((prevImputacion) => {
            const prevFacturas = Array.isArray(prevImputacion.facturas) ? prevImputacion.facturas : [];
            
            let newFacturas;
            if (event.target.checked) {
                newFacturas = [...prevFacturas, factura.id];
            } else {
                newFacturas = prevFacturas.filter(facturaId => facturaId !== factura.id);
            }
    
            const nuevoTotalFacturas = newFacturas.reduce((total, facturaId) => {
                const facturaEncontrada = facturas.find(f => f.id === Number(facturaId));
                return facturaEncontrada ? total + facturaEncontrada.a_pagar : total;
            }, 0);
    
            setTotalFacturasImputando(nuevoTotalFacturas);
    
            return {
                ...prevImputacion,
                facturas: newFacturas
            };
        });
    };

    const handleCheckboxChangeAllFacturas = (event) => {
        const isChecked = event.target.checked;

        setImputacion((prevImputacion) => {
            const allFacturaIds = isChecked
                ? facturasImputables.map(f => f.id)
                : [];
        
            const nuevoTotalFacturas = isChecked
                ? facturasImputables.reduce((total, f) => total + f.a_pagar, 0)
                : 0;
        
            setTotalFacturasImputando(nuevoTotalFacturas);
        
            return {
                ...prevImputacion,
                facturas: allFacturaIds,
            };
        });
    }

    const handleCheckboxChangePagos = (event, pago) => {
        setImputacion((prevImputacion) => {
            const prevPagos = Array.isArray(prevImputacion.pagos) ? prevImputacion.pagos : [];
            
            let newPagos;
            if (event.target.checked) {
                newPagos = [...prevPagos, pago.id];
            } else {
                newPagos = prevPagos.filter(pagoId => pagoId !== pago.id);
            }
    
            const nuevoTotalPagos = newPagos.reduce((total, pagoId) => {
                const pagoEncontrado = pagos.find(p => p.id === Number(pagoId));
                return pagoEncontrado ? total + pagoEncontrado.monto : total;
            }, 0);
    
            setTotalPagosImputando(nuevoTotalPagos);
    
            return {
                ...prevImputacion,
                pagos: newPagos
            };
        });
    };

    const handleCheckboxChangeAllPagos = (event) => {
        const isChecked = event.target.checked;

        setImputacion((prevImputacion) => {
            const allPagoIds = isChecked ? pagos.map(p => p.id) : [];
    
            const nuevoTotalPagos = isChecked
                ? pagos.reduce((total, p) => total + p.monto, 0)
                : 0;
    
            setTotalPagosImputando(nuevoTotalPagos);
    
            return {
                ...prevImputacion,
                pagos: allPagoIds
            };
        });
    }

    const handleCancelarImputacion = () => {
        setImputacion({
            facturas: [],
            pagos: []
        })
        setTotalFacturasImputando(0)
        setTotalPagosImputando(0)
        setFlagImputando(false)
    }

    const handleHistorial = () => {
        navigate(`/admin/cuenta-corriente/${email}/historial`);
    }

    const handleVerImputacion = (idImputacion) => {
        navigate(`/admin/cobranzas/${idImputacion}`);
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
                        Cuenta Corriente de {persona.nombre}
                    </h1>  
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>
                </>
            )}

            <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                {flagImputando? (
                    <>
                        <div style={{width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                            <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>Montos de la Cobranza Actual</h2>

                            <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                                <span style={{ fontWeight: "bold" }}>TOTAL COBRANZAS A/C: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagosImputando)}</span></span>
                                <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(totalFacturasImputando)}</span></span>
                            </div>  
                        </div>
                        <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Button onClick={handleCancelarImputacion} className="btnRemito">Cancelar</Button>
                            <Button onClick={handleAddImputacion} className="btnRemito">Confirmar</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                            <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>Montos Totales sin Imputar</h2>
                            <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                                {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL COBRANZAS A/C: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                                {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
                            </div> 
                        </div>
                        <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Button onClick={handleHistorial} className="btnRemito">Historial</Button>
                            <Button onClick={() => setIsPagoModalOpen(true)} className="btnRemito">Agregar Cobranza A/C</Button>
                            <Button onClick={() => setFlagImputando(true)} className="btnRemito">Imputar</Button>
                            {flagCliente && (
                                <Button onClick={() => generarPdfCuenta()} className="btnRemito">PDF Cuenta Corriente</Button> 
                            )}       
                        </div>
                    </>
                )}
            </div>

            {facturas.length > 0 ? (
                <>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Cobranzas A/C</h2>

                    {pagos.length > 0 ? (
                        <>
                            <div className="tableDivContainer">
                                <table className="tableContainerSinPaginacion">
                                    <thead>
                                        <tr>
                                            {flagImputando && 
                                                <th>
                                                    <input 
                                                        type="checkbox"
                                                        onChange={(e) => handleCheckboxChangeAllPagos(e)}
                                                        checked={pagos.length > 0 && imputacion.pagos.length === pagos.length}
                                                    />
                                                </th>
                                            }
                                            <th>N° Pago</th>
                                            <th>Fecha</th>
                                            <th>Monto</th>
                                            <th>Destino</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagos.map((pago, index) => (
                                            <tr key={index}>
                                                {flagImputando && (
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckboxChangePagos(e, pago)}
                                                            checked={imputacion.pagos.includes(pago.id)}
                                                        />
                                                    </td>
                                                )}
                                                <td>{pago.id}</td>
                                                <td>{pago.fecha}</td>
                                                <td>${formatearNumero(pago.monto)}</td>
                                                <td style={{whiteSpace: "normal"}}>{pago.destino}</td>
                                                <td>
                                                    <button onClick={() => handleEditPago(pago)} className="botonEditar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDeletePago(pago)} className="botonEliminar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <div className="tableDivContainer">
                            <table className="tableContainerSinPaginacion">
                                <thead>
                                    <tr>
                                        {flagImputando && 
                                            <th>
                                                <input 
                                                    type="checkbox"
                                                    onChange={(e) => handleCheckboxChangeAllFacturas(e)}
                                                    checked={
                                                        facturasImputables.length > 0 &&
                                                        imputacion.facturas.length === facturasImputables.length
                                                    }
                                                />
                                            </th>
                                        }
                                        <th>N° Pedido</th>
                                        <th>N° Remito</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Descuento</th>
                                        <th>A Pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facturas.map((factura, index) => (
                                        <tr 
                                            key={index}
                                            onClick={() => handleRowClick(factura)}
                                            style={{backgroundColor: selectedRow?.id === factura.id ? "darkgray": "revert-layer"}}
                                        >
                                            {flagImputando && (
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        disabled={flagCliente && factura.numero_remito === "-" || factura.a_pagar === 0}
                                                        onChange={(e) => handleCheckboxChangeFacturas(e, factura)}
                                                        checked={imputacion.facturas.includes(factura.id)}
                                                    />
                                                </td>
                                            )}
                                            <td>{factura.numero_pedido}</td>
                                            <td>{factura.numero_remito}</td>
                                            <td>{factura.fecha}</td>
                                            <td>${formatearNumero(factura.total)}</td>
                                            <td>{formatearNumero(factura.descuento)}%</td>
                                            <td>${formatearNumero(factura.a_pagar)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>        
                                    
                        <div style={{ minWidth: "20%",}}>
                            {flagCliente && (
                                <h2 style={{marginTop: "1rem", marginBottom: "1rem", textAlign: "center", fontSize: "25px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>Remito de la Factura Seleccionada</h2>
                            )}

                            {selectedRow && (
                                flagCliente && (
                                    <div style={{height: "8rem", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.5rem"}}>
                                        {remitoExiste ? (
                                            <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
                                                <span style={{ fontWeight: "bold" }}>Número de Remito: <span style={{fontWeight: "normal"}}>{remitoExiste.numero_remito}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Descuento: <span style={{fontWeight: "normal"}}>{remitoExiste.descuento}%</span></span>
                                                <span style={{ fontWeight: "bold" }}>Días de Vencimiento: <span style={{fontWeight: "normal"}}>{remitoExiste.dias_vencimiento}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Cantidad de Cajas: <span style={{fontWeight: "normal"}}>{remitoExiste.cantidad_cajas}</span></span>
                                            </div>
                                        ) : (
                                            <h2 style={{marginTop: "2.5rem", textAlign: "center", fontSize: "15px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                                sans-serif`}}>No existe remito</h2>
                                        )}
                                    </div>
                                )
                            )}
                            {selectedRow && !flagImputando && (
                            flagCliente ? (
                                remitoExiste ? (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <Button onClick={() => setIsRemitoEditModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Editar Remito</Button>
                                        <Button onClick={() => generarPdfRemito()} className="btnRemito" style={{width: "145px"}}>PDF Remito</Button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <Button onClick={() => setIsRemitoModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Crear Remito</Button>
                                    </div>
                                )
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem"}}>
                                        <Button onClick={() => setIsFacturaModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Editar Factura</Button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    
                    {isFacturaModalOpen && (
                        <ModalFacturaEditar
                            data={selectedRow}
                            onClose={() => setIsFacturaModalOpen(false)}
                            onSave={handleFacturaEdit}
                        />
                    )}
                    {isPagoModalOpen && (
                        <ModalPago
                            onClose={() => setIsPagoModalOpen(false)}
                            onSave={handleAddPago}
                        />
                    )}
                    {isPagoEditModalOpen && (
                        <ModalPagoEditar
                            data={selectedRowPago}
                            onClose={() => setIsPagoEditModalOpen(false)}
                            onSave={handlePagoEdit}
                        />
                    )}
                    {isRemitoModalOpen && (
                        <ModalRemito
                            onClose={() => setIsRemitoModalOpen(false)}
                            onSave={handleAddRemito}
                            cliente={persona}
                        />
                    )}
                    {isRemitoEditModalOpen && (
                        <ModalRemitoEditar
                            onClose={() => setIsRemitoEditModalOpen(false)}
                            onSave={handleEditRemito}
                            remitoEdit={remitoExiste}
                        />
                    )}
                </>
            ) : (
                <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>
                    No hay facturas para mostrar.
                </p>
            )}
        </>
    );
}

export default CuentaCorriente;
