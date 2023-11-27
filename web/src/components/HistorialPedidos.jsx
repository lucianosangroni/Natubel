 import React, { useMemo, useState, useEffect } from "react";
 import { useTable,useGlobalFilter, usePagination } from "react-table";
 import { COLUMNSPEDIDOS } from "./columnsListaPedidos"
 import NavbarAdm from '../components/NavbarAdm';
 import GlobalFilter from "./GlobalFilter";
 import ListaProductosDePedido from "./ListaProductosDePedido";
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

 const HistorialPedidos = () => {
   const columns = useMemo(() => COLUMNSPEDIDOS, []);
   const [data, setData] = useState([]);
   const [articulos, setArticulos] = useState([]);
   const [selectedRow, setSelectedRow] = useState(null);

   const jwt = localStorage.getItem("jwt");

   ////OBTENER PEDIDOS Y ARTICULOS DB
   useEffect(() => {
      fetch(`http://localhost:3001/api/articulos`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al buscar los datos, intente nuevamente")
          throw new Error("Error en la solicitud GET");
        }
        return response.json();
      })
      .then((result) => {
        const articulos = [];
        for (const dataResult of result) {
          const productos = dataResult.productos.map(
            ({ id, color, talle }) => ({ id, color, talle })
          );
          const articulo = {
            id: dataResult.id,
            numero_articulo: dataResult.numero_articulo,
            productos,
          };

          if (productos.length > 0) articulos.push(articulo);
        }

        setArticulos(articulos);
      })
      .catch((error) => {
        console.error("Error en la solicitud GET:", error)
      });
   }, [jwt]);

   useEffect(() => {
    fetch(`http://localhost:3001/api/pedidos`, {
       headers: {
         Authorization: `Bearer ${jwt}`,
       },
     })
     .then((response) => {
       if (!response.ok) {
         alert("Error al buscar los datos, intente nuevamente")
         throw new Error("Error en la solicitud GET");
       }
       return response.json();
     })
     .then((result) => {
       const pedidos = [];

       for (const dataResult of result) {
         const newArticulosPedido = []
         const articulosDelPedido = dataResult.productos.map(({ articulo_id, productos_x_pedido }) => ({ id: articulo_id, precio_unitario: productos_x_pedido.precio_unitario }));
         
         const uniqueArticuloData = new Map();

         const uniqueArticulosDelPedido = articulosDelPedido.filter((articulo) => {
           if (!uniqueArticuloData.has(articulo.id)) {
             uniqueArticuloData.set(articulo.id, articulo.precio_unitario);
             return true;
           }
           return false;
         });

         for (const articulo of uniqueArticulosDelPedido) {
          const articuloIndex = articulos.findIndex(
            (item) => item.id === articulo.id
          )

          if (articuloIndex !== -1) {
            const talles = Array.from(new Set(articulos[articuloIndex].productos.map((producto) => producto.talle)));
            const colores = Array.from(new Set(articulos[articuloIndex].productos.map((producto) => producto.color)));
            const precio_unitario = uniqueArticuloData[articulo.id]

            const newArticuloPedido = {
              id: articulo.id,
              numero_articulo: articulos[articuloIndex].numero_articulo,
              talles,
              colores,
              precio_unitario
            }

            newArticulosPedido.push(newArticuloPedido)
          }
         }

         const fechaPedido = new Date(dataResult.createdAt);
         const fechaFormateada = `${fechaPedido.getDate()}/${fechaPedido.getMonth() + 1}/${fechaPedido.getFullYear() % 100}`;

         const pedido = {
           numero_pedido: dataResult.numero_pedido,
           fecha: fechaFormateada,
           persona_nombre: dataResult.persona.nombre,
           estado: dataResult.estado,
           precio_total: dataResult.precio_total,
           tipo: dataResult.persona.es_proveedor ? "PROVEEDOR" : "CLIENTE",
           razon_cancelado: dataResult.razon_cancelado,
           articulos: newArticulosPedido,
           productos: dataResult.productos
         };

         pedidos.push(pedido);
       }
 
       setData(pedidos);
     })
     .catch((error) => {
       console.error("Error en la solicitud GET:", error)
     });
   }, [jwt, articulos])

   const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );

   const { getTableProps, getTableBodyProps, headerGroups, prepareRow, setGlobalFilter,state, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions } = tableInstance
   const { globalFilter } = state;
   const { pageIndex } = state;

   const handleRowClick = (row) => {
    setSelectedRow(row.original);
  };

  const actualizarEstado = (pedido_id, nuevoEstado) => {
    const newData = data.map(pedido => {
      if (pedido.numero_pedido === pedido_id) {
        return { ...pedido, estado: nuevoEstado };
      }
      return pedido;
    });

    setData(newData);
  }

  return (
    <>
      <NavbarAdm />
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="tableDetailsContainer">
        <div className="tableDivContainerPedidos">
          <table {...getTableProps()} className="tableContainerPedidos">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.numero_pedido} {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    key={rowIndex}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(row)}
                    className={selectedRow === row.original ? "selected-row" : ""}
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
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

        <div className="detailsContainer">
          {selectedRow && (
            <ListaProductosDePedido
              pedido={selectedRow}
              onCambiarEstado={actualizarEstado}
              />
          )}
        </div>
      </div>
    </>
  );
};

export default HistorialPedidos;
