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
        .then(data => {
            setCategoriasData(data);
        })
        .catch(error => {
            console.error("Error en la solicitud GET para categorías:", error);
        });

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
        .then(data => {
            const colores = Array.from(new Set(data.flatMap(articulo => articulo.productos.map(producto => producto.color))));
            const talles = Array.from(new Set(data.flatMap(articulo => articulo.productos.map(producto => producto.talle))));

            setColoresData(colores)
            setTallesData(talles)
            setArticulosData(data);
        })
        .catch(error => {
            console.error("Error en la solicitud GET para artículos:", error);
        });
    }, []);

    return (
        <DataContext.Provider value={{ categoriasData, articulosData, coloresData, tallesData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);