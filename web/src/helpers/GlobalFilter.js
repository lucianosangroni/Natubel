import React, {useState} from 'react'
import { useAsyncDebounce } from 'react-table'


const GlobalFilter = ({ filter, setFilter}) => {
      const [value, setValue] = useState(filter)

      const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
      }, 300)

  return (
    <div className='globalFilter' style={{marginTop: "0", marginBottom: "0"}}>
        <span role="img" aria-label="lupa" className="search-icon">
        🔍
      </span>
        <input className='globalFilter-input' style={{margin: "0", marginLeft: "1rem"}} value={value || ""} placeholder="Buscar..." onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value);
            
        }}/>
        
    </div>
  )
}

export default GlobalFilter