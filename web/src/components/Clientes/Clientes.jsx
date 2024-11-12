import React, { useMemo, useState, useEffect } from "react";
import NavbarAdm from '../Common/NavbarAdm';
import { useTable, useGlobalFilter, usePagination, useRowSelect } from "react-table";
import { COLUMNSCLIENTES } from "./columnsListaClientes";
import GlobalFilter from "../../helpers/GlobalFilter";
import ModalCliente from "./ModalCliente";
import ModalClienteEditar from "./ModalClienteEditar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { apiUrl, bearerToken } from "../../config/config";
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";

const ListadoClientes = () => {
  const { isInitialLoading, clientesData, refreshClientes } = useData()
  const columns = useMemo(() => COLUMNSCLIENTES, []);
  const [data, setData] = useState(clientesData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshNuevoCliente, setRefreshNuevoCliente] = useState(false);

  //OBTENER CLIENTES DB
  useEffect(() => {
    setData(clientesData)
  }, [clientesData]);

  //AGREGAR CLIENTE DB
  const handleAddCliente = (newCliente) => {
    setIsLoading(true)

    const requestData = 
    {
      nombre: newCliente.nombre,
      cuit_cuil: parseInt(newCliente.cuit_cuil),
      direccion: newCliente.direccion,
      codigo_postal: newCliente.codigo_postal,
      telefono: newCliente.telefono,
      dni: parseInt(newCliente.dni),
      ciudad: newCliente.ciudad,
      provincia: newCliente.provincia,
      tipo_envio: newCliente.tipo_envio,
      forma_de_envio: newCliente.forma_de_envio,
      email: newCliente.email,
      tipo_cliente: newCliente.tipo_cliente
    }

    fetch(`${apiUrl}/clientes`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al agregar cliente, verifique los datos ingresados")
        throw new Error("Error en la solicitud POST");
      }
      return response.json();
    })
    .then((result) => {
      if(result.message === "Cliente creado con éxito") {
        newCliente.id = result.id
        newCliente.persona_id = result.persona_id

        const dataActualizada = [...data, newCliente]
        setData(dataActualizada);
        refreshClientes(dataActualizada)
        setRefreshNuevoCliente(true)
      }

      alert(result.message)
      setIsLoading(false)
    })
    .catch(error => {
        setIsLoading(false)
        console.error("Error en la solicitud POST:", error);
    });
  };

  const handleClienteRefresheado = () => {
    setRefreshNuevoCliente(false)
  }

  //ABRIR MODAL EDITAR
  const handleEditRow = (row) => {
    const editData = row.original
    editData.index = row.index
    setEditingData(editData);
    setIsEditModalOpen(true);
  };

  //EDITAR CLIENTE DB
  const updateTableRow = (newData) => {
    setIsLoading(true)

    const requestData = 
    {
      nombre: newData.nombre,
      cuit_cuil: parseInt(newData.cuit_cuil),
      direccion: newData.direccion,
      codigo_postal: newData.codigo_postal,
      telefono: newData.telefono,
      dni: parseInt(newData.dni),
      ciudad: newData.ciudad,
      provincia: newData.provincia,
      tipo_envio: newData.tipo_envio,
      forma_de_envio: newData.forma_de_envio,
      email: newData.email,
      tipo_cliente: newData.tipo_cliente,
      persona_id: parseInt(newData.persona_id)
    }

    fetch(`${apiUrl}/clientes/${newData.id}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al editar cliente, verifique los datos ingresados")
        throw new Error("Error en la solicitud PUT");
      }
      return response.json();
    })
    .then(() => {
      const dataActualizada = [...data];
      dataActualizada[newData.index] = newData;

      setData(dataActualizada);
      refreshClientes(dataActualizada)

      setIsLoading(false)
    })
    .catch(error => {
        setIsLoading(false)
        console.error("Error en la solicitud PUT:", error);
    });
  };

  //ELIMINAR PROVEEDOR DB
  const handleDeleteRow = (row) => {
    const deleteData = row.original
    deleteData.index = row.index

    const shouldDelete = window.confirm(
      `¿Estas seguro que deseas eliminar al cliente ${deleteData.nombre}?`
    );
    if (shouldDelete) {
      setIsLoading(true)

      fetch(`${apiUrl}/clientes/${deleteData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al eliminar cliente, intente nuevamente")
          throw new Error("Error en la solicitud PUT");
        }
        return response.json();
      })
      .then((result) => {
        if(result.message === "Cliente eliminado con éxito") {
          const dataActualizada = [...data];
          dataActualizada.splice(deleteData.index, 1);
          setData(dataActualizada)
          refreshClientes(dataActualizada)
        }

        alert(result.message)
        setIsLoading(false)
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
      {(isLoading || isInitialLoading) && <Loading/>}
      <NavbarAdm selected={'Clientes'}/>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="tableDivContainer">
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
                          <button onClick={() => handleDeleteRow(row)} className="botonEliminar">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        ) : cell.column.id === "editar" ? (
                          <button onClick={() => handleEditRow(row)} className="botonEditar">
                            <FontAwesomeIcon icon={faEdit} />
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
      </div>
      <ModalCliente onAddClient={handleAddCliente} refreshCliente={refreshNuevoCliente} onClienteRefresheado={handleClienteRefresheado} />
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
    </>
  );
};

export default ListadoClientes;
