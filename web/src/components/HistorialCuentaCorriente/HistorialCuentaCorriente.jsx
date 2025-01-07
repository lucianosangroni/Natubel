import { useParams } from "react-router-dom";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useMemo, useState, useEffect } from "react";
import { COLUMNSHISTORIALCUENTACORRIENTE } from "./columnsHistorialCuentaCorriente";
import { COLUMNSHISTORIALPAGOS } from "./columnsHistorialPagos"
import { useTable, usePagination, useRowSelect } from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const HistorialCuentaCorriente = () => {
    const { email } = useParams();
    const { clientesData, proveedoresData, pedidosData, facturasData, remitosData, pagosData, imputacionesData } = useData()
    const [ persona, setPersona ] = useState(null);
    const [ facturas, setFacturas ] = useState([]);
    const columnsFacturas = useMemo(() => COLUMNSHISTORIALCUENTACORRIENTE, []);
    const columnsPagos = useMemo(() => COLUMNSHISTORIALPAGOS, []);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowImputacion, setSelectedRowImputacion] = useState(null);
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
            
            const facturasCorrespondientes = facturasData.filter(factura => pedidosCorrespondientes.find(pedido => pedido.numero_pedido === factura.pedido_id))
                .map(factura => {
                    const pedidoCorrespondiente = pedidosCorrespondientes.find(pedido => pedido.numero_pedido === factura.pedido_id);
                    const remitoCorrespondiente = remitosData.find(remito => remito.pedido_id === pedidoCorrespondiente.numero_pedido);
                    return {
                        id: factura.id,
                        numero_pedido: pedidoCorrespondiente.numero_pedido,
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

    const handleCuentaCorriente = () => {
        navigate(`/admin/cuenta-corriente/${email}`);
    }

    return (
        <>
            {isLoading && <Loading/>}
            <NavbarAdm/>
            {persona && (
                <h1 style={{marginTop: "2.5rem", marginBottom: "1rem", textAlign: "center", fontSize: "40px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                    sans-serif`}}>
                    Historial de {persona.nombre}
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
                                            <Button onClick={() => generarPdfRemito()} className="btnRemito" style={{width: "145px"}}>PDF Remito</Button>
                                        </div>
                                    ) : <></>
                                ) : <></>
                            )}
                        </div>

                        <div style={{width: "50%", marginTop: "2rem"}}>
                            <>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: ".6rem"}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "7px", width: "fit-content"}}>
                                        {totalPagadoFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL PAGADO: <span style={{fontWeight: "normal"}}>${formatearNumero(totalPagadoFactura)}</span></span>}
                                        {montoRestanteFactura != null && <span style={{ fontWeight: "bold" }}>TOTAL COMPRADO: <span style={{fontWeight: "normal"}}>${formatearNumero(montoRestanteFactura)}</span></span>}
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
