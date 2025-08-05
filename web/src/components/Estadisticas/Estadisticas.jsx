import Loading from "../Common/Loading";
import NavbarAdm from "../Common/NavbarAdm";
import { useMemo, useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { COLUMNSSTATS } from "./columnsEstadisticas";
import { useTable, useGlobalFilter, usePagination, useRowSelect} from "react-table";
import { faArrowLeft, faArrowRight, faL } from '@fortawesome/free-solid-svg-icons';
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
    const [dataMinorista, setDataMinorista] = useState([])
    const [dataMayorista, setDataMayorista] = useState([])
    const [dataDistribuidor, setDataDistribuidor] = useState([])
    const [dataDeMarca, setDataDeMarca] = useState([])
    const [data5, setData5] = useState([])
    const [data10, setData10] = useState([])
    const [isModalPorcentajesOpen, setIsModalPorcentajesOpen] = useState(false)
    const [porcentajeMinorista ,setPorcentajeMinorista] = useState(0)
    const [porcentajeMayorista ,setPorcentajeMayorista] = useState(0)
    const [porcentajeDistribuidor ,setPorcentajeDistribuidor] = useState(0)
    const [porcentajeDeMarca, setPorcentajeDeMarca] = useState(0)
    const [porcentaje5 ,setPorcentaje5] = useState(0)
    const [porcentaje10 ,setPorcentaje10] = useState(0)
    const [gananciaMinorista, setGananciaMinorista] = useState(0)
    const [gananciaMayorista, setGananciaMayorista] = useState(0)
    const [gananciaDistribuidor, setGananciaDistribuidor] = useState(0)
    const [gananciaDeMarca, setGananciaDeMarca] = useState(0)
    const [ganancia5, setGanancia5] = useState(0)
    const [ganancia10, setGanancia10] = useState(0)
    const [gananciaTotal, setGananciaTotal] = useState(0)
    const [gananciaMinoristaMixto, setGananciaMinoristaMixto] = useState(0)
    const [gananciaMayoristaMixto, setGananciaMayoristaMixto] = useState(0)
    const [gananciaDistribuidorMixto, setGananciaDistribuidorMixto] = useState(0)
    const [gananciaDeMarcaMixto, setGananciaDeMarcaMixto] = useState(0)
    const [ganancia5Mixto, setGanancia5Mixto] = useState(0)
    const [ganancia10Mixto, setGanancia10Mixto] = useState(0)
    const [selectedMonthYearGananciaTotalInicial, setSelectedMonthYearGananciaTotalInicial] = useState("")
    const [selectedMonthYearGananciaTotalFinal, setSelectedMonthYearGananciaTotalFinal] = useState("")
    const [tipoGananciaTotal, setTipoGananciaTotal] = useState("Marca actual")
    const [flagGananciaInicial, setFlagGananciaInicial] = useState(false)

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
        setSelectedMonthYearGananciaTotalInicial(opciones[0]?.value)
        setSelectedMonthYearGananciaTotalFinal(opciones[0]?.value)
    }, [pedidosData]);

    useEffect(() => {
        if(Object.keys(pedidosPorMes).length > 0) {
            const pedidosFormateados = []

            for(const [clave, pedidos] of Object.entries(pedidosPorMes)) {
                for(const p of pedidos) {
                    const facturaCorrespondiente = facturasData.find(f => f.pedido_id === p.numero_pedido)
                    const remitoCorrespondiente = remitosData.find(r => r.pedido_id === p.numero_pedido)

                    let tipo_tabla = p.tipo_precio

                    if(p.flag_de_marca) tipo_tabla = "DE MARCA"

                    const cliente = clientesData.find(c => c.nombre === p.persona_nombre)

                    if(!p.tipo_precio && !p.flag_de_marca) {
                        tipo_tabla = cliente.tipo_cliente
                    } 

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
            const dataDeMarca = dataActual.filter(p => p.tipo_tabla === "DE MARCA")
            const data5 = dataActual.filter(p => p.tipo_tabla === "5%")
            const data10 = dataActual.filter(p => p.tipo_tabla === "10%")
            setDataDistribuidor(dataDistribuidor);
            setDataMayorista(dataMayorista)
            setDataMinorista(dataMinorista)
            setDataDeMarca(dataDeMarca)
            setData5(data5)
            setData10(data10)

            if (selectedMarca !== "mixto") {
                const porcMin = porcentajesData?.[selectedMarca]?.minorista ?? 0;
                const porcMay = porcentajesData?.[selectedMarca]?.mayorista ?? 0;
                const porcDist = porcentajesData?.[selectedMarca]?.distribuidor ?? 0;
                const porcDeMarca = porcentajesData?.[selectedMarca]?.deMarca ?? 0;
                const porc5 = porcentajesData?.[selectedMarca]?.cinco ?? 0;
                const porc10 = porcentajesData?.[selectedMarca]?.diez ?? 0;
                setPorcentajeMinorista(porcMin)
                setPorcentajeMayorista(porcMay)
                setPorcentajeDistribuidor(porcDist)
                setPorcentajeDeMarca(porcDeMarca)
                setPorcentaje5(porc5)
                setPorcentaje10(porc10)

                const gananciaMinorista = dataMinorista.reduce((acc, pedido) => acc + pedido.monto, 0) * porcMin / 100;
                const gananciaMayorista = dataMayorista.reduce((acc, pedido) => acc + pedido.monto, 0) * porcMay / 100;
                const gananciaDistribuidor = dataDistribuidor.reduce((acc, pedido) => acc + pedido.monto, 0) * porcDist / 100;
                const gananciaDeMarca = dataDeMarca.reduce((acc, pedido) => acc + pedido.monto, 0) * porcDeMarca / 100;
                const ganancia5 = data5.reduce((acc, pedido) => acc + pedido.monto, 0) * porc5 / 100;
                const ganancia10 = data10.reduce((acc, pedido) => acc + pedido.monto, 0) * porc10 / 100;

                setGananciaMinorista(gananciaMinorista)
                setGananciaMayorista(gananciaMayorista)
                setGananciaDistribuidor(gananciaDistribuidor)
                setGananciaDeMarca(gananciaDeMarca)
                setGanancia5(ganancia5)
                setGanancia10(ganancia10)

                if(!flagGananciaInicial) {
                    const gananciaTotalInicial = gananciaMinorista + gananciaMayorista + gananciaDistribuidor + gananciaDeMarca + ganancia5 + ganancia10
                    setGananciaTotal(gananciaTotalInicial)
                    setFlagGananciaInicial(true)
                }
            } else {
                let gananciaMinoristaM = 0;
                let gananciaMayoristaM = 0;
                let gananciaDistribuidorM = 0;
                const gananciaDeMarcaM = 0;
                let ganancia5M = 0;
                let ganancia10M = 0;

                for (const pedido of dataMinorista) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaMinoristaM += subtotal * (porcentajesData?.[marcaId]?.minorista ?? 0) / 100;
                    }
                }

                for (const pedido of dataMayorista) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaMayoristaM += subtotal * (porcentajesData?.[marcaId]?.mayorista ?? 0) / 100;
                    }
                }

                for (const pedido of dataDistribuidor) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        gananciaDistribuidorM += subtotal * (porcentajesData?.[marcaId]?.distribuidor ?? 0) / 100;
                    }
                }

                for (const pedido of data5) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        ganancia5M += subtotal * (porcentajesData?.[marcaId]?.cinco ?? 0) / 100;
                    }
                }

                for (const pedido of data10) {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        ganancia10M += subtotal * (porcentajesData?.[marcaId]?.diez ?? 0) / 100;
                    }
                }

                setGananciaMinoristaMixto(gananciaMinoristaM);
                setGananciaMayoristaMixto(gananciaMayoristaM);
                setGananciaDistribuidorMixto(gananciaDistribuidorM);
                setGananciaDeMarcaMixto(gananciaDeMarcaM)
                setGanancia5Mixto(ganancia5M);
                setGanancia10Mixto(ganancia10M);

                if(!flagGananciaInicial) {
                    const gananciaTotalInicial = gananciaMinoristaM + gananciaMayoristaM + gananciaDistribuidorM + gananciaDeMarcaM + ganancia5M + ganancia10M
                    setGananciaTotal(gananciaTotalInicial)
                    setFlagGananciaInicial(true)
                }
            }
        }
    }, [selectedMonthYear, selectedMarca, data]);

    useEffect(() => {
        if (!selectedMonthYearGananciaTotalInicial || !selectedMonthYearGananciaTotalFinal || data.length === 0) return;

        const [mesInicio, anioInicio] = selectedMonthYearGananciaTotalInicial.split("/").map(Number);
        const [mesFin, anioFin] = selectedMonthYearGananciaTotalFinal.split("/").map(Number);

        const enRango = (mes, anio) => {
            const desde = anioInicio * 100 + mesInicio;
            const hasta = anioFin * 100 + mesFin;
            const actual = anio * 100 + mes;
            return actual >= desde && actual <= hasta;
        }

        const dataEnRango = data.filter(p => {
            const [mes, anio] = p.grupo.split("/").map(Number);
            return enRango(mes, anio);
        });

        let total = 0;

        const calcularGanancia = (pedidos, tipo) => {
            return pedidos.reduce((acc, pedido) => {
                if (pedido.marca === "mixto") {
                    for (const [marcaId, subtotal] of Object.entries(pedido.precios_x_marca)) {
                        const porcentaje = porcentajesData?.[marcaId]?.[tipo] ?? 0;
                        acc += subtotal * porcentaje / 100;
                    }
                } else {
                    const porcentaje = porcentajesData?.[pedido.marca]?.[tipo] ?? 0;
                    acc += pedido.monto * porcentaje / 100;
                }
                return acc;
            }, 0);
        }

        const tipos = ["minorista", "mayorista", "distribuidor", "deMarca", "cinco", "diez"];
        const etiquetas = {
            minorista: "MINORISTA",
            mayorista: "MAYORISTA",
            distribuidor: "DISTRIBUIDOR",
            deMarca: "DE MARCA",
            cinco: "5%",
            diez: "10%"
        };

        for (const tipo of tipos) {
            const pedidosTipo = dataEnRango.filter(p => p.tipo_tabla === etiquetas[tipo]);

            if (tipoGananciaTotal === "Marca actual") {
                if (selectedMarca === "mixto") {
                    // Acumulamos por marca en cada pedido mixto
                    const pedidosMixto = pedidosTipo.filter(p => p.marca === "mixto")
                    total += calcularGanancia(pedidosMixto, tipo);
                } else {
                    // Solo sumamos los pedidos de la marca seleccionada
                    const pedidosMarca = pedidosTipo.filter(p => p.marca === selectedMarca);
                    total += calcularGanancia(pedidosMarca, tipo);
                }
            } else if (tipoGananciaTotal === "Todas las marcas") {
                // Siempre acumulamos todos los pedidos, por marca en cada caso
                total += calcularGanancia(pedidosTipo, tipo);
            }
        }

        setGananciaTotal(total);
    }, [selectedMonthYearGananciaTotalInicial, selectedMonthYearGananciaTotalFinal, tipoGananciaTotal, selectedMarca, data]);

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
        getTableProps: getTablePropsDeMarca,
        getTableBodyProps: getTableBodyPropsDeMarca,
        headerGroups: headerGroupsDeMarca,
        page: pageDeMarca,
        nextPage: nextPageDeMarca,
        previousPage: previousPageDeMarca,
        canNextPage: canNextPageDeMarca,
        canPreviousPage: canPreviousPageDeMarca,
        pageOptions: pageOptionsDeMarca,
        prepareRow: prepareRowDeMarca,
        state: stateDeMarca,
    } = useTable(
        {
            columns,
            data: dataDeMarca,
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );
    const { pageIndex: pageIndexDeMarca } = stateDeMarca;

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
                    <span style={{ fontWeight: "bold" }}>TOTAL DE MARCA: <span style={{fontWeight: "normal"}}>${formatearNumero(dataDeMarca.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(data5.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold" }}>TOTAL 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(data10.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                    <span style={{ fontWeight: "bold", marginLeft: "10px" }}>SUBTOTAL: <span style={{fontWeight: "normal"}}>${formatearNumero(dataMinorista.reduce((acc, pedido) => acc + pedido.monto, 0) + dataMayorista.reduce((acc, pedido) => acc + pedido.monto, 0) + dataDistribuidor.reduce((acc, pedido) => acc + pedido.monto, 0) + dataDeMarca.reduce((acc, pedido) => acc + pedido.monto, 0) + data5.reduce((acc, pedido) => acc + pedido.monto, 0) + data10.reduce((acc, pedido) => acc + pedido.monto, 0))}</span></span>
                </div>
                {selectedMarca !== "mixto" ? (
                    <>
                        <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                            <span style={{ fontWeight: "bold" }}>GANANCIA MINORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMinorista)} ({porcentajeMinorista}%)</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA MAYORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMayorista)} ({porcentajeMayorista}%)</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA DISTRIBUIDOR: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaDistribuidor)} ({porcentajeDistribuidor}%)</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA DE MARCA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaDeMarca)} ({porcentajeDeMarca}%)</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia5)} ({porcentaje5}%)</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia10)} ({porcentaje10}%)</span></span>
                            <span style={{ fontWeight: "bold", marginLeft: "10px" }}>SUBTOTAL: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMinorista + gananciaMayorista + gananciaDistribuidor + gananciaDeMarca + ganancia5 + ganancia10)}</span></span>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                            <span style={{ fontWeight: "bold" }}>GANANCIA MINORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMinoristaMixto)}</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA MAYORISTA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMayoristaMixto)}</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA DISTRIBUIDOR: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaDistribuidorMixto)}</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA DE MARCA: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaDeMarcaMixto)}</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA 5%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia5Mixto)}</span></span>
                            <span style={{ fontWeight: "bold" }}>GANANCIA 10%: <span style={{fontWeight: "normal"}}>${formatearNumero(ganancia10Mixto)}</span></span>
                            <span style={{ fontWeight: "bold", marginLeft: "10px" }}>SUBTOTAL: <span style={{fontWeight: "normal"}}>${formatearNumero(gananciaMinoristaMixto + gananciaMayoristaMixto + gananciaDistribuidorMixto + ganancia5Mixto + ganancia10Mixto)}</span></span>
                        </div>
                    </>
                )}
                <div style={{display: "flex", flexDirection: "column", gap: "7px", alignItems: "center"}}>
                    <span style={{ fontWeight: "bold" }}>GANANCIA TOTAL</span>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                        <span style={{ fontWeight: "bold" }}>desde</span>
                        <select
                            value={selectedMonthYearGananciaTotalInicial}
                            onChange={(e) => setSelectedMonthYearGananciaTotalInicial(e.target.value)}
                        >
                            {opcionesMeses.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                        <span style={{ fontWeight: "bold" }}>hasta</span>
                        <select
                            value={selectedMonthYearGananciaTotalFinal}
                            onChange={(e) => setSelectedMonthYearGananciaTotalFinal(e.target.value)}
                        >
                            {opcionesMeses.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                        <span style={{ fontWeight: "bold" }}>para</span>
                        <select
                            value={tipoGananciaTotal}
                            onChange={(e) => setTipoGananciaTotal(e.target.value)}
                        >
                            <option key={"Marca actual"} value={"Marca actual"}>
                                la Marca Actual
                            </option>
                            <option key={"Todas las marcas"} value={"Todas las marcas"}>
                                Todas las Marcas
                            </option>
                        </select>
                    </div>
                    <span style={{ fontWeight: "normal" }}>${formatearNumero(gananciaTotal)}</span>
                </div>
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
            {dataDeMarca.length > 0 && (
            <>
                <hr style={{border: "none", height: "1px", backgroundColor: "gray", margin: "10px 0"}}/>
                <h2 style={{marginBottom: "0", textAlign: "center", fontSize: "30px", fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
                        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
                        sans-serif`}}>De Marca</h2>
                <div className="tableDivContainer">
                    <table {...getTablePropsDeMarca()} className="tableContainer">
                        <thead>
                            {headerGroupsDeMarca.map((headerGroups) => (
                                <tr {...headerGroups.getHeaderGroupProps()}>
                                    {headerGroups.headers.map((columns) => (
                                        <th {...columns.getHeaderProps(columns)}>
                                            {columns.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyPropsDeMarca()}>
                            {pageDeMarca.map((row) => {
                                prepareRowDeMarca(row);
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
                    <button onClick={() => previousPageDeMarca()} disabled={!canPreviousPageDeMarca}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span>
                        Pagina{" "}
                        <strong>
                            {pageIndexDeMarca + 1} de {pageOptionsDeMarca.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPageDeMarca()} disabled={!canNextPageDeMarca}>
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