import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useMemo, useState, useEffect } from "react";
import { COLUMNSCUENTACORRIENTE } from "./columnsCuentaCorriente";
import { COLUMNSPAGOS } from "./columnsPagos"
import { useTable, usePagination, useRowSelect } from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import ModalPago from "./ModalPago";
import ModalRemito from "./ModalRemito";
import ModalRemitoEditar from "./ModalRemitoEditar";
import ModalFacturaEditar from "./ModalFacturaEditar";
import ModalPagoEditar from "./ModalPagoEditar";
import ModalImputacion from "./ModalImputacion";
import { useNavigate } from 'react-router-dom';

const CuentaCorriente = () => {
    const { email } = useParams();
    const { clientesData, proveedoresData, pedidosData, facturasData, refreshFacturas, remitosData, refreshRemitos, pagosData, refreshPagos } = useData()
    const [ persona, setPersona ] = useState(null);
    const [ facturas, setFacturas ] = useState([]);
    const columnsFacturas = useMemo(() => COLUMNSCUENTACORRIENTE, []);
    const columnsPagos = useMemo(() => COLUMNSPAGOS, []);
    const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
    const [isFacturaModalOpen, setIsFacturaModalOpen] = useState(false);
    const [isPagoEditModalOpen, setIsPagoEditModalOpen] = useState(false);
    const [isRemitoModalOpen, setIsRemitoModalOpen] = useState(false);
    const [isRemitoEditModalOpen, setIsRemitoEditModalOpen] = useState(false);
    const [isImputacionModalOpen, setIsImputacionModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowPago, setSelectedRowPago] = useState(null);
    const [remitoExiste, setRemitoExiste] = useState(null);
    const [flagCliente, setFlagCliente] = useState(false)
    const [pagos, setPagos] = useState([])
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
            const pedidosCorrespondientes = pedidosData.filter(pedido => pedido.persona_nombre === persona.nombre && pedido.estado !== "CANCELADO")
            
            const facturasCorrespondientes = facturasData.filter(factura => factura.flag_imputada === false).filter(factura => pedidosCorrespondientes.find(pedido => pedido.numero_pedido === factura.pedido_id))
                .map(factura => {
                    const pedidoCorrespondiente = pedidosCorrespondientes.find(pedido => pedido.numero_pedido === factura.pedido_id);
                    const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === pedidoCorrespondiente.numero_pedido);
                    return {
                        id: factura.id,
                        numero_pedido: pedidoCorrespondiente.numero_pedido,
                        numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                        monto: factura.monto,
                        fecha: formatearFecha(factura.createdAt)
                    };
                })
                .sort((a, b) => a.numero_pedido - b.numero_pedido)

            let personaId;

            if(persona.persona_id) {
                personaId = persona.persona_id
            } else {
                personaId = persona.id
            }

            const pagosCorrespondientes = pagosData.filter(pago => pago.persona_id === personaId).filter(pago => pago.flag_imputado === false)
                .sort((a, b) => a.id - b.id)
                .map((pago, index) => ({
                    id: pago.id,
                    numero_pago: index + 1,
                    fecha: formatearFecha(pago.createdAt),
                    monto: pago.monto,
                    destino: pago.destino,
                }))

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
            setSelectedRow(facturasOrdenadas[0])

            const totalPagado = pagosOrdenados.reduce((sum, pago) => sum + pago.monto, 0)
            const montoRestante = facturasOrdenadas.reduce((sum, fac) => sum + fac.monto, 0)
            setTotalPagadoFactura(totalPagado)
            setMontoRestanteFactura(montoRestante)
        }
    }, [persona, pedidosData, facturasData, remitosData, pagosData]);   

    const {
        getTableProps: getFacturasTableProps,
        getTableBodyProps: getFacturasTableBodyProps,
        headerGroups: facturasHeaderGroups,
        page: facturasPage,
        nextPage: facturasNextPage,
        previousPage: facturasPreviousPage,
        canNextPage: facturasCanNextPage,
        canPreviousPage: facturasCanPreviousPage,
        pageOptions: facturasPageOptions,
        prepareRow: prepareFacturasRow,
        state: facturasState,
    } = useTable(
        {
            columns: columnsFacturas,
            data: facturas,
        },
        usePagination,
        useRowSelect
    );

    const { pageIndex: facturasPageIndex } = facturasState;

    const {
        getTableProps: getPagosTableProps,
        getTableBodyProps: getPagosTableBodyProps,
        headerGroups: pagosHeaderGroups,
        page: pagosPage,
        nextPage: pagosNextPage,
        previousPage: pagosPreviousPage,
        canNextPage: pagosCanNextPage,
        canPreviousPage: pagosCanPreviousPage,
        pageOptions: pagosPageOptions,
        prepareRow: preparePagosRow,
        state: pagosState
    } = useTable(
        {
            columns: columnsPagos,
            data: pagos,
        },
        usePagination
    );

    const { pageIndex: pagosPageIndex } = pagosState

    const formatearFecha = (fechaDateTime) => {
        const fecha = new Date(fechaDateTime);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    };

    const formatearNumero = (numero) => {
        if (typeof numero === 'number') {
            const [entero, decimal] = numero.toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    const handleRowClick = (row) => {
        const facturaPedidoId = row.original.numero_pedido;

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

        setSelectedRow(row.original);
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

    const handleAddPago = (monto, destino) => {
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
            persona_id: personaId
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
            if(result.message === "Pago creado con éxito") {
                const nuevoPago = {
                    id: result.id,
                    createdAt: new Date().toISOString(),
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
        setSelectedRowPago(row.original)
        setIsPagoEditModalOpen(true)
    }

    const handlePagoEdit = (pago) => {
        setIsLoading(true)

        const requestData = {
            monto: pago.monto,
            destino: pago.destino
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
            if(result.message === "Pago editado con éxito") {
                const pagoCorrespondiente = pagosData.find(pag => pag.id === pago.id);

                const pagoActualizado = {...pagoCorrespondiente, monto: pago.monto, destino: pago.destino}

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
        const pago = row.original

        const shouldDelete = window.confirm(
            `¿Estas seguro que deseas eliminar el pago N° ${pago.numero_pago}?`
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
                if(result.message === "Pago eliminado con éxito") {
                    const updatedData = pagosData.filter((pag) => pag.id !== pago.id);

                    setPagos(updatedData);
                    refreshPagos(updatedData)
                }
                
                alert(result.message)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error en la solicitud DELETE:", error);
            });
        }
    }

    const handleAddImputacion = (imputacion, montoSobrante) => {
        const facturasInt = imputacion.facturas.map((fac) => parseInt(fac, 10));
        const pagosInt = imputacion.pagos.map((pag) => parseInt(pag, 10));

        let personaId;

        if(persona.persona_id) {
            personaId = persona.persona_id
        } else {
            personaId = persona.id
        }

        const requestData = 
        {
            facturas: facturasInt,
            pagos: pagosInt,
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
                alert("Error al agregar imputacion, verifique los datos ingresados")
                throw new Error("Error en la solicitud POST");
            }
            return response.json();
        })
        .then((result) => {
            if(result.message === "Imputacion creada con éxito") {
                const facturasActualizadas = facturasData.map(fac => {
                    if(facturasInt.includes(fac.id)){
                        return {...fac, flag_imputada: true}
                    } else return fac
                })
            
                const pagosActualizados = pagosData.map(pag => {
                    if(pagosInt.includes(pag.id)) {
                        return {...pag, flag_imputado: true}
                    } else return pag
                })

                if(result.nuevoPago){
                    pagosActualizados.push(result.nuevoPago)
                }

                setFacturas(facturasActualizadas)
                setPagos(pagosActualizados)
                refreshFacturas(facturasActualizadas)
                refreshPagos(pagosActualizados)
            }

            alert(result.message)
            setIsLoading(false)
        })
        .catch(error => {
            setIsLoading(false)
            console.error("Error en la solicitud POST:", error);
        });
    }

    const handleHistorial = () => {
        navigate(`/admin/cuenta-corriente/${email}/historial`);
    }

    return (
        <>
            {isLoading && <Loading/>}
            <NavbarAdm/>
            {persona && (
                <h1 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>
                    Cuenta Corriente de {persona.nombre}
                </h1>  
            )}
            {facturas.length > 0 ? (
                <>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <div style={{width: "40%"}}>
                            <div style={{height: "6rem", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                {selectedRow && (
                                    flagCliente && (
                                        remitoExiste && (
                                            <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
                                                <span style={{ fontWeight: "bold" }}>Número de Remito: <span style={{fontWeight: "normal"}}>{remitoExiste.numero_remito}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Descuento: <span style={{fontWeight: "normal"}}>{remitoExiste.descuento}%</span></span>
                                                <span style={{ fontWeight: "bold" }}>Días de Vencimiento: <span style={{fontWeight: "normal"}}>{remitoExiste.dias_vencimiento}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Cantidad de Cajas: <span style={{fontWeight: "normal"}}>{remitoExiste.cantidad_cajas}</span></span>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            <div className="tableDivContainer">
                                <table {...getFacturasTableProps()} className="tableContainer">
                                    <thead>
                                        {facturasHeaderGroups.map((headerGroups) => (
                                            <tr {...headerGroups.getHeaderGroupProps()}>
                                            {headerGroups.headers.map((columns) => (
                                                <th {...columns.getHeaderProps(columns)}>
                                                    {columns.render("Header")}
                                                </th>
                                            ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody {...getFacturasTableBodyProps()}>
                                        {facturasPage.map((row, rowIndex) => {
                                            prepareFacturasRow(row);
                                            return (
                                                <tr 
                                                    key={rowIndex}
                                                    {...row.getRowProps()}
                                                    onClick={() => handleRowClick(row)}
                                                    style={{
                                                        backgroundColor: selectedRow.id === row.original.id ? "#dcd9d9" : ""
                                                    }}
                                                >
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td {...cell.getCellProps()}>
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="paginacion">
                                <button onClick={() => facturasPreviousPage()} disabled={!facturasCanPreviousPage}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <span>
                                    Pagina{" "}
                                    <strong>
                                        {facturasPageIndex + 1} de {facturasPageOptions.length}
                                    </strong>{" "}
                                </span>
                                <button onClick={() => facturasNextPage()} disabled={!facturasCanNextPage}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                                    

                            {selectedRow && (
                                flagCliente ? (
                                    remitoExiste ? (
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <Button onClick={() => setIsRemitoEditModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Editar Remito</Button>
                                            <Button onClick={() => generarPdfRemito()} className="btnRemito" style={{width: "145px"}}>PDF Remito</Button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Button onClick={() => setIsRemitoModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Crear Remito</Button>
                                        </div>
                                    )
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Button onClick={() => setIsFacturaModalOpen(true)} className="btnRemito" style={{width: "145px"}}>Editar Factura</Button>
                                    </div>
                                )
                            )}
                        </div>

                        <div style={{width: "50%", marginTop: "2rem"}}>
                            <>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: ".6rem"}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                                        {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL PAGADO: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                                        {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>MONTO RESTANTE: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
                                    </div>
                                </div>
                                {pagos.length > 0 ? (
                                    <>
                                        <div className="tableDivContainer">
                                            <table {...getPagosTableProps()} className="tableContainer">
                                                <thead>
                                                    {pagosHeaderGroups.map(headerGroup => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map(column => (
                                                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                <tbody {...getPagosTableBodyProps()}>
                                                    {pagosPage.map(row => {
                                                        preparePagosRow(row);
                                                        return  (
                                                            <tr {...row.getRowProps()}>
                                                                {row.cells.map((cell) => {
                                                                    return (
                                                                        <td {...cell.getCellProps()}>
                                                                            {cell.column.id === "eliminar" ? (
                                                                                <button onClick={() => handleDeletePago(row)} className="botonEliminar">
                                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                                </button>
                                                                            ) : cell.column.id === "editar" ? (
                                                                                <button onClick={() => handleEditPago(row)} className="botonEditar">
                                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                                </button>
                                                                            ) : (
                                                                                cell.render("Cell")
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="paginacion">
                                            <button onClick={() => pagosPreviousPage()} disabled={!pagosCanPreviousPage}>
                                                <FontAwesomeIcon icon={faArrowLeft} />
                                            </button>
                                            <span>
                                                Pagina{" "}
                                                <strong>
                                                    {pagosPageIndex + 1} de {pagosPageOptions.length}
                                                </strong>{" "}
                                            </span>
                                            <button onClick={() => pagosNextPage()} disabled={!pagosCanNextPage}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </button>
                                        </div>
                                    </>  
                                ) : (
                                    <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                        sans-serif`}}>
                                        No hay pagos para mostrar.
                                    </p>
                                )}
                            </>
                        </div>
                    </div>

                    <Button onClick={() => setIsPagoModalOpen(true)}  className="abajoDerecha" id="btnDescargarStock" style={{width: "145px", right: "180px"}}>Agregar Pago</Button>
                    <Button onClick={() => setIsImputacionModalOpen(true)}  className="abajoDerecha" id="btnDescargarStock" style={{width: "145px", right: "340px"}}>Imputar</Button>

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
                        />
                    )}
                    {isRemitoEditModalOpen && (
                        <ModalRemitoEditar
                            onClose={() => setIsRemitoEditModalOpen(false)}
                            onSave={handleEditRemito}
                            remitoEdit={remitoExiste}
                        />
                    )}
                    {isImputacionModalOpen && (
                        <ModalImputacion
                            pagos={pagos}
                            facturas={facturas}
                            onClose={() => setIsImputacionModalOpen(false)}
                            onSave={handleAddImputacion}
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
            
            <Button onClick={handleHistorial}  className="abajoDerecha" id="btnDescargarStock" style={{width: "145px"}}>Historial</Button>
        </>
    );
}

export default CuentaCorriente;
