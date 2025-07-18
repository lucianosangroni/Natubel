import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

function ModalProductoEditar({ onEditProducto, articulo, categorias, marcas }) {
  const [show, setShow] = useState(false);
  const [editProduct, setEditProduct] = useState(
    {
    numero_articulo: articulo.numero_articulo,
    categoria: articulo.categoria.map((cat) => cat.id),
    marca: articulo.marca_id,
    descripcion: articulo.descripcion,
    precio_minorista: articulo.precio_minorista,
    precio_mayorista: articulo.precio_mayorista,
    precio_distribuidor: articulo.precio_distribuidor,
    precio_de_marca: articulo.precio_de_marca,
    talles: [],
    colores: [],
    imagens: []
    }
  );

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([]);

  const tallesDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.talle)));
  const coloresDesordenados = Array.from(new Set(articulo.productos.map((producto) => producto.color)));

  const talles = tallesDesordenados.sort((a, b) => {
    const rangoRegex = /^(\d+)\/(\d+)(?:\s+.*)?$/i;
    const parseRango = (x) => {
      const match = x.match(rangoRegex);
      if (!match) return null;
      return {
        start: parseInt(match[1]),
        end: parseInt(match[2]),
        texto: x.substring(match[0].length).trim(),
      };
    };

    const rangoA = parseRango(a);
    const rangoB = parseRango(b);
    
    if (!isNaN(a) && !isNaN(b)) {
      return a - b;
    } else if (rangoA && rangoB) {
      return rangoA.start - rangoB.start;
    }
    
    const talleOrden = { 's': 1, 'm': 2, 'l': 3, 'xl': 4, 'xxl': 5, 'xxxl': 6, 'xxxxl': 7, 'xxxxxl': 8 };
    return talleOrden[a.toLowerCase()] - talleOrden[b.toLowerCase()];
  });

  const colores = coloresDesordenados.sort((a, b) => a.localeCompare(b, 'es', {ignorePunctuation: true}));

  useEffect(() => {
    setEditProduct(
      {
        id: articulo.id,
        numero_articulo: articulo.numero_articulo,
        categoria: articulo.categoria.map((cat) => cat.id),
        marca: articulo.marca_id,
        descripcion: articulo.descripcion,
        precio_minorista: articulo.precio_minorista,
        precio_mayorista: articulo.precio_mayorista,
        precio_distribuidor: articulo.precio_distribuidor,
        precio_de_marca: articulo.precio_de_marca,
        productos: articulo.productos,
        talles,
        colores,
        imagens: []
      }
    );

    setSelectedFiles([])
    setOldFiles([])
    setPreviewImages([])
  }, [articulo]);

  const handleClose = () => {
    setSelectedFiles([])
    setPreviewImages([])
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
    setOldFiles([])
  }

  const handleSelectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (event) => {
    const files = event.target.files;

    setSelectedFiles([...selectedFiles, ...files]);

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
  };

  const removeOldFile = (index) => {
    const updatedOldFiles = [...oldFiles];
    updatedOldFiles.splice(index, 1);

    setOldFiles(updatedOldFiles)
  };

  const removePreview = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);

    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

  const handleSave = () => {
    if(selectedFiles.length + oldFiles.length > 8) {
      alert("Solo se permite un máximo de 8 imagenes");
    } else {
      editProduct.categoria = editProduct.categoria.filter((cat) => cat.toString().trim() !== "");

      if (editProduct.numero_articulo && editProduct.categoria.length > 0 && editProduct.precio_minorista && editProduct.precio_mayorista && editProduct.precio_distribuidor && editProduct.precio_de_marca && editProduct.talles.length > 0 && editProduct.colores.length > 0) {
        const imagenesRemove = []//articulo.imagens.filter(imagen => !oldFiles.map(file => file.id).includes(imagen.id)).map(imagen => imagen.id)
        const editProductData = {...editProduct, imagenesAdd: selectedFiles, imagenesRemove}
        onEditProducto(editProductData);
        handleClose();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    }
  };

  const handleCategoriaChange = (e, index) => {
    const newCategorias = [...editProduct.categoria];
    let newValue
    if(e.target.value !== "") {
      newValue = parseInt(e.target.value)
    } else {
      newValue = ""
    }
    
    newCategorias[index] = newValue;
    setEditProduct({
      ...editProduct,
      categoria: newCategorias,
    });
  };

  const addCategoriaField = () => {
    const lastCategoria = editProduct.categoria[editProduct.categoria.length - 1]
    if (lastCategoria !== "") {
      setEditProduct({
        ...editProduct,
        categoria: [...editProduct.categoria, ""],
      });
    }
  };

  const removeCategoriaField = (index) => {
    const newCategorias = [...editProduct.categoria];
    newCategorias.splice(index, 1);
    setEditProduct({
      ...editProduct,
      categoria: newCategorias,
    });
  };

  const handleTalleChange = (e, index) => {
    const newTalles = [...editProduct.talles];
    newTalles[index] = e.target.value;
    setEditProduct({
      ...editProduct,
      talles: newTalles,
    });
  };

  const addTalleField = () => {
    const lastTalle = editProduct.talles[editProduct.talles.length - 1].trim();
    if (lastTalle !== "") {
      setEditProduct({
        ...editProduct,
        talles: [...editProduct.talles, ""],
      });
    }
  };

  const removeTalleField = (index) => {
    const newTalles = [...editProduct.talles];
    newTalles.splice(index, 1);
    setEditProduct({
      ...editProduct,
      talles: newTalles,
    });
  };

  const handleColorChange = (e, index) => {
    const newColores = [...editProduct.colores];
    newColores[index] = e.target.value;
    setEditProduct({
      ...editProduct,
      colores: newColores,
    });
  };

  const addColorField = () => {
    const lastColor = editProduct.colores[editProduct.colores.length - 1].trim();
    if (lastColor !== "") {
      setEditProduct({
        ...editProduct,
        colores: [...editProduct.colores, ""],
      });
    }
  };

  const removeColorField = (index) => {
    const newColores = [...editProduct.colores];
    newColores.splice(index, 1);
    setEditProduct({
      ...editProduct,
      colores: newColores,
    });
  };

  return (
    <>
      <button onClick={handleShow} className="agregar-producto-grilla" style={{ marginTop: '2rem' }}>
        Editar Articulo
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Articulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Número de Artículo</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.numero_articulo}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    numero_articulo: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="boton-categoria">Categorias</Form.Label>
              {editProduct.categoria.map((categ, index) => (
                  <div key={index} className="input-tallecolor-container">
                    <Form.Select
                      value={categ}
                      onChange={(e) => handleCategoriaChange(e, index)}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat, catIndex) => {
                        const esVisible = !editProduct.categoria.includes(cat.id);
                        return (
                            <option key={cat.id} value={cat.id} hidden={!esVisible}>
                                {cat.nombre}
                            </option>
                        );
                      })}
                    </Form.Select>
                    {editProduct.categoria.length > 1 && (
                      <Button id="boton-menos" onClick={() => removeCategoriaField(index)}>
                        -
                      </Button>
                    )}
                  </div>
                  ))}
              <Button id="boton-mas-cat" onClick={addCategoriaField}>
                +
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label>Marca</Form.Label>
              <Form.Control
                as="select"
                value={editProduct.marca}
                onChange={(e) => {
                  setEditProduct({ ...editProduct, marca: e.target.value });
                }}>
                {marcas.map((mar, marIndex) => {
                  return (
                      <option key={marIndex} value={mar.id}>
                          {mar.nombre}
                      </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.descripcion}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    descripcion: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Minorista</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_minorista}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_minorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Mayorista</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_mayorista}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_mayorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Distribuidor</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_distribuidor}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_distribuidor: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio de Marca</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.precio_de_marca}
                onChange={(e) => {
                    setEditProduct({
                    ...editProduct,
                    precio_de_marca: e.target.value,
                  });
                }}
              />
            </Form.Group>
          <div className="contenedor-botones">
            <Form.Group>         
              <Form.Label className="boton-talle">Talles</Form.Label>
              {editProduct.talles.map((talle, index) => (
                  <div key={index} className="input-tallecolor-container">
                  <FormControl
                    placeholder="Talle"
                    value={talle}
                    onChange={(e) => handleTalleChange(e, index)}
                  />
                  {editProduct.talles.length > 1 && (
                    <Button id="boton-menos" onClick={() => removeTalleField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button id="boton-mas" onClick={addTalleField}>
                 +
               </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label className="boton-talle">Colores</Form.Label>
              {editProduct.colores.map((color, index) => (
                <div key={index} className="input-tallecolor-container">
                  <FormControl
                    placeholder="Color"
                    value={color}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                  {editProduct.colores.length > 1 && (
                    <Button id="boton-menos" onClick={() => removeColorField(index)}>
                      -
                    </Button>
                  )}
                </div>
                  ))}
               <Button id="boton-mas" onClick={addColorField}>
                 +
               </Button>
            </Form.Group>
         </div>
         {/** 
         <Form.Group>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                accept="image/*"
                onChange={onFileChange}
              />
              <button type="button" id="botonNuevoCliente" onClick={handleSelectFiles}>Seleccionar Imagenes</button>
              <div className="imagenesCargadas">
              {oldFiles.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', flexDirection: "column", marginBottom: '5px' }}>
                  <img key={index} src={file.url} alt={`imagen`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
                  <button type="button" id="botonNuevoCliente" onClick={() => removeOldFile(index)}>Eliminar</button>
                </div>
              ))}
              {previewImages.map((preview, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', flexDirection: "column", marginBottom: '5px' }}>
                  <img key={index} src={preview} alt={`imagen`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
                  <button type="button" id="botonNuevoCliente" onClick={() => removePreview(index)}>Eliminar</button>
                </div>
              ))}
              </div>
            </Form.Group>
            */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="botonNuevoCliente"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
          <Button id="botonNuevoCliente" variant="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProductoEditar;
