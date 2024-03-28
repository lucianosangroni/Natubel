import React, { useMemo, useState, useEffect } from "react";
import { useTable,useGlobalFilter, usePagination } from "react-table";
import { COLUMNSPEDIDOS } from "./columnsListaPedidos"
import NavbarAdm from '../Common/NavbarAdm';
import GlobalFilter from "../../helpers/GlobalFilter";
import ListaProductosDePedido from "./ListaProductosDePedido";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { apiUrl, bearerToken } from "../../config/config";
import Loading from "../Common/Loading";

const HistorialPedidos = () => {
  const columns = useMemo(() => COLUMNSPEDIDOS, []);
  const [data, setData] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false)


   ////OBTENER PEDIDOS Y ARTICULOS DB
  useEffect(() => {
      setIsLoading(true)

      fetch(`${apiUrl}/articulos`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
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
        setIsLoading(false)
        console.error("Error en la solicitud GET:", error)
      });
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/pedidos`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
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
              const tallesDesordenados = Array.from(new Set(articulos[articuloIndex].productos.map((producto) => producto.talle)));
              const coloresDesordenados = Array.from(new Set(articulos[articuloIndex].productos.map((producto) => producto.color)));

              const talles = tallesDesordenados.sort((a, b) => {
                if (!isNaN(a) && !isNaN(b)) {
                  return a - b;
                }

                const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
              });

              const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));
              
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

          newArticulosPedido.sort((articuloA, articuloB) => {
            const numeroA = parseInt(articuloA.numero_articulo);
            const numeroB = parseInt(articuloB.numero_articulo);
      
            if (numeroA !== numeroB) {
                return numeroA - numeroB;
            } else {
                const letrasA = articuloA.numero_articulo.replace(/^\d+\s*/, '');
                const letrasB = articuloB.numero_articulo.replace(/^\d+\s*/, '');
            
                return letrasA.localeCompare(letrasB);
            }
          });

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
            productos: dataResult.productos,
            creador: dataResult.creador
          };

          pedidos.push(pedido);
        }

        pedidos.sort((a, b) => b.numero_pedido - a.numero_pedido)

        setData(pedidos);
        setSelectedRow(pedidos[0])

        setIsLoading(false)
    })
    .catch((error) => {
      setIsLoading(false)
      console.error("Error en la solicitud GET:", error)
    });
  }, [articulos])

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
    setSelectedRow(newData[0])
  }

  return (
    <>
      {isLoading && <Loading/>}
      <NavbarAdm selected={'Pedidos'}/>
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

          {selectedRow && (
            <ListaProductosDePedido
              pedido={selectedRow}
              onCambiarEstado={actualizarEstado}
              />
          )}
      </div>
    </>
  );
};

export default HistorialPedidos;
