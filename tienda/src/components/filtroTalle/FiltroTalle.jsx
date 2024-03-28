import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import "../categoriasLateral/categoriasLateral.css";
import { useData } from '../../context/DataContext';

const FiltroTalle = ({ articulos, onChangeTalle }) => {
    const [ filtroTalle, setFiltroTalle ] = useState(null);
    const [ tallesHabilitados, setTallesHabilitados ] = useState([]);
    const { tallesData } = useData();
    const [ talles, setTalles ] = useState([])

    useEffect(() => {
      setFiltroTalle(null)

      if(articulos) {
        const tallesFiltrados = tallesData.filter(talle => articulos.some(articulo => articulo.productos.some(producto => producto.talle === talle && producto.stock > 0)))
        setTallesHabilitados(tallesFiltrados)
      } else {
        setTallesHabilitados(tallesData)
      }
    }, [articulos])

    useEffect(() => {
      const tallesOrdenados = tallesHabilitados.sort((a, b) => {
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
  
      const tallesUnicos = new Set()
  
      tallesOrdenados.forEach(talle => {
        const talleMayus = talle.toUpperCase()
        if(!tallesUnicos.has(talleMayus)) {
          tallesUnicos.add(talleMayus)
        }
      })
  
      setTalles(Array.from(tallesUnicos))
    }, [tallesHabilitados])

    const handleFiltroTalle = (talle) => {
      if(filtroTalle === talle) {
        setFiltroTalle(null)
        onChangeTalle(null)
      } else {
        setFiltroTalle(talle)
        onChangeTalle(talle)
      }
    }

  return (
    <div className="categoriaLateral">
        <ul className="menuLateral">
            <p className="menuLateralTitulo">Talles</p>
            {talles.map(talle => (
              <li className="textoCategorias" key={talle}>
                <Link
                  className={`menu-link ${filtroTalle === talle ? "seleccionada" : ""}`}
                  onClick={() => handleFiltroTalle(talle)}
                >
                  {talle}
                </Link>
              </li>
            ))}
        </ul>
    </div>
  )
}

export default FiltroTalle