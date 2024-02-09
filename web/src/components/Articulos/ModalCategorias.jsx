import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import ModalCategoriasEditar from "./ModalCategoriasEditar.jsx";



function ModalCategorias({ data, onClose, onNuevaCategoria, onEditCategoria }) {
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editCategoria, setEditCategoria] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim() !== "") {
      onNuevaCategoria(nuevaCategoria);
      setNuevaCategoria("");
      onClose();
    }
  };

  const handleEditarCategoria = (categoria) => {
    setEditCategoria(categoria);
    setIsEditModalOpen(true);
  };

  const handleEditCategoria = (nuevaCategoria) => {
    onEditCategoria(nuevaCategoria);
  };

  return (
    <>
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Categorias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table 
            striped
            bordered
            hover
          >
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((categoria, index) => (
                <tr key={index}>
                  <td>{categoria.nombre}</td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "#dcd9d9",
                        color: "black",
                        borderColor: "black",
                      }}
                      size="sm"
                      onClick={() => handleEditarCategoria(categoria)}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      style={{
                        backgroundColor: "#dcd9d9",
                        color: "black",
                        borderColor: "black",
                      }}
                      size="sm"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Nueva Categoría"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                  />
                </td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "#dcd9d9",
                      color: "black",
                      borderColor: "black",
                    }}
                    size="sm"
                    onClick={handleAgregarCategoria}
                  >
                    Agregar
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button id="botonNuevoCliente" variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {isEditModalOpen && (
        <ModalCategoriasEditar
          categoria={editCategoria}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(nuevaCategoria) => handleEditCategoria(nuevaCategoria)}
        />
      )}
    </>
  );
}

export default ModalCategorias;
