import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const urlAPI = 'https://localhost:44380/api/FormasDePago'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Formasdepago = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [newFormasdepago, setNewFormasdepago] = useState("");

  const toggleCollapse = () => setCollapse(!collapse);

  const listarFormasdepago = async () => {
    try {
      const response = await fetch(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const result = await response.json();
      console.log('Datos obtenidos:', result);  // Registro de depuración
      setData(result.data || []);
    } catch (error) {
      console.error('Error al listar Formas de pago', error);
    }
  };

  const insertarFormasdepago = async (e) => {
    e.preventDefault();
    try {
      const fechaActual = new Date().toISOString(); 
      const nuevaFormasdepago = {
        fopa_Descripcion: newFormasdepago,
        usua_UsuarioCreacion: 1,
        fopa_FechaCreacion: fechaActual
      };

      const response = await fetch(`${urlAPI}/Insertar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        },
        body: JSON.stringify(nuevaFormasdepago)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      listarFormasdepago();
      setNewFormasdepago("");
      setCollapse(false);
      toast.success("Forma de pago insertada exitosamente!");
    } catch (error) {
      console.error('Error al insertar Formas de pago', error);
      toast.error("Error al insertar la forma de pago.");
    }
  };

  const cancelar = () => {
    setNewFormasdepago("");
    setCollapse(false);
  };

  useEffect(() => {
    listarFormasdepago();
  }, []);

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary">
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate">
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger">
        Eliminar
      </Button>
    </div>
  );

  const columns = [
    {
      name: "ID",
      selector: row => row.fopa_Id,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.fopa_Descripcion,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => botonesAcciones(row),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "400px", 
    }
  ];

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Formas de pago"
              icon="pe-7s-network icon-gradient bg-tempting-azure"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse}>
                  <Card>
                    <CardBody>
                      <Form onSubmit={insertarFormasdepago}>
                        <FormGroup>
                          <Label for="Formasdepago">Formas de pago</Label>
                          <Input
                            type="text"
                            name="Formasdepago"
                            id="Formasdepago"
                            value={newFormasdepago}
                            onChange={(e) => setNewFormasdepago(e.target.value)}
                            required
                          />
                        </FormGroup>
                        <Button className="mb-2 me-2 btn-shadow" type="submit" color="primary">
                           Enviar
                         </Button>
                         <Button className="mb-2 me-2 btn-shadow" onClick={cancelar} type="button" color="secondary">
                           Cancelar
                         </Button>
                      </Form>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
              {!collapse && (
                <Col md="12">
                  <Card className="main-card mb-3">
                    <CardBody>
                      <DataTable
                        data={data}
                        columns={columns}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="No hay registros para mostrar"
                      />
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <ToastContainer />
    </Fragment>
  );
};

export default Formasdepago;
