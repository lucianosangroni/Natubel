import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import MOCK_DATA from "../data/MOCK_DATA.json";
import { COLUMNS } from "./columnsListaClientes";
import GlobalFilter from "./GlobalFilter";

const ListadoClientes = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()} className="tableContainer">
        <thead>
          {headerGroups.map((headerGroups) => (
            <tr {...headerGroups.getHeaderGroupProps()}>
              {headerGroups.headers.map((columns) => (
                <th {...columns.getHeaderProps(columns.getSortByToggleProps())}>
                  {columns.render("Header")}
                  <span>
                    {columns.isSorted ? (columns.isSortedDesc ? "🠻" : "🠹") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ListadoClientes;
