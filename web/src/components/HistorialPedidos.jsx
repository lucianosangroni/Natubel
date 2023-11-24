 import React, { useMemo, useState } from "react";
 import { useTable,useGlobalFilter } from "react-table";
 import DATA_HISTORIAL from "../data/DATA_HISTORIAL.json";
 import { COLUMNSPEDIDOS } from "./columnsListaPedidos"
 import NavbarAdm from '../components/NavbarAdm';
 import GlobalFilter from "./GlobalFilter";

 const HistorialPedidos = () => {
   const columns = useMemo(() => COLUMNSPEDIDOS, []);
   const data = useMemo(() => DATA_HISTORIAL, [])

   const [selectedRow, setSelectedRow] = useState(null);

   const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter,state } = tableInstance
   const { globalFilter } = state;

   const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  return (
    <>
      <NavbarAdm />
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="tableDetailsContainer">
        <div className="tableDivContainerPedidos">
          <table {...getTableProps()} className="tableContainerPedidos">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    key={rowIndex}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(row)}
                    className={selectedRow === row ? "selected-row" : ""}
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
        <div className="detailsContainer">
          {selectedRow && (
            <div>
              <h3>Selected Row Details</h3>
              {columns.map((column) => (
                <p>
                  {column.Header}: {selectedRow.original.clienteProveedor}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorialPedidos;
