 import React, { useMemo } from "react";
 import { useTable,useGlobalFilter } from "react-table";
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

   return (
    <>
    <NavbarAdm/>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
     <table {...getTableProps()} className="tableContainer">
       <thead>
         {headerGroups.map((headerGroups) => (
           <tr {...headerGroups.getHeaderGroupProps()}>
             {headerGroups.headers.map((columns) => (
              <th {...columns.getHeaderProps()}>{columns.render("Header")}</th>
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
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
     </tbody>
   </table>
   </>
  );
 };

export default HistorialPedidos;
