import React, { useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import MOCK_DATA from "../data/MOCK_DATA.json";
import { COLUMNS } from "./columnsListaClientes";
import GlobalFilter from "./GlobalFilter";
import ModalCliente from "./ModalCliente";
import ModalClienteEditar from "./ModalClienteEditar";

// import Checkbox from "./Checkbox";
// import ColumnFilter from "./ColumnFilter";

const ListadoClientes = () => {
  const columns = useMemo(() => COLUMNS, []);
  const initialData = useMemo(() => MOCK_DATA, []);
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleAddClient = (newClient) => {
    // Agregar el nuevo cliente a la tabla
    setData((prevData) => [...prevData, newClient]);
  };

  // Función para eliminar una fila
  const handleDeleteRow = (row) => {
    //TODO fetch delete
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

  const handleEditRow = (row) => {
    console.log(row)
    const editData = row.values
    editData.index = row.index
    setEditingData(editData);
    setIsEditModalOpen(true);
  };

  const updateTableRow = (index, newData) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
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
  } = useTable(
    {
      columns,
      data,
    },
    // useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => {
    //     return [
    //       {
    //         id: "selection",
    //         Header: ({ getToggleAllRowsSelectedProps }) => (
    //           <Checkbox {...getToggleAllRowsSelectedProps()} />
    //         ),
    //         Cell: ({ row }) => (
    //           <Checkbox {...row.getToggleRowSelectedProps()} />
    //         ),
    //       },
    //       ...columns,
    //     ];
    //   });
    // }
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
                <th {...columns.getHeaderProps(columns)}>
                  {columns.render("Header")}
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
                      ) : 
                      cell.column.id === "editar" ? (
                        <button
                          onClick={() => handleEditRow(row)}
                          className="botonEditar"
                        >
                          Editar
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
      {isEditModalOpen && (
        <ModalClienteEditar
          data={editingData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(editedData) => {
            updateTableRow(editedData.index, editedData)
            setIsEditModalOpen(false);
          }}
        />
      )}
      {/* ESTE CODIGO ME MUESTRA EN LA INTERFAZ DE USUARIO EL ARRAY QUE SELECCIONO CON LA CASILLA, NO SE COMO ESCONDERLO */}
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre> */}
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
      <ModalCliente onAddClient={handleAddClient} />
    </>
  );
};

export default ListadoClientes;
