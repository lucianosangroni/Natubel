import React, { useMemo, useState, useEffect } from "react";
import NavbarAdm from '../Common/NavbarAdm';
import { useTable, useGlobalFilter, usePagination, useRowSelect} from "react-table";
import { COLUMNSPROVE } from "./columnsListaProveedores";
import GlobalFilter from "../../helpers/GlobalFilter";
import ModalProveedores from "./ModalProveedores";
import ModalProveedoresEditar from "./ModalProveedoresEditar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faArrowLeft, faArrowRight, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { apiUrl, bearerToken } from "../../config/config";
import Loading from "../Common/Loading";
import { useData } from "../../context/DataContext";
import { Navigate } from "react-router-dom";

const ListadoProveedores = () => {
  const { proveedoresData, isInitialLoading, refreshProveedores } = useData()
  const columns = useMemo(() => COLUMNSPROVE, []);
  const [data, setData] = useState(proveedoresData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [ shouldRedirect, setShouldRedirect ] = useState(false)
  const [emailCuentaCorriente, setEmailCuentaCorriente] = useState("")

  //OBTENER PROVEEDORES DB
  useEffect(() => {
    setData(proveedoresData)
  }, [proveedoresData]);

  //AGREGAR PROVEEDOR DB
  const handleAddProveedor = (newProveedor) => {
    setIsLoading(true)

    const requestData = 
    {
      nombre: newProveedor.nombre,
      direccion: newProveedor.direccion,
      telefono: newProveedor.telefono,
      email: newProveedor.email,
      cuit_cuil: parseInt(newProveedor.cuit_cuil)
    }

    fetch(`${apiUrl}/proveedores`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al agregar proveedor, verifique los datos ingresados")
        throw new Error("Error en la solicitud POST");
      }
      return response.json();
    })
    .then((result) => {
      newProveedor.id = result.id
    
      const dataActualizada = [...data, newProveedor];

      setData(dataActualizada);
      refreshProveedores(dataActualizada)
      
      setIsLoading(false)
    })
    .catch((error) => {
        setIsLoading(false)
        console.error("Error en la solicitud POST:", error);
    });
  };

  //ABRIR MODAL EDITAR
  const handleEditRow = (row) => {
    const editData = row.original;
    editData.index = row.index;
    setEditingData(editData);
    setIsEditModalOpen(true);
  };

  //EDITAR PROVEEDOR DB
  const updateTableRow = (newData) => {
    setIsLoading(true)

    const requestData = 
    {
      nombre: newData.nombre,
      direccion: newData.direccion,
      telefono: newData.telefono,
      email: newData.email,
      cuit_cuil: parseInt(newData.cuit_cuil)
    }

    fetch(`${apiUrl}/proveedores/${newData.id}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify(requestData)
    })
    .then((response) => {
      if (!response.ok) {
        alert("Error al editar proveedor, verifique los datos ingresados")
        throw new Error("Error en la solicitud PUT");
      }
      return response.json();
    })
    .then(() => {

      const dataActualizada = [...data];
      dataActualizada[newData.index] = newData;

      setData(dataActualizada);
      refreshProveedores(dataActualizada)

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
      `¿Estas seguro que deseas eliminar al proveedor ${deleteData.nombre}?`
    );

    if (shouldDelete) {
      setIsLoading(true)

      fetch(`${apiUrl}/proveedores/${deleteData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al eliminar proveedor, intente nuevamente")
          throw new Error("Error en la solicitud DELETE");
        }
        return response.json();
      })
      .then((result) => {
        if(result.message === "Proveedor eliminado con éxito") {
          const dataActualizada = [...data];
          dataActualizada.splice(deleteData.index, 1);
          setData(dataActualizada);
          refreshProveedores(dataActualizada)
        }

        alert(result.message)
        setIsLoading(false)
      })
      .catch(error => {
          console.error("Error en la solicitud DELETE:", error);
      });
    }
  };

  const handleCuentaCorriente = (row) => {
    setEmailCuentaCorriente(row.original.email)
    setShouldRedirect(true)
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
      {shouldRedirect && <Navigate to={`/admin/cuenta-corriente/${emailCuentaCorriente}`} />}
      <NavbarAdm selected={'Proveedores'}/>
      <div style={{marginTop: "5.5rem"}}>
        <GlobalFilter  filter={globalFilter} setFilter={setGlobalFilter} />
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
                          ) : cell.column.id === "cuenta-corriente" ? (
                            <button onClick={() => handleCuentaCorriente(row)} className="botonEditar">
                              <FontAwesomeIcon icon={faSackDollar} />
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
        {isEditModalOpen && (
          <ModalProveedoresEditar
            data={editingData}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(editedData) => {
              updateTableRow(editedData);
              setIsEditModalOpen(false);
            }}
          />
        )}
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
        <ModalProveedores onAddProveedor={handleAddProveedor} />
      </div>
    </>
  );
};

export default ListadoProveedores;
