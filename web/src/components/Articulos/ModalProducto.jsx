import { useState, useRef } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

function ModalProducto({ onClose, onAddProducto, categorias, marcas }) {
  const [newProduct, setNewProduct] = useState({
    numero_articulo: "",
    enBenka: true,
    categoria: [""],
    marca: null,
    descripcion: "",
    precio_minorista: "",
    precio_mayorista: "",
    precio_distribuidor: "",
    precio_de_marca: "",
    talles: [""],
    colores: [""],
  });

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const handleClose = () => {
    setSelectedFiles([])
    setPreviewImages([])
    onClose()
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

  const removePreview = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);

    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

  const handleSave = () => {
    if(selectedFiles.length > 8) {
      alert("Solo se permite un máximo de 8 imagenes");
    } else {
      newProduct.categoria = newProduct.categoria.filter((cat) => cat.trim() !== "");
      newProduct.talles = newProduct.talles.filter((talle) => talle.trim() !== "");
      newProduct.colores = newProduct.colores.filter((color) => color.trim() !== "");

      if (newProduct.marca !== null && newProduct.numero_articulo && newProduct.categoria.length > 0 && newProduct.precio_minorista && newProduct.precio_mayorista && newProduct.precio_distribuidor && newProduct.talles.length > 0 && newProduct.colores.length > 0) {
        const addProduct = {...newProduct, imagens: []}
        onAddProducto(addProduct);
        setNewProduct({
          numero_articulo: "",
          enBenka: true,
          categoria: [""],
          marca: null,
          descripcion: "",
          precio_minorista: "",
          precio_mayorista: "",
          precio_distribuidor: "",
          precio_de_marca: "",
          talles: [""],
          colores: [""],
        });
        setSelectedFiles([])
        setPreviewImages([])
        handleClose();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    }
  };

  const handleCategoriaChange = (e, index) => {
    const newCategorias = [...newProduct.categoria];
    newCategorias[index] = e.target.value;

    setNewProduct({
      ...newProduct,
      categoria: newCategorias,
    });
  };

  const addCategoriaField = () => {
    const lastCategoria = newProduct.categoria[newProduct.categoria.length - 1].trim();
    if (lastCategoria !== "") {
      setNewProduct({
        ...newProduct,
        categoria: [...newProduct.categoria, ""],
      });
    }
  };

  const removeCategoriaField = (index) => {
    const newCategorias = [...newProduct.categoria];
    newCategorias.splice(index, 1);

    setNewProduct({
      ...newProduct,
      categoria: newCategorias,
    });
  };

  const handleTalleChange = (e, index) => {
    const newTalles = [...newProduct.talles];
    newTalles[index] = e.target.value;

    setNewProduct({
      ...newProduct,
      talles: newTalles,
    });
  };

  const addTalleField = () => {
    const lastTalle = newProduct.talles[newProduct.talles.length - 1].trim();
    if (lastTalle !== "") {
      setNewProduct({
        ...newProduct,
        talles: [...newProduct.talles, ""],
      });
    }
  };

  const removeTalleField = (index) => {
    const newTalles = [...newProduct.talles];
    newTalles.splice(index, 1);
    setNewProduct({
      ...newProduct,
      talles: newTalles,
    });
  };

  const handleColorChange = (e, index) => {
    const newColores = [...newProduct.colores];
    newColores[index] = e.target.value;
    setNewProduct({
      ...newProduct,
      colores: newColores,
    });
  };

  const addColorField = () => {
    const lastColor = newProduct.colores[newProduct.colores.length - 1].trim();
    if (lastColor !== "") {
      setNewProduct({
        ...newProduct,
        colores: [...newProduct.colores, ""],
      });
    }
  };

  const removeColorField = (index) => {
    const newColores = [...newProduct.colores];
    newColores.splice(index, 1);
    setNewProduct({
      ...newProduct,
      colores: newColores,
    });
  };

  return (
    <>
      <Modal
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Articulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Número de Artículo</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.numero_articulo}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    numero_articulo: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
                <Form.Label>Incluir articulo en benkalenceria.com</Form.Label>
                <div>
                    <Form.Check
                        inline
                        type="radio"
                        label="Sí"
                        name="benkaOption"
                        checked={newProduct.enBenka === true}
                        onChange={() => setNewProduct({...newProduct, enBenka: true})}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="benkaOption"
                        checked={newProduct.enBenka === false}
                        onChange={() => setNewProduct({...newProduct, enBenka: false})}
                    />
                </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="boton-categoria">Categorias</Form.Label>
              {newProduct.categoria.map((categ, index) => (
                  <div key={index} className="input-tallecolor-container">
                    <Form.Select
                      value={categ}
                      onChange={(e) => handleCategoriaChange(e, index)}
                    >
                      <option value="">Selecciona una categoría</option>
                       {categorias.map((cat, catIndex) => {
                        const esVisible = !newProduct.categoria.includes(cat.id.toString());
                        return (
                            <option key={catIndex} value={cat.id} hidden={!esVisible}>
                                {cat.nombre}
                            </option>
                        );
                       })}
                    </Form.Select>
                    {newProduct.categoria.length > 1 && (
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
                value={newProduct.marca}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, marca: e.target.value });
                }}>
                <option value={null}>Seleccionar Marca</option>
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
                as="textarea"
                style={{ maxHeight: '200px' }}
                value={newProduct.descripcion}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    descripcion: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Minorista</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.precio_minorista}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    precio_minorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Mayorista</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.precio_mayorista}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    precio_mayorista: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio Distribuidor</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.precio_distribuidor}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    precio_distribuidor: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio de Marca</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.precio_de_marca}
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    precio_de_marca: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <div className="contenedor-botones">
            <Form.Group>
              <Form.Label className="boton-talle">Talles</Form.Label>
              {newProduct.talles.map((talle, index) => (
                  <div key={index} className="input-tallecolor-container">
                    <FormControl
                      placeholder="Talle"
                      value={talle}
                      onChange={(e) => handleTalleChange(e, index)}
                    />
                    {newProduct.talles.length > 1 && (
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
              {newProduct.colores.map((color, index) => (
                  <div key={index} className="input-tallecolor-container">
                  <FormControl
                    placeholder="Color"
                    value={color}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                  {newProduct.colores.length > 1 && (
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
            {/*<Form.Group>
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
            Agregar Articulo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProducto;