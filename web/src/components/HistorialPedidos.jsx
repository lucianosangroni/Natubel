 import React, { useMemo, useState } from "react";
 import { useTable,useGlobalFilter } from "react-table";
 import Select from 'react-select'; 
 import DATA_HISTORIAL from "../data/DATA_HISTORIAL.json";
 import { COLUMNSPEDIDOS } from "./columnsListaPedidos"
 import NavbarAdm from '../components/NavbarAdm';
 import GlobalFilter from "./GlobalFilter";


 const HistorialPedidos = () => {
   const columns = useMemo(() => COLUMNSPEDIDOS, []);
   const data = useMemo(() => DATA_HISTORIAL, [])

   const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );
   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter,state } =
     tableInstance

     const { globalFilter } = state;

     const [selectedEstado, setSelectedEstado] = useState(null);

     const handleEstadoChange = (selectedOption) => {
      // Almacena la opción seleccionada en el estado local
      setSelectedEstado(selectedOption);
      console.log("Nuevo estado seleccionado:", selectedOption.value);
    };

   return (
    <>
    <NavbarAdm/>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
    <div className="tableDivContainerPedidos">
     <table {...getTableProps()} className="tableContainerPedidos">
       <thead>
         {headerGroups.map((headerGroups) => (
           <tr {...headerGroups.getHeaderGroupProps()}>
             {headerGroups.headers.map((columns) => (
              <th {...columns.getHeaderProps()}>{columns.render("Header")}
                                  {columns.render("Header")}
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
             {row.cells.map((cell, index) => (
                    <td {...cell.getCellProps()}>
                      {columns[index].id === "estado" ? (
                        <Select
                          options={[
                            { value: "CANCELADO", label: "Cancelado" },
                            { value: "PEDIDO", label: "Pedido" },
                            { value: "ENVIADO", label: "Enviado" },
                            { value: "PAGADO", label: "Pagado" },
                            { value: "COMPLETADO", label: "Completado" },
                          ]}
                          value={selectedEstado}
                          onChange={handleEstadoChange}
                        />
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
         ))}
         </tr>
       );
     })}
   </tbody>
 </table>
</div>
</>
);
};

export default HistorialPedidos;
