import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const initialProducts = [
  {
    id: 1,
    articulo: "1",
    talles: ["s", "m", "xl", "xxl"],
    colores: ["blanco", "amarillo"],
    datosPorTalleYColor: {
      s: {
        blanco: 5,
        amarillo: 8,
      },
      m: {
        blanco: 1,
        amarillo: 0,
      },
      xl: {
        blanco: 0,
        amarillo: 3,
      },
      xxl: {
        blanco: 0,
        amarillo: 0,
      },
    },
  },
  {
    id: 2,
    articulo: "2",
    talles: ["s", "m"],
    colores: ["blanco", "amarillo", "negro", "fuccia"],
    datosPorTalleYColor: {
      s: {
        blanco: 1,
        amarillo: 8,
        negro: 5,
        fuccia: 0,
      },
      m: {
        blanco: 1,
        amarillo: 8,
        negro: 5,
        fuccia: 0,
      },
    },
  },
  {
    id: 3,
    articulo: "3",
    talles: ["s", "m", "xl"],
    colores: ["blanco"],
    datosPorTalleYColor: {
      s: {
        blanco: 1,
      },
      m: {
        blanco: 5,
      },
      xl: {
        blanco: 4,
      },
    },
  },

  {
    id: 4,
    articulo: "4",
    talles: ["s"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 5,
    articulo: "5",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 6,
    articulo: "6",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
  {
    id: 7,
    articulo: "7",
    talles: ["s", "m", "xl"],
    colores: ["blanco", "amarillo", "negro"],
  },
];

const ListadoProductos = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    articulo: "",
    talle: "",
    color: "",
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;

    setNewProduct({
      ...newProduct,
      [name]: value,
    })
  };

  const handleSaveProduct = () => {
    // Crea un nuevo objeto con los datos del nuevo producto
    const newProductData = {
      id: products.length + 1, // Asigna un nuevo ID
      ...newProduct,
    };

    // Agrega el nuevo producto a la lista de productos
    setProducts([...products, newProductData]);

    // Cierra el modal
    setIsModalOpen(false);
  };

  const renderGrilla = (product) => {
    console.log(product)
    if (product && product.talles && product.colores) {
      if (product.datosPorTalleYColor) {
        return (
          <table className="table-grilla">
            <thead>
              <tr className="table-header-grilla">
                <th className="articulo-grilla">{product.articulo}</th>
                {product.talles.map((talle, index) => (
                  <th key={index}>Talle {talle}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.colores.map((color, index) => (
                <tr key={index}>
                  <td className="table-cell-grilla">{color}</td>
                  {product.talles.map((talle, talleIndex) => (
                    <td key={talleIndex}>
                      {/* Aquí puedes mostrar datos específicos para cada combinación de talle y color */}
                      {selectedProduct.datosPorTalleYColor &&
                        selectedProduct.datosPorTalleYColor[talle] &&
                        selectedProduct.datosPorTalleYColor[talle][color]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        return (
          <div className="grilla-NoDatos">
            No hay datos de talle y color disponibles.
          </div>
        );
      }
    } else {
      return <div className="grilla-NoDatos">Producto no válido.</div>;
    }
  };

  return (
    <>
      <div className="table-productos-contenedor">
        <table className="table-productos">
          <thead>
            <tr className="table-header-productos">
              <th>Artículos</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product)}>
                <td className="table-cell-productos">{product.articulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={openModal} className="agregar-producto-grilla">
          Agregar Producto
        </button>
        {selectedProduct && renderGrilla(selectedProduct)}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <Modal
              show={isModalOpen}
              onHide={closeModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Nuevo producto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="articulo">
                    <Form.Label>Número de Artículo</Form.Label>
                    <Form.Control
                      type="text"
                      name="articulo"
                      value={newProduct.articulo}
                      onChange={handleNewProductChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="talle">
                    <Form.Label>Talle</Form.Label>
                    <Form.Control
                      type="text"
                      name="talle"
                      value={newProduct.talle}
                      onChange={handleNewProductChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="color">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={newProduct.color}
                      onChange={handleNewProductChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button id="botonNuevoCliente" onClick={closeModal}>
                  Cerrar
                </Button>
                <Button id="botonNuevoCliente" onClick={handleSaveProduct}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default ListadoProductos;
