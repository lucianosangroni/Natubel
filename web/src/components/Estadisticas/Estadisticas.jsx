import Loading from "../Common/Loading";
import NavbarAdm from "../Common/NavbarAdm";
import { useMemo, useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { COLUMNSSTATS } from "./columnsEstadisticas";
import { useTable, useGlobalFilter, usePagination, useRowSelect} from "react-table";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import ModalPorcentajes from "./ModalPorcentajes";

const Estadisticas = () => {
    const { isInitialLoading, pedidosData, facturasData, remitosData, marcasData, articulosData, clientesData, porcentajesData } = useData()
    const [selectedMonthYear, setSelectedMonthYear] = useState("");
    const meses = [""/*Para que el índice 1 sea Enero*/,"Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const columns = useMemo(() => COLUMNSSTATS, []);
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const [selectedMarca, setSelectedMarca] = useState("mixto");
    const [pedidosPorMes, setPedidosPorMes] = useState({})
    const [opcionesMeses, setOpcionesMeses] = useState([])
    const [dataDistribuidor, setDataDistribuidor] = useState([])
    const [dataMayorista, setDataMayorista] = useState([])
    const [dataMinorista, setDataMinorista] = useState([])
    const [data5, setData5] = useState([])
    const [data10, setData10] = useState([])
    const [isModalPorcentajesOpen, setIsModalPorcentajesOpen] = useState(false)
    const [porcentajeMinorista ,setPorcentajeMinorista] = useState(0)
    const [porcentajeMayorista ,setPorcentajeMayorista] = useState(0)
    const [porcentajeDistribuidor ,setPorcentajeDistribuidor] = useState(0)
    const [porcentaje5 ,setPorcentaje5] = useState(0)
    const [porcentaje10 ,setPorcentaje10] = useState(0)
    const [gananciaMinoristaMixto, setGananciaMinoristaMixto] = useState(0)
    const [gananciaMayoristaMixto, setGananciaMayoristaMixto] = useState(0)
    const [gananciaDistribuidorMixto, setGananciaDistribuidorMixto] = useState(0)
    const [ganancia5Mixto, setGanancia5Mixto] = useState(0)
    const [ganancia10Mixto, setGanancia10Mixto] = useState(0)

    useEffect(() => {
        const grupos = {}

        pedidosData.forEach(pedido => {
            if(pedido.tipo === "PROVEEDOR" || pedido.estado === "CANCELADO"){}
            else {
                const [dia, mes, anio] = pedido.fecha.split("/");
                const clave = `${mes}/${anio}`;

                if (!grupos[clave]) {
                    grupos[clave] = [];
                }
                grupos[clave].push(pedido);
            }
        });

        const opciones = Object.keys(grupos).sort((a, b) => {
                const [mesA, anioA] = a.split("/").map(Number);
                const [mesB, anioB] = b.split("/").map(Number);
                return anioB - anioA || mesB - mesA;
            }).map((clave) => {
                const [mes, anio] = clave.split("/");
                const mesEnPalabras = meses[parseInt(mes, 10)];
                return { value: clave, label: `${mesEnPalabras} 20${anio}` };
            });

        setPedidosPorMes(grupos)
        setOpcionesMeses(opciones)
        setSelectedMonthYear(opciones[0]?.value)
    }, [pedidosData]);

    useEffect(() => {
        console.log("Remitos cargados:", remitosData.length);
        console.log("Facturas cargadas:", facturasData.length);

        if(Object.keys(pedidosPorMes).length > 0) {
            const pedidosFormateados = []

            for(const [clave, pedidos] of Object.entries(pedidosPorMes)) {
                for(const p of pedidos) {
                    const facturaCorrespondiente = facturasData.find(f => f.pedido_id === p.numero_pedido)
                    const remitoCorrespondiente = remitosData.find(r => r.pedido_id === p.numero_pedido)

                    let tipo_tabla = p.tipo_precio

                    if (tipo_tabla === "DISTRIBUIDOR" && remitoCorrespondiente) {
                        const descuento = parseInt(remitoCorrespondiente.descuento);
                        if (descuento === 5) {
                            tipo_tabla = "5%";
                        } else if (descuento === 10) {
                            tipo_tabla = "10%";
                        } else {
                            tipo_tabla = "DISTRIBUIDOR";
                        }
                    }

                    const cliente = clientesData.find(c => c.nombre === p.persona_nombre)

                    if(!p.tipo_precio) {
                        tipo_tabla = cliente.tipo_cliente
                    } 

                    let marcaIdFinal = null;

                    p.articulos.forEach((art, i) => {
                        const articuloCorrespondiente = articulosData.find(a => a.id === art.id)
                        const marcaId = String(articuloCorrespondiente?.marca_id);

                        if (i === 0) {
                            marcaIdFinal = marcaId;
                        } else {
                            if (marcaIdFinal !== marcaId) {
                                marcaIdFinal = "mixto";
                            }
                        }
                    })
                    
                    const precios_x_marca = {}

                    if (marcaIdFinal === "mixto") {
                        for(const prod of p.productos) {
                            const articuloCorrespondiente = articulosData.find(a => a.id === prod.articulo_id)
                            const marcaId = String(articuloCorrespondiente?.marca_id)

                            if (!precios_x_marca[marcaId]) {
                                precios_x_marca[marcaId] = 0;
                            }

                            const precioTotalDelArticulo = prod.productos_x_pedido.cantidad * prod.productos_x_pedido.precio_unitario
                            precios_x_marca[marcaId] += precioTotalDelArticulo;
                        }
                    }

                    const pedidoFormateado = {
                        numero_pedido: <span
                                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                            onClick={() => handleVerPedido(p.numero_pedido)}
                                        >
                                            {p.numero_pedido}
                                        </span>,
                        numero_remito: remitoCorrespondiente? remitoCorrespondiente.numero_remito : "-",
                        cliente: p.persona_nombre,
                        fecha: p.fecha,
                        monto: facturaCorrespondiente? facturaCorrespondiente.monto : 0,
                        tipo_tabla: tipo_tabla,
                        marca: marcaIdFinal,
                        precios_x_marca,
                        grupo: clave
                    }

                    pedidosFormateados.push(pedidoFormateado)
                }
                
            }

            setData(pedidosFormateados)
        }
    }, [pedidosPorMes, facturasData, remitosData, articulosData, clientesData]);

    useEffect(() => {
        if(data.length > 0) {
            const dataActual = data.filter(p => p.marca === selectedMarca && p.grupo === selectedMonthYear)

            const dataMinorista = dataActual.filter(p => p.tipo_tabla === "MINORISTA")
            const dataMayorista = dataActual.filter(p => p.tipo_tabla === "MAYORISTA")
            const dataDistribuidor = dataActual.filter(p => p.tipo_tabla === "DISTRIBUIDOR")
            const data5 = dataActual.filter(p => p.tipo_tabla === "5%")
            const data10 = dataActual.filter(p => p.tipo_tabla === "10%")
            setDataDistribuidor(dataDistribuidor);
            setDataMayorista(dataMayorista)
            setDataMinorista(dataMinorista)
            setData5(data5)
            setData10(data10)

            if (selectedMarca !== "mixto") {
                const porcMin = porcentajesData?.[selectedMarca]?.minorista ?? 0;
                const porcMay = porcentajesData?.[selectedMarca]?.mayorista ?? 0;
                const porcDist = porcentajesData?.[selectedMarca]?.distribuidor ?? 0;
                const porc5 = porcentajesData?.[selectedMarca]?.cinco ?? 0;
                const porc10 = porcentajesData?.[selectedMarca]?.diez ?? 0;
                setPorcentajeMinorista(porcMin)
                setPorcentajeMayorista(porcMay)
                setPorcentajeDistribuidor(porcDist)
                setPorcentaje5(porc5)
                setPorcentaje10(porc10)
            } else {
                let gananciaMinorista = 0;
                let gananciaMayorista = 0;
                let gananciaDistribuidor = 0;
                let ganancia5 = 0;
                let ganancia10 = 0;

                for (const pedido of dataMinorista) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaMinorista += subtotal * (porcentajesData?.[marcaId]?.minorista ?? 0) / 100;
                    }
                }

                for (const pedido of dataMayorista) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaMayorista += subtotal * (porcentajesData?.[marcaId]?.mayorista ?? 0) / 100;
                    }
                }

                for (const pedido of dataDistribuidor) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaDistribuidor += subtotal * (porcentajesData?.[marcaId]?.distribuidor ?? 0) / 100;
                    }
                }

                for (const pedido of data5) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        ganancia5 += subtotal * (porcentajesData?.[marcaId]?.cinco ?? 0) / 100;
                    }
                }

                for (const pedido of data10) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        ganancia10 += subtotal * (porcentajesData?.[marcaId]?.diez ?? 0) / 100;
                    }
                }
            
                setGananciaMinoristaMixto(gananciaMinorista);
                setGananciaMayoristaMixto(gananciaMayorista);
                setGananciaDistribuidorMixto(gananciaDistribuidor);
                setGanancia5Mixto(ganancia5);
                setGanancia10Mixto(ganancia10);
            }
        }
    }, [selectedMonthYear, selectedMarca, data]);

    const handleVerPedido = (pedidoId) => {
        navigate(`/admin/pedidos?selected=${pedidoId}`);
    }

    const {
        getTableProps: getTablePropsMin,
        getTableBodyProps: getTableBodyPropsMin,
        headerGroups: headerGroupsMin,
        page: pageMin,
        nextPage: nextPageMin,
        previousPage: previousPageMin,
        canNextPage: canNextPageMin,
        canPreviousPage: canPreviousPageMin,
        pageOptions: pageOptionsMin,
        prepareRow: prepareRowMin,
        state: stateMin,
    } = useTable(
        {
            columns,
            data: dataMinorista,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndexMin } = stateMin;

    const {
        getTableProps: getTablePropsMay,
        getTableBodyProps: getTableBodyPropsMay,
        headerGroups: headerGroupsMay,
        page: pageMay,
        nextPage: nextPageMay,
        previousPage: previousPageMay,
        canNextPage: canNextPageMay,
        canPreviousPage: canPreviousPageMay,
        pageOptions: pageOptionsMay,
        prepareRow: prepareRowMay,
        state: stateMay,
    } = useTable(
        {
            columns,
            data: dataMayorista,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndexMay } = stateMay;

    const {
        getTableProps: getTablePropsDist,
        getTableBodyProps: getTableBodyPropsDist,
        headerGroups: headerGroupsDist,
        page: pageDist,
        nextPage: nextPageDist,
        previousPage: previousPageDist,
        canNextPage: canNextPageDist,
        canPreviousPage: canPreviousPageDist,
        pageOptions: pageOptionsDist,
        prepareRow: prepareRowDist,
        state: stateDist,
    } = useTable(
        {
            columns,
            data: dataDistribuidor,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndexDist } = stateDist;

    const {
        getTableProps: getTableProps5,
        getTableBodyProps: getTableBodyProps5,
        headerGroups: headerGroups5,
        page: page5,
        nextPage: nextPage5,
        previousPage: previousPage5,
        canNextPage: canNextPage5,
        canPreviousPage: canPreviousPage5,
        pageOptions: pageOptions5,
        prepareRow: prepareRow5,
        state: state5,
    } = useTable(
        {
            columns,
            data: data5,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndex5 } = state5;

    const {
        getTableProps: getTableProps10,
        getTableBodyProps: getTableBodyProps10,
        headerGroups: headerGroups10,
        page: page10,
        nextPage: nextPage10,
        previousPage: previousPage10,
        canNextPage: canNextPage10,
        canPreviousPage: canPreviousPage10,
        pageOptions: pageOptions10,
        prepareRow: prepareRow10,
        state: state10,
    } = useTable(
        {
            columns,
            data: data10,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndex10 } = state10;

    const handleChangeMarca = (marcaId) => {
        setSelectedMarca(marcaId);
    }

    const formatearNumero = (numero) => {
        if (typeof numero === 'number') {
            const [entero, decimal] = numero.toFixed(2).toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    return (
        <>
            {(isInitialLoading) && <Loading/>}
            <NavbarAdm selected={'Estadisticas'}/>
            <div style={{marginTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                {opcionesMeses.length > 0 && (
                    <select
                        value={selectedMonthYear}
                        onChange={(e) => setSelectedMonthYear(e.target.value)}
                    >
                        {opcionesMeses.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                )}
                
                <select value={selectedMarca} onChange={(e) => handleChangeMarca(e.target.value)}>
                    <option value="mixto">Mixto</option>
                    {marcasData.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                            {marca.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>

            <div style={{display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: "7px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                    <span style={{ fontWeight: "bold" }}>TOTAL MINORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(dataMinorista.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL MAYORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(dataMayorista.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL DISTRIBUIDOR: <span style={{fontWeight: "normal"}}>${formatearNumero(dataDistribuidor.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(data5.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(data10.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                </div>
                {selectedMarca !== "mixto" ? (
                    <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                        <span style={{ fontWeight: "bold" }}>GANANCIA MINORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(dataMinorista.reduce((acc, pedido) => acc + pedido.monto, 0) * porcentajeMinorista / 100)} ({porcentajeMinorista}%)</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA MAYORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(dataMayorista.reduce((acc, pedido) => acc + pedido.monto, 0) * porcentajeMayorista / 100)} ({porcentajeMayorista}%)</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA DISTRIBUIDOR: <span style={{fontWeight: "normal"}}>${formatearNumero(dataDistribuidor.reduce((acc, pedido) => acc + pedido.monto, 0) * porcentajeDistribuidor / 100)} ({porcentajeDistribuidor}%)</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(data5.reduce((acc, pedido) => acc + pedido.monto, 0) * porcentaje5 / 100)} ({porcentaje5}%)</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(data10.reduce((acc, pedido) => acc + pedido.monto, 0) * porcentaje10 / 100)} ({porcentaje10}%)</span></span>
                    </div>
                ) : (
                    <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                        <span style={{ fontWeight: "bold" }}>GANANCIA MINORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMinoristaMixto)}</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA MAYORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMayoristaMixto)}</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA DISTRIBUIDOR: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaDistribuidorMixto)}</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia5Mixto)}</span></span>
                        <span style={{ fontWeight: "bold" }}>GANANCIA 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia10Mixto)}</span></span>
                    </div>
                )}
            </div>

            {dataMinorista.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Minorista</h2>
                <div className="tableDivContainer">
                    <table {...getTablePropsMin()} className="tableContainer">
                        <thead>
                            {headerGroupsMin.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyPropsMin()}>
                            {pageMin.map((row) => {
                                prepareRowMin(row);
                                return (
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
                    <button onClick={() => previousPageMin()} disabled={!canPreviousPageMin}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndexMin + 1} de {pageOptionsMin.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPageMin()} disabled={!canNextPageMin}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </>
            )}
            
            {dataMayorista.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Mayorista</h2>
                <div className="tableDivContainer">
                    <table {...getTablePropsMay()} className="tableContainer">
                        <thead>
                            {headerGroupsMay.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyPropsMay()}>
                            {pageMay.map((row) => {
                                prepareRowMay(row);
                                return (
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
                    <button onClick={() => previousPageMay()} disabled={!canPreviousPageMay}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndexMay + 1} de {pageOptionsMay.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPageMay()} disabled={!canNextPageMay}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </>
            )}
            {dataDistribuidor.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>Distribuidor</h2>
                <div className="tableDivContainer">
                    <table {...getTablePropsDist()} className="tableContainer">
                        <thead>
                            {headerGroupsDist.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyPropsDist()}>
                            {pageDist.map((row) => {
                                prepareRowDist(row);
                                return (
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
                    <button onClick={() => previousPageDist()} disabled={!canPreviousPageDist}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndexDist + 1} de {pageOptionsDist.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPageDist()} disabled={!canNextPageDist}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </>
            )}
            {data5.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>5%</h2>
                <div className="tableDivContainer">
                    <table {...getTableProps5()} className="tableContainer">
                        <thead>
                            {headerGroups5.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps5()}>
                            {page5.map((row) => {
                                prepareRow5(row);
                                return (
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
                    <button onClick={() => previousPage5()} disabled={!canPreviousPage5}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndex5 + 1} de {pageOptions5.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPage5()} disabled={!canNextPage5}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </>
            )}
            {data10.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>10%</h2>
                <div className="tableDivContainer">
                    <table {...getTableProps10()} className="tableContainer">
                        <thead>
                            {headerGroups10.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps10()}>
                            {page10.map((row) => {
                                prepareRow10(row);
                                return (
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
                    <button onClick={() => previousPage10()} disabled={!canPreviousPage10}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndex10 + 1} de {pageOptions10.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPage10()} disabled={!canNextPage10}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </>
            )}
            <Button onClick={() => setIsModalPorcentajesOpen(true)} id="btnDescargarStock" style={{right: "10px", width: "145px"}}>Porcentajes</Button>
            {isModalPorcentajesOpen && (
                <ModalPorcentajes
                    onClose={() => setIsModalPorcentajesOpen(false)}
                />
            )}
        </>
    );
};

export default Estadisticas;