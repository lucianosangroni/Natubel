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
    console.log(newClient);
    setData((prevData) => [...prevData, newClient]);
  };

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

  const handleEditRow = (dato) => {
    setEditingData(dato);
    setIsEditModalOpen(true);
    // let contador = 0;
    // let arreglo = [...data];
    // arreglo.map((registro) => {
    //   if (dato.id == registro.id) {
    //     arreglo[contador].nombreCompleto = dato.nombreCompleto;
    //     arreglo[contador].cuitcuil = dato.cuitcuil;
    //     arreglo[contador].direccion = dato.direccion;
    //     arreglo[contador].cp = dato.cp;
    //     arreglo[contador].telefono = dato.telefono;
    //     arreglo[contador].dni = dato.dni;
    //     arreglo[contador].ciudadprovincia = dato.ciudadprovincia;
    //     arreglo[contador].envio = dato.envio;
    //     arreglo[contador].email = dato.email;
    //     arreglo[contador].tipo = dato.tipo;
    //   }
    //   return registro;
    // });
    // setData(arreglo);
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
                      ) : // {isEditModalOpen && (
                      //   <ModalClienteEditar
                      //     data={editingData}
                      //     onClose={() => setIsEditModalOpen(false)}
                      //     onSave={(editedData) => {
                      //       // Aquí puedes guardar los datos editados en tu estado de datos o realizar cualquier otra acción necesaria.
                      //       // Por ejemplo, puedes llamar a una función para actualizar los datos en el estado.
                      //       // handleSaveEditedData(editedData);
                      //       // Cierra el modal de edición.
                      //       setIsEditModalOpen(false);
                      //     }}
                      //   />
                      //   })

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
