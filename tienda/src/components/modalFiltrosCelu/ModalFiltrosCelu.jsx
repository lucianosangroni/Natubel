import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from '../../context/DataContext';

function ModalFiltrosCelu({onClose, categorias, onSave, redirectCategoria}) {
    const { categoria } = useParams();
    const { tallesData, coloresData } = useData();
    const [ talles, setTalles ] = useState([])
    const [ colores, setColores ] = useState([])
    const [ filtros, setFiltros ] = useState({
        categoria: categoria,
        orden: "empty",
        talle: "",
        color: ""
    })

    useEffect(() => {
        const tallesOrdenados = tallesData.sort((a, b) => {
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

        const coloresOrdenados = coloresData.sort((a, b) => {
            if (a < b) {
                return -1
            }
            if (a > b) {
                return 1
            }
            return 0
        })
        
        const coloresUnicos = new Set()
        
        coloresOrdenados.forEach(color => {
            const colorMayus = color.toUpperCase()
            if(!coloresUnicos.has(colorMayus)) {
                coloresUnicos.add(colorMayus)
            }
        })
        
        setColores(Array.from(coloresUnicos))
    }, [])

    const handleSave = () => {
        if(filtros.categoria === "" && categoria === undefined) {
            onSave(filtros)
        } else if (filtros.categoria !== categoria) {
            redirectCategoria(filtros.categoria)
        } else {
            onSave(filtros)
        }

        onClose()
    }

    const handleCategoriaChange = (e) => {
        setFiltros({
            ...filtros,
            categoria: e.target.value
        })
    }

    const handleOrdenChange = (e) => {
        setFiltros({
            ...filtros,
            orden: e.target.value
        })
    }

    const handleTalleChange = (e) => {
        setFiltros({
            ...filtros,
            talle: e.target.value
        })
    }

    const handleColorChange = (e) => {
        setFiltros({
            ...filtros,
            color: e.target.value
        })
    }

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Filtros</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group style={{marginTop: "1rem"}}>
                            <p style={{textAlign: "center"}}>Seleccione una categoría y luego de guardar los cambios seleccione el resto de los filtros.</p>
                        </Form.Group>
                        <Form.Group style={{marginTop: "2rem"}}>
                            <Form.Label className="boton-categoria">Categorias</Form.Label>
                            <Form.Select
                                value={filtros.categoria}
                                onChange={(e) => handleCategoriaChange(e)}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((cat, catIndex) => {
                                    return (
                                        <option key={catIndex} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{marginTop: "1.5rem"}}>
                            <Form.Label className="boton-categoria">Orden</Form.Label>
                            <Form.Select
                                value={filtros.orden}
                                onChange={(e) => handleOrdenChange(e)}
                            >
                                <option value="empty">Ordenar por...</option>
                                <option value="Mayor precio">Mayor precio</option>
                                <option value="Menor precio">Menor precio</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{marginTop: "1.5rem"}}>
                            <Form.Label className="boton-categoria">Talles</Form.Label>
                            <Form.Select
                                value={filtros.talle}
                                onChange={(e) => handleTalleChange(e)}
                            >
                                <option value="empty">Selecciona un talle</option>
                                {talles.map(talle => (
                                    <option value={talle}>{talle}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{marginTop: "1.5rem"}}>
                            <Form.Label className="boton-categoria">Colores</Form.Label>
                            <Form.Select
                                value={filtros.color}
                                onChange={(e) => handleColorChange(e)}
                            >
                                <option value="empty">Selecciona un color</option>
                                {colores.map(color => (
                                    <option value={color}>{color}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{background: "#e35050", border: "1px solid #e35050"}} id="botonNuevoCliente" variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button style={{background: "#70848b", border: "1px solid #70848b"}} id="botonNuevoCliente" variant="primary" onClick={handleSave}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalFiltrosCelu;
