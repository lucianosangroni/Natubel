import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { apiUrl, bearerToken } from "../../config/config";
import Loading from "../Common/Loading";

function ModalRemito({ pedido_id, onClose }) {
    const [remito, setRemito] = useState({
        numero_remito: null,
        descuento: null,
        dias_vencimiento: null,
        cantidad_cajas: null
      });
      const [remitoExistente, setRemitoExistente] = useState(null);
      const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(true)

        fetch(`${apiUrl}/remitos/${pedido_id}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        }
      })
      .then((response) => {
        if(response.ok) {
          return response.json();
        } else {
          alert("Error al buscar los datos, intente nuevamente")
          throw new Error("Error en la solicitud GET");
        }
      })
      .then((result) => {
        if(result.remito) {
            setRemitoExistente({
                descuento: result.remito.descuento,
                dias_vencimiento: result.remito.dias_vencimiento,
                cantidad_cajas: result.remito.cantidad_cajas
            })

            setRemito({
                numero_remito: result.remito.numero_remito,
                descuento: result.remito.descuento,
                dias_vencimiento: result.remito.dias_vencimiento,
                cantidad_cajas: result.remito.cantidad_cajas
            })
        }

        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error en la solicitud GET:', error);
      });
    }, [pedido_id]);

  const handleSave = () => {
    if (remito.descuento !== null && remito.descuento !== "" &&
        remito.dias_vencimiento !== null && remito.dias_vencimiento !== "" &&
        remito.cantidad_cajas !== null && remito.cantidad_cajas !== ""
    ) {
        if (remito.numero_remito === null) {
            crearRemito()
        } else {
            editarRemito()
        }
        setRemito({
            numero_remito: null,
            descuento: null,
            dias_vencimiento: null,
            cantidad_cajas: null
        });
        onClose();
      } else {
        
        alert("Por favor, complete todos los campos.");
      }
  };

  const crearRemito = () => {
    setIsLoading(true)

    const requestData = {
        descuento: parseFloat(remito.descuento),
        dias_vencimiento: parseInt(remito.dias_vencimiento),
        cantidad_cajas: parseInt(remito.cantidad_cajas),
        pedido_id: pedido_id
    }

    fetch(`${apiUrl}/remitos`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`
        },
        body: JSON.stringify(requestData)
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al crear remito, verifique los datos ingresados")
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((result) => {
        generarPdfRemito()
      })
      .catch((error) => {
          setIsLoading(false)
          console.error("Error en la solicitud POST:", error);
      });
  }

  const editarRemito = () => {
    setIsLoading(true)

    const requestData = {
        descuento: parseFloat(remito.descuento),
        dias_vencimiento: parseInt(remito.dias_vencimiento),
        cantidad_cajas: parseInt(remito.cantidad_cajas)
    }

    if (requestData.descuento == remitoExistente.descuento && requestData.dias_vencimiento == remitoExistente.dias_vencimiento && requestData.cantidad_cajas == remitoExistente.cantidad_cajas) {
        generarPdfRemito()
    } else {
        fetch(`${apiUrl}/remitos/${pedido_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
          })
          .then((response) => {
            if (!response.ok) {
              alert("Error al editar remito, verifique los datos ingresados")
              throw new Error("Error en la solicitud PUT");
            }
            return response.json();
          })
          .then((result) => {
            generarPdfRemito()
          })
          .catch(error => {
              setIsLoading(false)
              console.error("Error en la solicitud PUT:", error);
          });
    }
  }

  const generarPdfRemito = () => {
    fetch(`${apiUrl}/pdf/remito/${pedido_id}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        }
      })
      .then((response) => {
        if (!response.ok) {
          alert("Error al generar el pdf, intente nuevamente");
          throw new Error("Error en la solicitud GET");
        }
        return response.blob();
      })
      .then((result) => {
        const url = URL.createObjectURL(result);
  
        const newWindow = window.open(url, '_blank');
  
        if (!newWindow) {
            alert('Habilite las ventanas emergentes para descargar el PDF');
        }
  
        URL.revokeObjectURL(url);

        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error en la solicitud GET:', error);
      });
  }

  return (
    <>
      {isLoading && <Loading/>}
      <Modal
        show={true}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group> 
              <Form.Label>Descuento %</Form.Label>
              <Form.Control
                type="text"
                value={remito.descuento}
                onChange={(e) => {
                  setRemito({
                    ...remito,
                    descuento: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group> 
              <Form.Label>Dias de Vencimiento</Form.Label>
              <Form.Control
                type="text"
                value={remito.dias_vencimiento}
                onChange={(e) => {
                  setRemito({
                    ...remito,
                    dias_vencimiento: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group> 
              <Form.Label>Cantidad de Cajas</Form.Label>
              <Form.Control
                type="text"
                value={remito.cantidad_cajas}
                onChange={(e) => {
                  setRemito({
                    ...remito,
                    cantidad_cajas: e.target.value,
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="cerrar"          
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button id="agregar" onClick={handleSave}>
            Descargar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRemito;
