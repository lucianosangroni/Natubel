import { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import ModalCategoriasEditar from "./ModalCategoriasEditar.jsx";
import Loading from "../Common/Loading";
import { apiUrl, bearerToken } from "../../config/config";

function ModalCategorias({ data, onClose, onNuevaCategoria, onEditCategoria, onEliminarCategoria }) {
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editCategoria, setEditCategoria] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

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

  const handleEliminarCategoria = (categoria) => {
    const shouldDelete = window.confirm(
      `¿Estas seguro que deseas eliminar la categoría ${categoria.nombre}?`
    );
    if (shouldDelete) {
      setIsLoading(true)

      fetch(`${apiUrl}/categorias/${categoria.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al eliminar categoría, intente nuevamente")
          throw new Error("Error en la solicitud DELETE");
        }
        return response.json();
      })
      .then((result) => {
        if(result.message === "Categoría eliminada con éxito") {
          onEliminarCategoria(categoria)
        }

        alert(result.message)
        setIsLoading(false)
      })
      .catch(error => {
          console.error("Error en la solicitud DELETE:", error);
      });
    }
  }

  return (
    <>
      {isLoading && <Loading/>}
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
                      onClick={() => handleEliminarCategoria(categoria)}
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
