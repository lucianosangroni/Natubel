import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl, bearerToken } from "../config/config";

const DataContext = createContext();

export const DataProviderAdmin = ({ children }) => {
    const [ proveedoresData, setProveedoresData ] = useState([])
    const [ clientesData, setClientesData ] = useState([])
    const [ pedidosData, setPedidosData ] = useState([])
    const [ categoriasData, setCategoriasData ] = useState([]);
    const [ articulosData, setArticulosData ] = useState([]);
    const [ montoMinimoMayorista, setMontoMinimoMayorista ] = useState(0)
    const [ montoMinimoDistribuidor, setMontoMinimoDistribuidor ] = useState(0)
    const [ isInitialLoading, setIsInitialLoading ] = useState(true)

    useEffect(() => {
        refreshData()
    }, []);

    const refreshData = () => {
        setIsInitialLoading(true)

        fetch(`${apiUrl}/config`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud GET para la configuracion");
            }
            return response.json();
        })
        .then(configData => {
            fetch(`${apiUrl}/categorias`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud GET para categorías");
                }
                return response.json();
            })
            .then(categoriasData => {
                fetch(`${apiUrl}/articulos`, {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la solicitud GET para artículos");
                    }
                    return response.json();
                })
                .then(articulosData => {
                    fetch(`${apiUrl}/proveedores`, 
                    {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`
                        }
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error en la solicitud GET");
                        }
                        return response.json();
                    })
                    .then((proveedoresData) => {
                        fetch(`${apiUrl}/clientes`, 
                        {
                            headers: {
                                Authorization: `Bearer ${bearerToken}`
                            }
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Error en la solicitud GET");
                            }
                            return response.json();
                        })
                        .then((clientesData) => {
                            const clientes = []
                            for (const dataResult of clientesData) {
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

                            fetch(`${apiUrl}/pedidos`, {
                                headers: {
                                    Authorization: `Bearer ${bearerToken}`,
                                },
                            })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error("Error en la solicitud GET");
                                }
                                return response.json();
                            })
                            .then((pedidosData) => {
                                const pedidos = [];
                                
                                for (const dataResult of pedidosData) {
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
                                        const articuloIndex = articulosData.findIndex(
                                            (item) => item.id === articulo.id
                                        )
                                        
                                        if (articuloIndex !== -1) {
                                            const tallesDesordenados = Array.from(new Set(articulosData[articuloIndex].productos.map((producto) => producto.talle)));
                                            const coloresDesordenados = Array.from(new Set(articulosData[articuloIndex].productos.map((producto) => producto.color)));
                                            
                                            const talles = tallesDesordenados.sort((a, b) => {
                                                if (!isNaN(a) && !isNaN(b)) {
                                                    return a - b;
                                                }

                                                const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
                                                return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
                                            });

                                            const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

                                            const newArticuloPedido = {
                                                id: articulo.id,
                                                numero_articulo: articulosData[articuloIndex].numero_articulo,
                                                talles,
                                                colores,
                                                precio_unitario: articulo.precio_unitario
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

                                const articulosActivos = articulosData.filter(art => art.flag_mostrar === true)

                                setPedidosData(pedidos);
                                setClientesData(clientes)
                                setProveedoresData(proveedoresData)
                                setArticulosData(articulosActivos);
                                setCategoriasData(categoriasData);
                                setMontoMinimoMayorista(configData.montoMinimoMayorista)
                                setMontoMinimoDistribuidor(configData.montoMinimoDistribuidor)
                                
                                setIsInitialLoading(false)
                            })
                            .catch((error) => {
                                console.error("Error en la solicitud GET:", error)
                            });
                        })
                        .catch((error) => {
                            console.error("Error en la solicitud GET:", error)
                        });
                    })
                    .catch((error) => {
                        console.error("Error en la solicitud GET para proveedores:", error);
                    });
                })
                .catch(error => {
                    console.error("Error en la solicitud GET para artículos:", error);
                });       
            })
            .catch(error => {
                console.error("Error en la solicitud GET para categorías:", error);
            });
        })
        .catch(error => {
            console.error("Error en la solicitud GET para la configuración:", error);
        });  
    }

    const refreshConfig = (montoMayorista, montoDistribuidor) => {
        setMontoMinimoMayorista(montoMayorista)
        setMontoMinimoDistribuidor(montoDistribuidor)
    }

    const refreshCategorias = (categorias) => {
        setCategoriasData(categorias)
    }

    const refreshArticulos = (articulos) => {
        setArticulosData(articulos)
    }

    const refreshProveedores = (proveedores) => {
        setProveedoresData(proveedores)
    }

    const refreshClientes = (clientes) => {
        setClientesData(clientes)
    }

    const refreshPedidos = (pedidos) => {
        setPedidosData(pedidos)
    }

    const refreshPedidoCancelado = (pedido_id) => {
        const pedido = pedidosData.find(
            (ped) => ped.numero_pedido === pedido_id
        );

        for(const producto of pedido.productos) {
            const matchingArticulo = articulosData.find((art) => art.id === producto.articulo_id)
            
            if (matchingArticulo) {
                const matchingProduct = matchingArticulo.productos.find((prod) => prod.talle === producto.talle && prod.color === producto.color)

                matchingProduct.stock += producto.productos_x_pedido.cantidad
            }
        }
    }

    return (
        <DataContext.Provider value={{ pedidosData, clientesData, proveedoresData, categoriasData, articulosData, refreshData, montoMinimoMayorista, montoMinimoDistribuidor, isInitialLoading, refreshConfig, refreshCategorias, refreshArticulos, refreshProveedores, refreshClientes, refreshPedidos, refreshPedidoCancelado}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);