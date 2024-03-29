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

const ListadoClientes = () => {
  const columns = useMemo(() => COLUMNSCLIENTES, []);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  //OBTENER CLIENTES DB
  useEffect(() => {
    fetch(`${apiUrl}/clientes`, 
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al buscar los datos, intente nuevamente")
        throw new Error("Error en la solicitud GET");
      }
      return response.json();
    })
    .then((result) => {
      const clientes = []
      for (const dataResult of result) {
        const cliente = 
        {
          id: dataResult.id,
          persona_id: dataResult.persona_id,
          nombre: dataResult.persona.nombre,
          cuit_cuil: dataResult.persona.cuit_cuil,
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

  //AGREGAR CLIENTE DB
  const handleAddCliente = (newCliente) => {
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
      newCliente.id = result.id
      newCliente.persona_id = result.persona_id
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
    //const shouldDelete = window.confirm(
    //  "¿Estas seguro que deseas eliminar el cliente?"
    //);
    //if (shouldDelete) {
    //  fetch(`${apiUrl}/clientes/${row.original.id}`, {
    //    method: "DELETE",
    //    headers: {
    //      Authorization: `Bearer ${bearerToken}`
    //    }
    //  })
    //  .then((response) => {
    //    if (!response.ok) {
    //      alert("Error al eliminar cliente, intente nuevamente")
    //      throw new Error("Error en la solicitud PUT");
    //    }
    //    return response.json();
    //  })
    //  .then(() => {
    //    const rowIndex = data.indexOf(row.original);
    //    if (rowIndex > -1) {
    //      const newData = [...data];
    //      newData.splice(rowIndex, 1);
    //      setData(newData);
    //    }
    //  })
    //  .catch(error => {
    //      console.error("Error en la solicitud DELETE:", error);
    //  });
    //}
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
      <ModalCliente onAddClient={handleAddCliente} />
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
