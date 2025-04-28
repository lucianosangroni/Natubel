import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import Loading from "../Common/Loading";
import React, { useState, useEffect } from "react";
import NavbarAdm from "../Common/NavbarAdm";
import { useNavigate } from 'react-router-dom';
import ListaArticulos from "../Common/ListaArticulos";
import GrillaProductoPedido from "../CargarPedido/GrillaProductoPedido";
import GrillaProductosDePedido from "../Pedidos/GrillaProductosDePedido";
import { Button } from "react-bootstrap";
import { apiUrl, bearerToken } from "../../config/config";

const EditarPedido = () => {
    const { isInitialLoading, pedidosData, articulosData } = useData()
    const { numero_pedido } = useParams();
    const [ articulosDataActualizados, setArticulosDataActualizados ] = useState([])
    const [ pedido, setPedido ] = useState(null);
    const [ selectedArticulo, setSelectedArticulo ] = useState(null);
    const [ selectedArticuloOriginal, setSelectedArticuloOriginal ] = useState(null)
    const [ selectedArticuloEditado, setSelectedArticuloEditado ] = useState(null)
    const [ cantidadesArticuloActual, setCantidadesArticuloActual ] = useState({});
    const [ productosConfirmados, setProductosConfirmados ] = useState([]);
    const [ articulosConfirmados, setArticulosConfirmados ] = useState([])
    const [ productosConfirmadosGrilla, setProductosConfirmadosGrilla ] = useState([])
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        if(pedidosData.length > 0) {
            const selectedPedido = pedidosData.find(pedido => pedido.numero_pedido === parseInt(numero_pedido))
            if(selectedPedido) {
                setPedido(selectedPedido)
                setSelectedArticuloOriginal(selectedPedido.articulos[0])
            } else {
                alert("No se encontró el pedido")
                navigate(`/admin/pedidos`);
            }
        }
    }, [numero_pedido, pedidosData]);

    useEffect(() => {
        if(pedido && articulosData.length > 0) {
            const articulosConStockDelPedido = initArticulos()
            setArticulosDataActualizados(articulosConStockDelPedido)
            setSelectedArticulo(articulosConStockDelPedido[0])
        }
    }, [pedido, articulosData])

    useEffect(() => {
        if(pedido && articulosDataActualizados.length > 0) {
            const productosConfirmadosIniciales = getProductosConfirmadosIniciales()
            setProductosConfirmados(productosConfirmadosIniciales)
        }
    }, [pedido, articulosDataActualizados])

    useEffect(() => {
        const productos = []

        for(const articulo of productosConfirmados) {
            const articulo_id = articulosDataActualizados.find(art => art.numero_articulo === articulo.numero_articulo).id

            for(const [productKey, cantidad] of Object.entries(articulo.cantidades)) {
                const [color, talle] = productKey.split('-');
                const productos_x_pedido = {cantidad}

                const prod = {
                    articulo_id,
                    color,
                    talle,
                    productos_x_pedido
                }

                productos.push(prod)
            }
        }

        setProductosConfirmadosGrilla(productos)
    }, [productosConfirmados])

    const getProductosConfirmadosIniciales = () => {
        const productosConfirmadosIniciales = []

        for (const articulo of pedido.articulos) {
            const articuloData = articulosDataActualizados.find(art => art.numero_articulo === articulo.numero_articulo)

            const cantidades = {}

            for(const producto of pedido.productos) {
                if(producto.articulo_id === articulo.id) {
                    const productKey = `${producto.color}-${producto.talle}`
                    cantidades[productKey] = producto.productos_x_pedido.cantidad
                }
            }

            const productoConfirmadoNuevo = {
                precio_minorista: articuloData.precio_minorista,
                precio_mayorista: articuloData.precio_mayorista,
                precio_distribuidor: articuloData.precio_distribuidor,
                productos: articuloData.productos,
                numero_articulo: articuloData.numero_articulo,
                cantidades,
            }

            productosConfirmadosIniciales.push(productoConfirmadoNuevo)
        }

        refreshProductosConfirmadosEdit(productosConfirmadosIniciales)

        return productosConfirmadosIniciales
    }

    const initArticulos = () => {
        const articulos = JSON.parse(JSON.stringify(articulosData));

        for(const producto of pedido.productos) {
            const articulo = articulos.find(art => art.id === producto.articulo_id)
            
            if(!articulo) {
                alert("No se puede editar el pedido porque tiene articulos inactivos")
                navigate('/admin/pedidos')
            } else {
                const productoAActualizar = articulo.productos.find(prod => prod.color === producto.color && prod.talle === producto.talle)

                productoAActualizar.stock += producto.productos_x_pedido.cantidad
            }
        }

        return articulos
    }

    const refreshProductosConfirmadosEdit = (productosConfirmados) => {
        const articulosConfirmadosSet = new Set()

        for(const producto of productosConfirmados) {
            const articulo = articulosDataActualizados.find(art => art.numero_articulo === producto.numero_articulo)

            articulosConfirmadosSet.add(articulo)
        }

        const articulosConfirmadosArray = Array.from(articulosConfirmadosSet)

        const articulosConfirmadosActualizados = []

        for(const articulo of articulosConfirmadosArray) {
            const coloresDesordenados =  Array.from(new Set(articulo.productos.map((producto) => producto.color)));
            const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));

            const colores = coloresDesordenados.sort((a, b) => {
                if (a < b) {
                    return -1
                }
                if (a > b) {
                    return 1
                }
                return 0
            })

            const talles = tallesDesordenados.sort((a, b) => {
                const isNumberA = !isNaN(a);
                const isNumberB = !isNaN(b);
                const talleOrden = { 'UNICO': 1 ,'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7, 'XXXXL': 8, 'XXXXXL': 9 };
        
                if (isNumberA && isNumberB) {
                    return a - b;
                }  else if (isNumberA || isNumberB) {
                    return isNumberA ? 1 : -1;
                } else {
                    const aMayus = a.toUpperCase()
                    const bMayus = b.toUpperCase()
                    return talleOrden[aMayus] - talleOrden[bMayus];
                }
            })

            const art = {
                colores,
                id: articulo.id,
                numero_articulo: articulo.numero_articulo,
                talles 
            }

            articulosConfirmadosActualizados.push(art)
        }

        setArticulosConfirmados(articulosConfirmadosActualizados)
        setSelectedArticuloEditado(articulosConfirmadosActualizados[0])
    }

    const handleArticuloClick = (articulo) => {
        if(Object.keys(cantidadesArticuloActual).length !== 0 && selectedArticulo.numero_articulo !== articulo.numero_articulo) {
            const shouldCambiarArticulo = window.confirm(
                `El articulo actual no está confirmado, ¿Estas seguro que quieres seleccionar otro?`
            );
            if (!shouldCambiarArticulo) {
                return;
            }
        }
        
        setSelectedArticulo(articulo);
    }

    const handleArticuloClickOriginal = (articulo) => {
        setSelectedArticuloOriginal(articulo);
    }

    const handleConfirmarProducto = (articulo, cantidades) => {
        const productoExistenteIndex = productosConfirmados.findIndex(
            (producto) => producto.numero_articulo === articulo.numero_articulo
        );

        if (productoExistenteIndex !== -1) {
            const productosConfirmadosActualizados = [...productosConfirmados];
            productosConfirmadosActualizados[productoExistenteIndex].cantidades = cantidades;
            setProductosConfirmados(productosConfirmadosActualizados);
            refreshProductosConfirmadosEdit(productosConfirmadosActualizados)
        } else {
            const productoConfirmadosNuevo = {
                precio_minorista: articulo.precio_minorista,
                precio_mayorista: articulo.precio_mayorista,
                precio_distribuidor: articulo.precio_distribuidor,
                productos: articulo.productos,
                numero_articulo: articulo.numero_articulo,
                cantidades,
            };

            setProductosConfirmados([
                ...productosConfirmados,
                productoConfirmadosNuevo,
            ]);

            refreshProductosConfirmadosEdit([
                ...productosConfirmados,
                productoConfirmadosNuevo,
            ])
        }

        setCantidadesArticuloActual({});
        alert(`Articulo confirmado`);
    }

    const handleBorrarConfirmarProducto = (articulo) => {
        const productosConfirmadosActualizados = productosConfirmados.filter(
            (producto) => producto.numero_articulo !== articulo.numero_articulo
        );
        
        setProductosConfirmados(productosConfirmadosActualizados);
        refreshProductosConfirmadosEdit(productosConfirmadosActualizados)
        alert(`Articulo eliminado del pedido`);
    }

    const handleSetCantidades = (cantidades) => {
        setCantidadesArticuloActual(cantidades)
    }

    const handleArticuloClickEditado = (articulo) => {
        setSelectedArticuloEditado(articulo)
    }

    const handleGuardarCambios = () => {
        const shouldGuardarCambios = window.confirm(
            `¿Estas seguro que deseas guardar los cambios?`
        );

        if(shouldGuardarCambios) {
            const articulos = []

            const productosIniciales = []

            for(const productoInicial of pedido.productos) {
                const prod = {
                    id: productoInicial.id,
                    cantidad: productoInicial.productos_x_pedido.cantidad
                }

                productosIniciales.push(prod)
            }

            for(const producto of productosConfirmados) {
                const articulo_id = articulosDataActualizados.find(art => art.numero_articulo === producto.numero_articulo).id

                const articulo = {
                    id: articulo_id,
                    cantidades: producto.cantidades,
                }

                articulos.push(articulo)
            }

            const requestData = {
                articulos,
                productosIniciales
            };

            setIsLoading(true)

            fetch(`${apiUrl}/editar-pedido/${pedido.numero_pedido}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`
                },
                body: JSON.stringify(requestData)
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al editar el pedido, intente nuevamente")
                    throw new Error("Error en la solicitud PUT");
                }
                return response.json();
            })
            .then((result) => {
                setIsLoading(false)
                alert(result.message)

                if(result.message === "Pedido editado con éxito") {
                    navigate(`/admin/pedidos`);
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.error("Error en la solicitud PUT:", error);
            });
        }
    }

    return (
        <>
            {(isLoading || isInitialLoading) && <Loading/>}
            <NavbarAdm/>
            {pedido && (
                <>
                    <div className="editarPedidoContainerOriginalEdit" style={{marginTop: "4.5rem"}}>
                        <section className="contenedor-tabla-grilla-editar-pedido">
                            <p className="pedido-edit-titulo">Pedido Original</p>
                            <div className="display-flex">
                                <ListaArticulos articulos={pedido.articulos} onArticuloClick={handleArticuloClickOriginal} selectedArticulo={selectedArticuloOriginal}/>
                                {selectedArticuloOriginal && (
                                    <GrillaProductosDePedido
                                    articulo={selectedArticuloOriginal}
                                    productos={pedido.productos}
                                    />
                                )}
                            </div>
                        </section>
                        <section className="contenedor-tabla-grilla-editar-pedido">
                            <p className="pedido-edit-titulo">Pedido Final</p>
                            <div className="display-flex">
                                {productosConfirmados.length > 0 && (
                                    <>
                                        <ListaArticulos articulos={articulosConfirmados} onArticuloClick={handleArticuloClickEditado} selectedArticulo={selectedArticuloEditado}/>
                                        {selectedArticuloEditado && (
                                            <GrillaProductosDePedido
                                            articulo={selectedArticuloEditado}
                                            productos={productosConfirmadosGrilla}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                        {/** 
                        <section className="contenedor-tabla-grilla-editar-pedido">
                            <p className="pedido-edit-titulo">Cambios</p>
                            <div className="display-flex">
                                {productosConfirmados.length > 0 && (
                                    <>
                                        <ListaArticulos articulos={articulosConfirmados} onArticuloClick={handleArticuloClickEditado} selectedArticulo={selectedArticuloEditado}/>
                                        {selectedArticuloEditado && (
                                            <GrillaProductosDePedido
                                            articulo={selectedArticuloEditado}
                                            productos={productosConfirmadosGrilla}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                        */}
                    </div>
                    <section className="contenedor-tabla-grilla-editar-pedido-carga">
                        <ListaArticulos articulos={articulosDataActualizados} onArticuloClick={handleArticuloClick} selectedArticulo={selectedArticulo}/>
                        {selectedArticulo && (
                            <GrillaProductoPedido
                            articulo={selectedArticulo}
                            onConfirmarProducto={handleConfirmarProducto}
                            tipoPedidor={"cliente"}
                            onBorrarConfirmarProducto={handleBorrarConfirmarProducto}
                            onSetCantidades={handleSetCantidades}
                            />
                        )}
                    </section>
                    <Button onClick={handleGuardarCambios} id="btnDescargarStock" style={{right: "1rem"}}>Guardar Cambios</Button>
                </>
            )}
        </>
    );
};

export default EditarPedido;