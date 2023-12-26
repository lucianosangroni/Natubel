import React from 'react'
import './inicio.css';
import ItemListContainer from '../itemListContainer/itemListContainer';
import UncontrolledExample from '../galeriaImagenes/GaleriaImagenes';


const Inicio = () => {
  return (
    <div>
        <UncontrolledExample />
        <ItemListContainer/>

    </div>
  )
}

export default Inicio