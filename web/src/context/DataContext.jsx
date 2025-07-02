import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl, bearerToken } from "../config/config";

const DataContext = createContext();

export const DataProviderAdmin = ({ children }) => {
    const [ proveedoresData, setProveedoresData ] = useState([])
    const [ clientesData, setClientesData ] = useState([])
    const [ pedidosData, setPedidosData ] = useState([])
    const [ facturasData, setFacturasData ] = useState([])
    const [ remitosData, setRemitosData ] = useState([]);
    const [ pagosData, setPagosData ] = useState([]);
    const [ imputacionesData, setImputacionesData ] = useState([])
    const [ categoriasData, setCategoriasData ] = useState([]);
    const [ marcasData, setMarcasData ] = useState([]);
    const [ cuponesData, setCuponesData] = useState([])
    const [ articulosData, setArticulosData ] = useState([]);
    const [ montoMinimoMayorista, setMontoMinimoMayorista ] = useState(0)
    const [ montoMinimoDistribuidor, setMontoMinimoDistribuidor ] = useState(0)
    const [ isInitialLoading, setIsInitialLoading ] = useState(true)
    const [offsetPedidos, setOffsetPedidos] = useState(0);
    const [hasMorePedidos, setHasMorePedidos] = useState(true);
    const [startPedidos, setStartPedidos] = useState(false);
    const limitPedidos = 10;

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
                fetch(`${apiUrl}/marcas`, {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la solicitud GET para marcas");
                    }
                    return response.json();
                })
                .then(marcasData => {
                    fetch(`${apiUrl}/cupones`, {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error en la solicitud GET para cupones");
                        }
                        return response.json();
                    })
                    .then(cuponesData => {
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
                            fetch(`${apiUrl}/facturas`, {
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
                            .then((facturasData) => {
                                fetch(`${apiUrl}/remitos`, {
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
                                .then((remitosData) => {
                                    fetch(`${apiUrl}/pagos`, {
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
                                    .then((pagosData) => {
                                        fetch(`${apiUrl}/imputaciones`, {
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
                                        .then((imputacionesData) => {
                                            fetch(`${apiUrl}/proveedores`, {
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
                                                fetch(`${apiUrl}/clientes`, {
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
                                                            descuento: dataResult.descuento,
                                                            tipo_envio: dataResult.tipo_envio,
                                                            forma_de_envio: dataResult.forma_de_envio,
                                                            email: dataResult.persona.email,
                                                            tipo_cliente: dataResult.tipo_cliente,
                                                        }

                                                        clientes.push(cliente)
                                                    }
                                                
                                                    fetch(`${apiUrl}/pedidos?limit=${limitPedidos}&offset=${offsetPedidos}`, {
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
                                                        setOffsetPedidos(prev => prev + limitPedidos);
                                                        if (pedidosData.length < limitPedidos) {setHasMorePedidos(false)}

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
                                                                        const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;
                                                                        const parseRango = (x) => {
                                                                            const match = x.match(rangoRegex);
                                                                            if (!match) return null;
                                                                            return {
                                                                                start: parseInt(match[1]),
                                                                                end: parseInt(match[2]),
                                                                                texto: x.substring(match[0].length).trim(),
                                                                            };
                                                                        };

                                                                        const rangoA = parseRango(a);
                                                                        const rangoB = parseRango(b);
                                                                        
                                                                        if (!isNaN(a) && !isNaN(b)) {
                                                                            return a - b;
                                                                        } else if (rangoA && rangoB) {
                                                                            return rangoA.start - rangoB.start;
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

                                                            let persona = proveedoresData.find(prov => prov.id === dataResult.persona_id)
                                                            if(!persona) {
                                                                persona = clientesData.find(cli => cli.persona.id === dataResult.persona_id).persona
                                                            }

                                                            const pedido = {
                                                                numero_pedido: dataResult.numero_pedido,
                                                                fecha: fechaFormateada,
                                                                persona_nombre: persona.nombre,
                                                                estado: dataResult.estado,
                                                                precio_total: dataResult.precio_total,
                                                                tipo: persona.es_proveedor ? "PROVEEDOR" : "CLIENTE",
                                                                razon_cancelado: dataResult.razon_cancelado,
                                                                articulos: newArticulosPedido,
                                                                productos: dataResult.productos,
                                                                creador: dataResult.creador
                                                            };
                                                        
                                                            pedidos.push(pedido);
                                                        }

                                                        pedidos.sort((a, b) => b.numero_pedido - a.numero_pedido)
                                                    
                                                        const articulosActivos = articulosData.filter(art => art.flag_mostrar === true)

                                                        for (const factura of facturasData) {
                                                            let persona = proveedoresData.find(prov => prov.id === factura.persona_id)
                                                            if(!persona) {
                                                                persona = clientesData.find(cli => cli.persona.id === factura.persona_id).persona
                                                            }

                                                            factura.persona_nombre = persona.nombre
                                                        }

                                                        setPedidosData(pedidos);
                                                        setFacturasData(facturasData)
                                                        setRemitosData(remitosData)
                                                        setClientesData(clientes)
                                                        setProveedoresData(proveedoresData)
                                                        setArticulosData(articulosActivos);
                                                        setCategoriasData(categoriasData);
                                                        setMarcasData(marcasData)
                                                        setCuponesData(cuponesData)
                                                        setPagosData(pagosData)
                                                        setImputacionesData(imputacionesData)
                                                        setMontoMinimoMayorista(configData.montoMinimoMayorista)
                                                        setMontoMinimoDistribuidor(configData.montoMinimoDistribuidor)
                                                        setStartPedidos(true)
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
                                        .catch((error) => {
                                            console.error("Error en la solicitud GET para imputaciones:", error);
                                        });
                                    })
                                    .catch((error) => {
                                        console.error("Error en la solicitud GET para pagos:", error);
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error en la solicitud GET para remitos:", error);
                                });
                            })
                            .catch((error) => {
                                console.error("Error en la solicitud GET para facturas:", error);
                            });
                        })
                        .catch(error => {
                            console.error("Error en la solicitud GET para artículos:", error);
                        });
                    })
                    .catch(error => {
                        console.error("Error en la solicitud GET para cupones:", error);
                    });
                })
                .catch(error => {
                    console.error("Error en la solicitud GET para marcas:", error)
                }) 
            })
            .catch(error => {
                console.error("Error en la solicitud GET para categorías:", error);
            });
        })
        .catch(error => {
            console.error("Error en la solicitud GET para la configuración:", error);
        });  
    }

    useEffect(() => {
        if(!startPedidos) {
            return;
        }

        if (!hasMorePedidos) {
            return;
        }

        const timer = setTimeout(() => {
            fetchPedidos();
        }, 500);

        return () => clearTimeout(timer);
    }, [offsetPedidos, hasMorePedidos]);

    const fetchPedidos = async () => {
        try {
            const response = await fetch(`${apiUrl}/pedidos?limit=${limitPedidos}&offset=${offsetPedidos}`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (!response.ok) throw new Error("Error en la solicitud GET");

            const nuevosPedidos = await response.json();

            const nuevosPedidosFormateados = [];

            for (const dataResult of nuevosPedidos) {
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
                            const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;
                            const parseRango = (x) => {
                                const match = x.match(rangoRegex);
                                if (!match) return null;
                                return {
                                    start: parseInt(match[1]),
                                    end: parseInt(match[2]),
                                    texto: x.substring(match[0].length).trim(),
                                };
                            };
                        
                            const rangoA = parseRango(a);
                            const rangoB = parseRango(b);
                            
                            if (!isNaN(a) && !isNaN(b)) {
                                return a - b;
                            } else if (rangoA && rangoB) {
                                return rangoA.start - rangoB.start;
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
                
                const proveedor = proveedoresData.find(prov => prov.id === dataResult.persona_id)
                const cliente = clientesData.find(cli => cli.persona_id === dataResult.persona_id)

                const pedido = {
                    numero_pedido: dataResult.numero_pedido,
                    fecha: fechaFormateada,
                    persona_nombre: proveedor? proveedor.nombre : cliente.nombre,
                    estado: dataResult.estado,
                    precio_total: dataResult.precio_total,
                    tipo: proveedor ? "PROVEEDOR" : "CLIENTE",
                    razon_cancelado: dataResult.razon_cancelado,
                    articulos: newArticulosPedido,
                    productos: dataResult.productos,
                    creador: dataResult.creador
                };
                
                nuevosPedidosFormateados.push(pedido);
            }
            
            nuevosPedidosFormateados.sort((a, b) => b.numero_pedido - a.numero_pedido)

            setPedidosData(prevPedidos => [...prevPedidos, ...nuevosPedidosFormateados]);

            if (nuevosPedidos.length < limitPedidos) {
                setHasMorePedidos(false);
            } else {
                setOffsetPedidos(prev => prev + limitPedidos);
            }
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };

    const refreshConfig = (montoMayorista, montoDistribuidor) => {
        setMontoMinimoMayorista(montoMayorista)
        setMontoMinimoDistribuidor(montoDistribuidor)
    }

    const refreshCategorias = (categorias) => {
        setCategoriasData(categorias)
    }

    const refreshMarcas = (marcas) => {
        setMarcasData(marcas)
    }

    const refreshCupones = (cupones) => {
        setCuponesData(cupones)
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

    const refreshRemitos = (remitos) => {
        setRemitosData(remitos)
    }

    const refreshObservacionesPedido = (numero_pedido, nuevoTexto) => {
        const pedidosDataActualizados = pedidosData.map(pedido => 
            pedido.numero_pedido === numero_pedido
                ? { ...pedido, razon_cancelado: nuevoTexto }
                : pedido);
        setPedidosData(pedidosDataActualizados)
    }

    const refreshPagos = (pagos) => {
        setPagosData(pagos)
    }

    const addImputaciones = (newImputaciones) => {
        setImputacionesData((prevImputaciones) => {
            const maxNumeroImputacion = Math.max(...prevImputaciones.map(imputacion => imputacion.numero_imputacion), 0);
    
            const updatedNewImputaciones = newImputaciones.map(imputacion => ({
                ...imputacion,
                numero_imputacion: maxNumeroImputacion + 1
            }));

            return [...prevImputaciones, ...updatedNewImputaciones];
        });
    }

    const refreshFacturasAdd = (facturas) => {
        setFacturasData(facturas)
    }

    const refreshFacturas = (facturas) => {
        setFacturasData((prevFacturasData) => 
            prevFacturasData.map((fac) => {
                const facturaActualizada = facturas.find((f) => f.id === fac.id);
                if (facturaActualizada) {
                    return {
                        ...fac,
                        monto: facturaActualizada.monto,
                        fecha: facturaActualizada.fecha,
                        pedido_id: facturaActualizada.pedido_id,
                        flag_imputada: facturaActualizada.flag_imputada
                    };
                }
                return fac;
            })
        );
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
        <DataContext.Provider value={{ imputacionesData, pedidosData, clientesData, proveedoresData, facturasData, remitosData, categoriasData, pagosData, refreshObservacionesPedido, refreshPagos, refreshFacturasAdd, marcasData, cuponesData, refreshCupones, articulosData, refreshRemitos, refreshFacturas, refreshData, addImputaciones, montoMinimoMayorista, montoMinimoDistribuidor, isInitialLoading, refreshConfig, refreshCategorias, refreshMarcas, refreshArticulos, refreshProveedores, refreshClientes, refreshPedidos, refreshPedidoCancelado}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);