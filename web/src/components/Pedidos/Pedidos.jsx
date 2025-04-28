import React, { useMemo, useState, useEffect } from "react";
import { useTable,useGlobalFilter, usePagination } from "react-table";
import { COLUMNSPEDIDOS } from "./columnsListaPedidos"
import NavbarAdm from '../Common/NavbarAdm';
import GlobalFilter from "../../helpers/GlobalFilter";
import ListaProductosDePedido from "./ListaProductosDePedido";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";

const HistorialPedidos = () => {
  const { isInitialLoading, pedidosData, refreshPedidos, refreshPedidoCancelado } = useData()
  const columns = useMemo(() => COLUMNSPEDIDOS, []);
  const [data, setData] = useState(pedidosData);
  const [selectedRow, setSelectedRow] = useState(null);

   ////OBTENER PEDIDOS Y ARTICULOS DB
  useEffect(() => {
    if(data.length === 0) {
      setData(pedidosData)
      setSelectedRow(pedidosData[0])
    }
  }, [pedidosData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, setGlobalFilter,state, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions } = tableInstance
  const { globalFilter } = state;
  const { pageIndex } = state;

  const handleRowClick = (row) => {
    setSelectedRow(row.original);
  };

  const actualizarEstado = (pedido_id, nuevoEstado) => {
    const newData = data.map(pedido => {
      if (pedido.numero_pedido === pedido_id) {
        return { ...pedido, estado: nuevoEstado };
      }
      return pedido;
    });

    setData(newData);
    refreshPedidos(newData)
    setSelectedRow(newData[0])

    if(nuevoEstado === "CANCELADO") {
      refreshPedidoCancelado(pedido_id)
    }
  }

  const cargarMasPedidos = () => {
    setData(pedidosData)
    setSelectedRow(pedidosData[0])
  }

  return (
    <>
      {isInitialLoading && <Loading/>}
      <NavbarAdm selected={'Pedidos'}/>
      <div style={{marginTop: "5.5rem"}}>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <div className="tableDetailsContainer">
          <div className="tableDivContainerPedidos">
            <table {...getTableProps()} className="tableContainerPedidos">
              <thead>
                {headerGroups.map((headerGroup, index) => (
                  <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th key={column.numero_pedido} {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, rowIndex) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={rowIndex}
                      {...row.getRowProps()}
                      onClick={() => handleRowClick(row)}
                      className={selectedRow === row.original ? "selected-row" : ""}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td key={cellIndex} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
              
          <div className="paginacion">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span>
              Pagina{" "}
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>{" "}
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              className={"boton-pedidor pedidor-seleccionado"}
              onClick={() => cargarMasPedidos()}
            >
            Cargar Mas
            </button>
          </div>
              
            {selectedRow && (
              <ListaProductosDePedido
                pedido={selectedRow}
                onCambiarEstado={actualizarEstado}
                />
            )}
        </div>
      </div>
    </>
  );
};

export default HistorialPedidos;