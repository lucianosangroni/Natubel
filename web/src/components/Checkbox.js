// import React from 'react'

// const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
//     const defaultRef = React.useRef()
//     const resolvedRef = ref || defaultRef

//     React.useEffect(() => {
//         resolvedRef.current.indeterminate = indeterminate
//     }, [resolvedRef, indeterminate])
    
//   return (
//     <div>
//         <input type= "checkbox" ref={resolvedRef} {...rest}/>
//     </div>
//   )
// })

// export default Checkbox