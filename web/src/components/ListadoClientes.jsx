import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import { COLUMNS } from "./columnsListaClientes";
import GlobalFilter from "./GlobalFilter";
import ModalCliente from "./ModalCliente";
import ModalClienteEditar from "./ModalClienteEditar";

const ListadoClientes = () => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  //OBTENER PROVEEDORES DB
  useEffect(() => {
    fetch(`http://localhost:3001/api/clientes`)
      .then((response) => response.json())
      .then((result) => {
        const clientes = []
        for (const dataResult of result) {
          const cliente = 
          {
            id: dataResult.id,
            persona_id: dataResult.persona_id,
            nombre: dataResult.persona.nombre,
            cuit_cuil: dataResult.cuit_cuil,
            direccion: dataResult.persona.direccion,
            codigo_postal: dataResult.codigo_postal,
            telefono: dataResult.persona.telefono,
            dni: dataResult.dni,
            ciudad: dataResult.ciudad,
            provincia: dataResult.provincia,
            forma_de_envio: dataResult.forma_de_envio,
            email: dataResult.persona.email,
            tipo_cliente: dataResult.tipo_cliente,
          }

          clientes.push(cliente)
        }

        setData(clientes)
      })
      .catch((error) => {
        console.error("Error en la solicitud GET:", error)
      });
  }, []);

  //AGREGAR PROVEEDOR DB
  const handleAddCliente = (newCliente) => {
    const requestData = 
    {
      nombre: newCliente.nombre,
      cuit_cuil: newCliente.cuit_cuil,
      direccion: newCliente.direccion,
      codigo_postal: newCliente.codigo_postal,
      telefono: newCliente.telefono,
      dni: newCliente.dni,
      ciudad: newCliente.ciudad,
      provincia: newCliente.provincia,
      forma_de_envio: newCliente.forma_de_envio,
      email: newCliente.email,
      tipo_cliente: newCliente.tipo_cliente
    }

    fetch(`http://localhost:3001/api/clientes`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      newCliente.id = result.id
      newCliente.persona_id = result.persona_id
      console.log(newCliente)
      setData((prevData) => [...prevData, newCliente]);
    })
    .catch(error => {
        console.error("Error en la solicitud POST:", error);
    });
  };

  //ABRIR MODAL EDITAR
  const handleEditRow = (row) => {
    const editData = row.original
    editData.index = row.index
    setEditingData(editData);
    setIsEditModalOpen(true);
  };

  //EDITAR PROVEEDOR DB
  const updateTableRow = (newData) => {
    console.log(newData)
    const requestData = 
    {
      nombre: newData.nombre,
      cuit_cuil: newData.cuit_cuil,
      direccion: newData.direccion,
      codigo_postal: newData.codigo_postal,
      telefono: newData.telefono,
      dni: newData.dni,
      ciudad: newData.ciudad,
      provincia: newData.provincia,
      forma_de_envio: newData.forma_de_envio,
      email: newData.email,
      tipo_cliente: newData.tipo_cliente,
      persona_id: newData.persona_id
    }
    
    fetch(`http://localhost:3001/api/clientes/${newData.id}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(() => {
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[newData.index] = newData;
        return updatedData;
      });
    })
    .catch(error => {
        console.error("Error en la solicitud PUT:", error);
    });
  };

  //ELIMINAR PROVEEDOR DB
  const handleDeleteRow = (row) => {
    //TODO fetch delete
    const shouldDelete = window.confirm(
      "¿Estas seguro que deseas eliminar el cliente?"
    );
    if (shouldDelete) {
      fetch(`http://localhost:3001/api/clientes/${row.original.id}`, {
        method: "DELETE",
      })
      .then(() => {
        const rowIndex = data.indexOf(row.original);
        if (rowIndex > -1) {
          const newData = [...data];
          newData.splice(rowIndex, 1);
          setData(newData);
        }
      })
      .catch(error => {
          console.error("Error en la solicitud DELETE:", error);
      });
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
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination,
    useRowSelect
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
                      ) : cell.column.id === "editar" ? (
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
            updateTableRow(editedData)
            setIsEditModalOpen(false);
          }}
        />
      )}
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
      <ModalCliente onAddClient={handleAddCliente} />
    </>
  );
};

export default ListadoClientes;
