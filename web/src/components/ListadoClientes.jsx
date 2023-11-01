import React, { useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import MOCK_DATA from "../data/MOCK_DATA.json";
import { COLUMNS } from "./columnsListaClientes";
import GlobalFilter from "./GlobalFilter";
import Checkbox from "./Checkbox";

// import ColumnFilter from "./ColumnFilter";

const ListadoClientes = () => {
  const columns = useMemo(() => COLUMNS, []);
  const initialData = useMemo(() => MOCK_DATA, []);
  const [data, setData] = useState(initialData);

  // Función para eliminar una fila
  const handleDeleteRow = (row) => {
    const shouldDelete = window.confirm(
      "¿Estas seguro que deseas eliminar el cliente?"
    );
    if (shouldDelete) {
      const rowIndex = data.indexOf(row.original);
      if (rowIndex > -1) {
        const newData = [...data];
        newData.splice(rowIndex, 1);
        setData(newData);
      }
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
    },
    // useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <Checkbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter } = state;
  const { pageIndex } = state;

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
                  {/* <div>
                    {columns.canFilter ? columns.render("Filter") : null}
                  </div> */}
                  <span>
                    {columns.isSorted ? (columns.isSortedDesc ? "🠻" : "🠹") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.column.id === "eliminar" ? (
                        <button
                          onClick={() => handleDeleteRow(row)}
                          className="botonEliminar"
                        >
                          Eliminar
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
      {/* ESTE CODIGO ME MUESTRA EN LA INTERFAZ DE USUARIO EL ARRAY QUE SELECCIONO CON LA CASILLA, NO SE COMO ESCONDERLO */}
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre>
      <div className="paginacion">
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>
      </div>
    </>
  );
};

export default ListadoClientes;
