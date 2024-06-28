import Select from "react-select";
import "./ordenarMayorMenor.css";
import { useEffect, useState } from "react";

const ordenar = [
  { label: "Mayor precio", value: "Mayor precio" },
  { label: "Menor precio", value: "Menor precio" },
]

const OrdenarMayorMenor = ( { productos, setProductos, flagOrdenar } ) => {
  const [ selectedOpcion, setSelectedOpcion ] = useState("empty")

  useEffect(() => {
    if(selectedOpcion !== "empty") {
      ordenarArticulos(selectedOpcion)
    }
  }, [flagOrdenar])

  const handleOrdenar = (opcion) => {
    setSelectedOpcion(opcion)
    ordenarArticulos(opcion)
  }

  const ordenarArticulos = (opcion) => {
    if (opcion === "Mayor precio") {
      const productosOrdenados = [...productos].sort((a, b) => b.precio_minorista - a.precio_minorista);
      setProductos(productosOrdenados)
    } else if (opcion === "Menor precio") {
      const productosOrdenados = [...productos].sort((a, b) => a.precio_minorista - b.precio_minorista);
      setProductos(productosOrdenados);
    }
  }

  return (
    <div className="ordenarContainer">
      <Select 
        defaultValue = { { label: "Ordenar por...", value: "empty" } }
        options = { ordenar }
        onChange = {(selectedOption) => handleOrdenar(selectedOption.value)}
      />
    </div>

  );
};

export default OrdenarMayorMenor;
