import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl, tokenBearer } from "../config/config";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [ categoriasData, setCategoriasData ] = useState([]);
    const [ articulosData, setArticulosData ] = useState([]);
    const [ coloresData, setColoresData ] = useState([]);
    const [ tallesData, setTallesData ] = useState([]);

    useEffect(() => {
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
            .then(articulosData => {
                const coloresConStock = Array.from(new Set(articulosData.flatMap(articulo => articulo.productos.filter(producto => producto.stock > 0).map(producto => producto.color))));
                const tallesConStock = Array.from(new Set(articulosData.flatMap(articulo => articulo.productos.filter(producto => producto.stock > 0).map(producto => producto.talle))));
                const articulosConStock = articulosData.filter(articulo => articulo.productos.some(producto => producto.stock > 0));
                const categoriasConStock = categoriasData.filter(categoria => articulosConStock.some(articulo => articulo.categoria.some(c => c.id === categoria.id)));
                
                setColoresData(coloresConStock)
                setTallesData(tallesConStock)
                setArticulosData(articulosConStock);
                setCategoriasData(categoriasConStock);
            })
            .catch(error => {
                console.error("Error en la solicitud GET para artículos:", error);
            });       
        })
        .catch(error => {
            console.error("Error en la solicitud GET para categorías:", error);
        });
    }, []);

    return (
        <DataContext.Provider value={{ categoriasData, articulosData, coloresData, tallesData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);