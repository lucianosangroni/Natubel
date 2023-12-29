import Select from "react-select";
import "./ordenarMayorMenor.css";

const ordenar = [
  { label: "Mayor precio", value: "Mayor precio" },
  { label: "Menor precio", value: "Menor precio" },
  { label: "Mas vendidos", value: "Mas vendidos" },
]

const OrdenarMayorMenor = ( { productos, setProductos } ) => {

    const handleOrdenar = (opcion) => {
      if (opcion === "mayorPrecio") {
        const productosOrdenados = [...productos].sort((a, b) => b.price - a.price);
        setProductos(productosOrdenados)
      } else if (opcion === "menorPrecio") {
        const productosOrdenados = [...productos].sort((a, b) => a.price - b.price);
        setProductos(productosOrdenados);
      } else if (opcion === "masVendidos") {

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
