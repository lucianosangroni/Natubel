import React from 'react'

const GlobalFilter = ({ filter, setFilter}) => {
  return (
    <div className='globalFilter'>
        <span role="img" aria-label="lupa" className="search-icon">
        🔍
      </span>
        <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar..."/>
        
    </div>
  )
}

export default GlobalFilter