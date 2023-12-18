import React, { useMemo, useState, useEffect } from "react";
import NavbarAdm from '../Common/NavbarAdm';
import { useTable, useGlobalFilter, usePagination, useRowSelect} from "react-table";
import { COLUMNSPROVE } from "./columnsListaProveedores";
import GlobalFilter from "../../helpers/GlobalFilter";
import ModalProveedores from "./ModalProveedores";
import ModalProveedoresEditar from "./ModalProveedoresEditar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from "../../config/config";

const ListadoProveedores = () => {
  const columns = useMemo(() => COLUMNSPROVE, []);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const jwt = localStorage.getItem('jwt')

  //OBTENER PROVEEDORES DB
  useEffect(() => {
    fetch(`${apiUrl}/proveedores`, 
    {
      headers: {
        Authorization: `Bearer ${jwt}`
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
      const proveedores = []
      for (const dataResult of result) {
        const proveedor =
        {
          id: dataResult.id,
          nombre: dataResult.nombre,
          direccion: dataResult.direccion,
          telefono: dataResult.telefono,
          email: dataResult.email,
          cuit_cuil: dataResult.cuit_cuil
        }

        proveedores.push(proveedor)
      }

      setData(proveedores)
    })
    .catch((error) => {
      console.error("Error en la solicitud GET:", error);
    });
  }, [jwt]);

  //AGREGAR PROVEEDOR DB
  const handleAddProveedor = (newProveedor) => {
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
          Authorization: `Bearer ${jwt}`
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
      setData((prevData) => [...prevData, newProveedor]);
    })
    .catch((error) => {
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
          Authorization: `Bearer ${jwt}`
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
    //  "¿Estas seguro que deseas eliminar el proveedor?"
    //);
    //if (shouldDelete) {
    //  fetch(`${apiUrl}/proveedores/${row.original.id}`, {
    //    method: "DELETE",
    //    headers: {
    //      Authorization: `Bearer ${jwt}`
    //    }
    //  })
    //  .then((response) => {
    //    if (!response.ok) {
    //      alert("Error al eliminar proveedor, intente nuevamente")
    //      throw new Error("Error en la solicitud DELETE");
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
      <NavbarAdm selected={'Proveedores'}/>
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
    </>
  );
};

export default ListadoProveedores;
