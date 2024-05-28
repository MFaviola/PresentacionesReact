import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import axios from 'axios';

const urlAPI = 'https://localhost:44380/api/Marcas'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Marcas = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [newMarca, setNewMarca] = useState("");

  const toggleCollapse = () => setCollapse(!collapse);

  const listarMarcas = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar Marcas', error);
    }
  };

  const insertarMarca = async (e) => {
    e.preventDefault();
    try {
      const fechaActual = new Date().toISOString(); 
      const nuevaMarca = {
        marc_Descripcion: newMarca,
        usua_UsuarioCreacion: 1,
        marc_FechaCreacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Insertar`, nuevaMarca, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarMarcas();

      setNewMarca("");
      setCollapse(false);
    } catch (error) {
      console.error('Error al insertar marca', error);
    }
  };

  const cancelar = () => {
    setNewMarca("");
    setCollapse(false);
  };

  useEffect(() => {
    listarMarcas();
  }, []);

  const botonesacciones = row => (
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
      selector: row => row.marc_Id,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.marc_Descripcion,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => botonesacciones(row),
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
              heading="Marcas"
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
                      <Form onSubmit={insertarMarca}>
                        <FormGroup>
                          <Label for="marcaDescripcion">Marca</Label>
                          <Input
                            type="text"
                            name="marca"
                            id="marcaDescripcion"
                            value={newMarca}
                            onChange={(e) => setNewMarca(e.target.value)}
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
                      />
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  );
};

export default Marcas;
