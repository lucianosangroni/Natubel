import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useMemo, useState, useEffect } from "react";
import { COLUMNSHISTORIALCUENTACORRIENTE } from "./columnsHistorialCuentaCorriente";
import { COLUMNSHISTORIALPAGOS } from "./columnsHistorialPagos"
import { COLUMNSIMPUTACIONES } from "./columnsImputaciones"
import { COLUMNSFACTURASIMPUTACION } from "./columnsFacturasImputacion"
import { COLUMNSPAGOSIMPUTACION } from "./columnsPagosImputacion"
import { useTable, usePagination, useRowSelect } from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const HistorialCuentaCorriente = () => {
    const { email } = useParams();
    const { clientesData, proveedoresData, facturasData, remitosData, pagosData, imputacionesData } = useData()
    const [ persona, setPersona ] = useState(null);
    const [ facturas, setFacturas ] = useState([]);
    const columnsFacturas = useMemo(() => COLUMNSHISTORIALCUENTACORRIENTE, []);
    const columnsPagos = useMemo(() => COLUMNSHISTORIALPAGOS, []);
    const columnsImputaciones = useMemo(() => COLUMNSIMPUTACIONES, []);
    const columnsFacturasImputacion = useMemo(() => COLUMNSFACTURASIMPUTACION, []);
    const columnsPagosImputacion = useMemo(()=> COLUMNSPAGOSIMPUTACION, []);
    const [ facturasImputacion, setFacturasImputacion ] = useState([])
    const [ pagosImputacion, setPagosImputacion ] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowImputacion, setSelectedRowImputacion] = useState(null);
    const [remitoExiste, setRemitoExiste] = useState(null);
    const [flagCliente, setFlagCliente] = useState(false)
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
                    const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === factura.pedido_id);
                    return {
                        id: factura.id,
                        numero_pedido: factura.pedido_id,
                        numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                        flag_imputada: factura.flag_imputada,
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

            const pagosCorrespondientes = pagosData.filter(pago => pago.persona_id === personaId).filter(pago => pago.pago_padre_id === null)
                .sort((a, b) => a.id - b.id)
                .map((pago, index) => ({
                    id: pago.id,
                    numero_pago: index + 1,
                    flag_imputado: pago.flag_imputado,
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

            const imputacionesGroup = groupImputaciones(imputacionesData).filter(imputacion => {
                return facturasCorrespondientes.some(fac => fac.id === imputacion.facturas[0]);
            })

            const detailedImputaciones = imputacionesGroup
                .map((imputacion) => {
                    // Calcular facturas y pagos detallados
                    const facturas = imputacion.facturas.map((facturaId) => {
                        const factura = facturasData.find((f) => f.id === facturaId);

                        return { numero_pedido: factura?.pedido_id, monto: factura.monto }
                    })

                    const pagos = imputacion.pagos.map((pagoId) => {
                        const pago = pagosData.find((p) => p.id === pagoId);
                        let numero_pago = "Sobrante";
                        if (pago.pago_padre_id === null) {
                            numero_pago = pagosCorrespondientes.find(p => p.id === pagoId).numero_pago;
                        }

                        return { numero_pago: numero_pago, monto: pago.monto }
                    })

                    // Calcular montos
                    const montoFacturas = facturas.reduce((acc, factura) => acc + factura.monto, 0);
                    const montoPagos = pagos.reduce((acc, pago) => acc + pago.monto, 0);
                    const montoSobrante = montoPagos - montoFacturas;

                    return {
                        fecha: formatearFecha(imputacion.fecha), // Fecha de la imputación
                        facturas,
                        pagos,
                        montoImputacion: montoFacturas, // Suma de los montos de las facturas
                        montoSobrante, // Suma de los pagos menos el monto de las facturas
                    };
                })
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map((imputacion, index) => ({
                    ...imputacion,
                    numero_imputacion: index + 1, // Agregar el número de imputación
                }))
                .reverse()

            setImputaciones(detailedImputaciones)
            if(detailedImputaciones.length > 0) {
                setSelectedRowImputacion(detailedImputaciones[0])
                setFacturasImputacion(detailedImputaciones[0].facturas)
                setPagosImputacion(detailedImputaciones[0].pagos)
            }
        }
    }, [persona, facturasData, remitosData, pagosData]);   

    const groupImputaciones = (data) => {
        const imputaciones = [];
        const seen = new Set();

        data.forEach((record) => {
            const { factura_id, pago_id, createdAt } = record;
            
            if (!seen.has(`${factura_id}-${pago_id}`)) {
                // Buscar si ya existe una imputación que relacione estos datos
                let existing = imputaciones.find((imputacion) =>
                    imputacion.facturas.includes(factura_id) || imputacion.pagos.includes(pago_id)
                );

                if (!existing) {
                    // Crear nueva imputación
                    existing = { facturas: [], pagos: [], fecha: createdAt };
                    imputaciones.push(existing);
                }
            
                // Agregar datos únicos
                if (!existing.facturas.includes(factura_id)) {
                    existing.facturas.push(factura_id);
                }
                if (!existing.pagos.includes(pago_id)) {
                    existing.pagos.push(pago_id);
                }

                // Marcar como visto
                seen.add(`${factura_id}-${pago_id}`);
            }
        });

        return imputaciones;
    };

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

    const {
        getTableProps: getImputacionesTableProps,
        getTableBodyProps: getImputacionesTableBodyProps,
        headerGroups: imputacionesHeaderGroups,
        page: imputacionesPage,
        nextPage: imputacionesNextPage,
        previousPage: imputacionesPreviousPage,
        canNextPage: imputacionesCanNextPage,
        canPreviousPage: imputacionesCanPreviousPage,
        pageOptions: imputacionesPageOptions,
        prepareRow: prepareImputacionesRow,
        state: imputacionesState,
    } = useTable(
        {
            columns: columnsImputaciones,
            data: imputaciones,
        },
        usePagination,
        useRowSelect
    );

    const { pageIndex: imputacionesPageIndex } = imputacionesState;

    const {
        getTableProps: getFacturasImputacionTableProps,
        getTableBodyProps: getFacturasImputacionTableBodyProps,
        headerGroups: facturasImputacionHeaderGroups,
        page: facturasImputacionPage,
        nextPage: facturasImputacionNextPage,
        previousPage: facturasImputacionPreviousPage,
        canNextPage: facturasImputacionCanNextPage,
        canPreviousPage: facturasImputacionCanPreviousPage,
        pageOptions: facturasImputacionPageOptions,
        prepareRow: prepareFacturasImputacionRow,
        state: facturasImputacionState
    } = useTable(
        {
            columns: columnsFacturasImputacion,
            data: facturasImputacion,
        },
        usePagination
    );

    const { pageIndex: facturasImputacionPageIndex } = facturasImputacionState

    const {
        getTableProps: getPagosImputacionTableProps,
        getTableBodyProps: getPagosImputacionTableBodyProps,
        headerGroups: pagosImputacionHeaderGroups,
        page: pagosImputacionPage,
        nextPage: pagosImputacionNextPage,
        previousPage: pagosImputacionPreviousPage,
        canNextPage: pagosImputacionCanNextPage,
        canPreviousPage: pagosImputacionCanPreviousPage,
        pageOptions: pagosImputacionPageOptions,
        prepareRow: preparePagosImputacionRow,
        state: pagosImputacionState
    } = useTable(
        {
            columns: columnsPagosImputacion,
            data: pagosImputacion,
        },
        usePagination
    );

    const { pageIndex: pagosImputacionPageIndex } = pagosImputacionState


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

    const handleRowClickImputaciones = (row) => {
        setSelectedRowImputacion(row.original)
        setFacturasImputacion(row.original.facturas)
        setPagosImputacion(row.original.pagos)
    };

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

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${email}`);
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
                    {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL FACTURAS: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
                    {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL PAGOS: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                </div>
            </div>

            {facturas.length > 0 ? (
                <>
                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Facturas</h2>

                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                        <div style={{minHeight: "36rem", minWidth: "30%"}}>
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
                        </div>

                        <div style={{ minWidth: "20%",}}> 
                            {flagCliente && (
                                <h2 style={{marginTop: "1rem", marginBottom: "1rem", textAlign: "center", fontSize: "25px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>Remito de la Factura Seleccionada</h2>
                            )}

                            
                            {selectedRow && (
                                flagCliente && (
                                    <div style={{height: "8rem", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                        {remitoExiste ? (
                                            <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
                                                <span style={{ fontWeight: "bold" }}>Número de Remito: <span style={{fontWeight: "normal"}}>{remitoExiste.numero_remito}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Descuento: <span style={{fontWeight: "normal"}}>{remitoExiste.descuento}%</span></span>
                                                <span style={{ fontWeight: "bold" }}>Días de Vencimiento: <span style={{fontWeight: "normal"}}>{remitoExiste.dias_vencimiento}</span></span>
                                                <span style={{ fontWeight: "bold" }}>Cantidad de Cajas: <span style={{fontWeight: "normal"}}>{remitoExiste.cantidad_cajas}</span></span>
                                            </div>
                                        ) :(
                                            <h2 style={{marginTop: "2.5rem", textAlign: "center", fontSize: "15px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                                sans-serif`}}>No existe remito</h2>
                                        )}
                                    </div>
                                )
                            )}
                            {selectedRow && (
                                flagCliente ? (
                                    remitoExiste ? (
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <Button onClick={() => generarPdfRemito()} className="btnRemito" style={{width: "145px"}}>PDF Remito</Button>
                                        </div>
                                    ) : <></>
                                ) : <></>
                            )}
                        </div>
                    </div>

                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>Pagos</h2>

                    {pagos.length > 0 ? (
                        <>
                            <div style={{minHeight: "36rem", minWidth: "30%"}}>
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
                            </div>
                        </>  
                    ) : (
                        <p style={{marginTop: "5rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                            sans-serif`}}>
                            No hay pagos para mostrar.
                        </p>
                    )}

                    <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "20px 0"}}/>

                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>
                        Imputaciones
                    </h2>

                    {imputaciones.length > 0 ? (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <div style={{minWidth: "30%"}}>
                                <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "20px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                sans-serif`}}>
                                    Imputaciones
                                </h2>
                                
                                <div className="tableDivContainer">
                                    <table {...getImputacionesTableProps()} className="tableContainer">
                                        <thead>
                                            {imputacionesHeaderGroups.map((headerGroups) => (
                                                <tr {...headerGroups.getHeaderGroupProps()}>
                                                {headerGroups.headers.map((columns) => (
                                                    <th {...columns.getHeaderProps(columns)}>
                                                        {columns.render("Header")}
                                                    </th>
                                                ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getImputacionesTableBodyProps()}>
                                            {imputacionesPage.map((row, rowIndex) => {
                                                prepareImputacionesRow(row);
                                                return (
                                                    <tr 
                                                        key={rowIndex}
                                                        {...row.getRowProps()}
                                                        onClick={() => handleRowClickImputaciones(row)}
                                                        style={{
                                                            backgroundColor: selectedRowImputacion.numero_imputacion === row.original.numero_imputacion ? "#dcd9d9" : ""
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
                                    <button onClick={() => imputacionesPreviousPage()} disabled={!imputacionesCanPreviousPage}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </button>
                                    <span>
                                        Pagina{" "}
                                        <strong>
                                            {imputacionesPageIndex + 1} de {imputacionesPageOptions.length}
                                        </strong>{" "}
                                    </span>
                                    <button onClick={() => imputacionesNextPage()} disabled={!imputacionesCanNextPage}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>
                            </div>

                            {selectedRowImputacion && (
                                <div style={{minHeight: "42rem"}}>
                                    <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "20px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                    sans-serif`}}>
                                        Imputación Seleccionada
                                    </h2>

                                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                                        <div>
                                            <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "15px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                            sans-serif`}}>
                                                Facturas
                                            </h2>
                                            <div className="tableDivContainer">
                                                <table {...getFacturasImputacionTableProps()} className="tableContainer">
                                                    <thead>
                                                        {facturasImputacionHeaderGroups.map(headerGroup => (
                                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                                {headerGroup.headers.map(column => (
                                                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    <tbody {...getFacturasImputacionTableBodyProps()}>
                                                        {facturasImputacionPage.map(row => {
                                                            prepareFacturasImputacionRow(row);
                                                            return  (
                                                                <tr {...row.getRowProps()}>
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
                                                <button onClick={() => facturasImputacionPreviousPage()} disabled={!facturasImputacionCanPreviousPage}>
                                                    <FontAwesomeIcon icon={faArrowLeft} />
                                                </button>
                                                <span>
                                                    Pagina{" "}
                                                    <strong>
                                                        {facturasImputacionPageIndex + 1} de {facturasImputacionPageOptions.length}
                                                    </strong>{" "}
                                                </span>
                                                <button onClick={() => facturasImputacionNextPage()} disabled={!facturasImputacionCanNextPage}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "15px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                                                "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                                                sans-serif`}}>
                                                Pagos
                                            </h2>
                                            <div className="tableDivContainer">
                                                <table {...getPagosImputacionTableProps()} className="tableContainer">
                                                    <thead>
                                                        {pagosImputacionHeaderGroups.map(headerGroup => (
                                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                                {headerGroup.headers.map(column => (
                                                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    <tbody {...getPagosImputacionTableBodyProps()}>
                                                        {pagosImputacionPage.map(row => {
                                                            preparePagosImputacionRow(row);
                                                            return  (
                                                                <tr {...row.getRowProps()}>
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
                                                <button onClick={() => pagosImputacionPreviousPage()} disabled={!pagosImputacionCanPreviousPage}>
                                                    <FontAwesomeIcon icon={faArrowLeft} />
                                                </button>
                                                <span>
                                                    Pagina{" "}
                                                    <strong>
                                                        {pagosImputacionPageIndex + 1} de {pagosImputacionPageOptions.length}
                                                    </strong>{" "}
                                                </span>
                                                <button onClick={() => pagosImputacionNextPage()} disabled={!pagosImputacionCanNextPage}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
