import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl, tokenBearer } from "../config/config";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [ categoriasData, setCategoriasData ] = useState([]);
    const [ articulosData, setArticulosData ] = useState([]);
    const [ coloresData, setColoresData ] = useState([]);
    const [ tallesData, setTallesData ] = useState([]);
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
                Authorization: `Bearer ${tokenBearer}`
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
                    Authorization: `Bearer ${tokenBearer}`
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
                        Authorization: `Bearer ${tokenBearer}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la solicitud GET para marcas");
                    }
                    return response.json();
                })
                .then(marcasData => {
                    fetch(`${apiUrl}/articulos`, {
                        headers: {
                            Authorization: `Bearer ${tokenBearer}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error en la solicitud GET para artículos");
                        }
                        return response.json();
                    })
                    .then(articulosDataSinFiltroEnBenka => {
                        const articulosData = articulosDataSinFiltroEnBenka.filter(art => art.enBenka)
                        const coloresConStock = Array.from(new Set(articulosData.flatMap(articulo => articulo.productos.filter(producto => producto.stock > 0).map(producto => producto.color))));
                        const tallesConStock = Array.from(new Set(articulosData.flatMap(articulo => articulo.productos.filter(producto => producto.stock > 0).map(producto => producto.talle))));
                        const articulosConStock = articulosData.filter(articulo => articulo.productos.some(producto => producto.stock > 0));
                        const categoriasConStock = categoriasData.filter(categoria => articulosConStock.some(articulo => articulo.categoria.some(c => c.id === categoria.id)));
                        for (const categoria of categoriasConStock) {
                            categoria.nombre = categoria.nombre.toUpperCase();
                        }
    
                        const articulosConMarca = articulosConStock.map(art => {
                            const marca = marcasData.find(m => m.id === art.marca_id);
                            return {
                                ...art,
                                marca: marca ? marca.nombre : null,
                            };
                        });

                        setColoresData(coloresConStock)
                        setTallesData(tallesConStock)
                        setArticulosData(articulosConMarca);
                        setCategoriasData(categoriasConStock);
                        setMontoMinimoMayorista(configData.montoMinimoMayorista)
                        setMontoMinimoDistribuidor(configData.montoMinimoDistribuidor)
                        
                        setIsInitialLoading(false)
                    })
                    .catch(error => {
                        console.error("Error en la solicitud GET para artículos:", error);
                    });     
                })
                .catch(error => {
                    console.error("Error en la solicitud GET para marcas:", error);
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

    return (
        <DataContext.Provider value={{ categoriasData, articulosData, coloresData, tallesData, refreshData, montoMinimoMayorista, montoMinimoDistribuidor, isInitialLoading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);