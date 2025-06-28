import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

const Precios = () => {
    const { isInitialLoading, articulosData, refreshArticulos, marcasData } = useData()
    const [ data, setData ] = useState(articulosData)
    const [ cantidades, setCantidades] = useState({});
    const [selectedMarca, setSelectedMarca] = useState("todas");
    const inputRefs = {};
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        setCantidades({});
        const filtered = selectedMarca === "todas"
            ? articulosData
            : articulosData.filter(art => String(art.marca_id) === String(selectedMarca));
        setData(filtered);
        
        if (filtered.length > 0) {
            inputRefs[filtered[0].id + "-minorista"]?.current?.focus();
        }
    }, [articulosData, selectedMarca]);

    const handleKeyDown = (e, articulo) => {
        e.preventDefault()
        const key = e.key

        if(key >= '0' && key <= '9') {
            const newCantidad = (cantidades[articulo] || "") + key;
            handleCantidadChange(articulo, newCantidad)
        } else if (key === "Delete") {
            handleCantidadChange(articulo, "")
        } else if (key === "Backspace") {
            const newCantidad = (String(cantidades[articulo]) || "").slice(0, -1);
            handleCantidadChange(articulo, newCantidad)
        } else if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowDown") {
            const [articuloId, tipo] = articulo.split('-');

            let nextInputId = articulo

            if (key === 'ArrowRight') {
                if (tipo === 'minorista') {
                    nextInputId = `${articuloId}-mayorista`;
                } else if (tipo === 'mayorista') {
                    nextInputId = `${articuloId}-distribuidor`;
                } else if (tipo === 'distribuidor') {
                    nextInputId = `${articuloId}-marca`;
                }
            } else if (key === 'ArrowLeft') {
                if (tipo === 'mayorista') {
                    nextInputId = `${articuloId}-minorista`;
                } else if (tipo === 'distribuidor') {
                    nextInputId = `${articuloId}-mayorista`;
                } else if (tipo === 'marca') {
                    nextInputId = `${articuloId}-distribuidor`;
                }
            } else if (key === 'ArrowDown') {
                const nextIndex = data.findIndex(articulo => articulo.id === parseInt(articuloId)) + 1;
                if (nextIndex < data.length) {
                    nextInputId = `${data[nextIndex].id}-${tipo}`;
                }
            } else if (key === 'ArrowUp') {
                const prevIndex = data.findIndex(articulo => articulo.id === parseInt(articuloId)) - 1;
                if (prevIndex >= 0) {
                    nextInputId = `${data[prevIndex].id}-${tipo}`;
                }
            }
    
            inputRefs[nextInputId].current.focus()
        }
    }

    const handleCantidadChange = (articulo, cantidad) => {
        const parsedCantidad = parseInt(cantidad) || ""
        const newCantidades = {...cantidades, [articulo]: parsedCantidad}
        const filteredCantidades = filtrarDiccionario(newCantidades)
        setCantidades(filteredCantidades);
    };

    const filtrarDiccionario = (diccionario) => {
        const claves = Object.keys(diccionario)
        const resultado = {}

        for(const clave of claves) {
            if(diccionario[clave] !== "") {
                resultado[clave] = diccionario[clave]
            }
        }

        return resultado
    }

    const handleChangeMarca = (marcaId) => {
        if (Object.keys(cantidades).length > 0) {
            const confirmCambio = window.confirm("Tienes cambios sin guardar. ¿Seguro que quieres cambiar de marca y perderlos?");
            if (!confirmCambio) {
                return;
            }
        }
    
        setCantidades({});
        setSelectedMarca(marcaId);
    }

    const handleGuardarCambios = () => {
        if(Object.keys(cantidades).length > 0) {
            const shouldGuardarCambios = window.confirm(
                `¿Estas seguro que quieres guardar los cambios?`
            );
            if (!shouldGuardarCambios) {
                return;
            }

            setIsLoading(true)
            
            const newData = [...data];
            const articulosCambiadosSet = new Set();

            for (const articulo of newData) {
                for (const [key, value] of Object.entries(cantidades)) {
                    const [articuloId, tipo] = key.split('-');

                    if (articulo.id === parseInt(articuloId)) {
                        if (tipo === "minorista") {
                            articulo.precio_minorista = parseFloat(value)
                        } else if (tipo === "mayorista") {
                            articulo.precio_mayorista = parseFloat(value)
                        } else if (tipo === "distribuidor") {
                            articulo.precio_distribuidor = parseFloat(value)
                        } else if (tipo === "marca") {
                            articulo.precio_de_marca = parseFloat(value);
                        }

                        articulosCambiadosSet.add(articuloId);
                    }
                }
            }

            const requestData = []
            const articulosCambiados = Array.from(articulosCambiadosSet);

            for (const articuloCambiadoId of articulosCambiados) {
                const articuloCambiado = newData.find(art => art.id === parseInt(articuloCambiadoId))

                const articulo = {
                    id: articuloCambiado.id,
                    precio_minorista: articuloCambiado.precio_minorista,
                    precio_mayorista: articuloCambiado.precio_mayorista,
                    precio_distribuidor: articuloCambiado.precio_distribuidor,
                    precio_de_marca: articuloCambiado.precio_de_marca
                }

                requestData.push(articulo)
            }

            fetch(`${apiUrl}/precios`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(requestData),
            })
            .then((response) => {
                if (!response.ok) {
                    alert("Error al editar precios, verifique los datos ingresados");
                    throw new Error("Error en la solicitud PUT");
                }
                return response.json();
            })
            .then((result) => {
                refreshArticulos(newData)
                setCantidades({})
                setIsLoading(false)
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
            <select value={selectedMarca} onChange={(e) => handleChangeMarca(e.target.value)} style={{marginLeft: "1rem", marginTop: "5.5rem"}}>
                <option value="todas">Todas las marcas</option>
                {marcasData.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                    </option>
                ))}
            </select>

            {data.length > 0 && (
                <table style={{marginTop: "1rem", marginBottom: "1rem"}} className="table-grilla">
                    <thead>
                        <tr >
                            <th id="articulo-grilla-elegido" style={{width: "115px"}}>N° Artículo</th>
                            <th id="articulo-grilla-elegido" style={{width: "200px"}}>Precio Minorista</th>
                            <th id="articulo-grilla-elegido" style={{width: "200px"}}>Precio Mayorista</th>
                            <th id="articulo-grilla-elegido" style={{width: "200px"}}>Precio Distribuidor</th>
                            <th id="articulo-grilla-elegido" style={{width: "200px"}}>Precio de Marca</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((articulo, index) => {
                            const cantidadMinorista = cantidades[articulo.id + "-minorista"] || "";
                            const cantidadMayorista = cantidades[articulo.id + "-mayorista"] || "";
                            const cantidadDistribuidor = cantidades[articulo.id + "-distribuidor"] || "";
                            const cantidadMarca = cantidades[articulo.id + "-marca"] || "";
                            
                            inputRefs[articulo.id + "-minorista"] = React.createRef();
                            inputRefs[articulo.id + "-mayorista"] = React.createRef();
                            inputRefs[articulo.id + "-distribuidor"] = React.createRef();
                            inputRefs[articulo.id + "-marca"] = React.createRef();

                            return (
                                <tr key={index}>
                                    <td>ART. {articulo.numero_articulo}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input style={{width: "80px"}}
                                                type="text"
                                                defaultValue={cantidadMinorista}
                                                onKeyDown={(e) => handleKeyDown(e, articulo.id + "-minorista")}
                                                ref={inputRefs[articulo.id + "-minorista"]}
                                            />
                                            <span className="stock-label">&nbsp;(${articulo.precio_minorista})</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input style={{width: "80px"}}
                                                type="text"
                                                defaultValue={cantidadMayorista}
                                                onKeyDown={(e) => handleKeyDown(e, articulo.id + "-mayorista")}
                                                ref={inputRefs[articulo.id + "-mayorista"]}
                                            />
                                            <span className="stock-label">&nbsp;(${articulo.precio_mayorista})</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input style={{width: "80px"}}
                                                type="text"
                                                defaultValue={cantidadDistribuidor}
                                                onKeyDown={(e) => handleKeyDown(e, articulo.id + "-distribuidor")}
                                                ref={inputRefs[articulo.id + "-distribuidor"]}
                                            />
                                            <span className="stock-label">&nbsp;(${articulo.precio_distribuidor})</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                style={{width: "80px"}}
                                                type="text"
                                                defaultValue={cantidadMarca}
                                                onKeyDown={(e) => handleKeyDown(e, articulo.id + "-marca")}
                                                ref={inputRefs[articulo.id + "-marca"]}
                                            />
                                            <span className="stock-label">&nbsp;(${articulo.precio_de_marca})</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <Button onClick={handleGuardarCambios} id="btnDescargarStock" className="abajoDerecha">Guardar Cambios</Button>
        </>
    );
}

export default Precios;
