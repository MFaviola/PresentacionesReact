import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

const urlAPI = 'https://localhost:44380/api/Marcas'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Marcas = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editMarcaId, setEditMarcaId] = useState(null); 
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [elimMarcaId, setElimMarcaId] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);


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
      const MarcaAEditar = {
        marc_Descripcion: nuevaMarca,
        usua_UsuarioCreacion: 1,
        marc_FechaCreacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Insertar`, MarcaAEditar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarMarcas();

      setNuevaMarca("");
      setCollapse(false);
    } catch (error) {
      console.error('Error al insertar marca', error);
    }
  };

  const editarMarca = async (e) => {
    e.preventDefault();
    try {
      const fechaActual = new Date().toISOString(); 
      const marcaAEditar = {
        marc_Id: editMarcaId, 
        marc_Descripcion: nuevaMarca,
        usua_UsuarioModificacion: 1, 
        marc_FechaModificacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Editar`, marcaAEditar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarMarcas();

      setNuevaMarca("");
      setCollapse(false);
      setEditar(false);
      setEditMarcaId(null); 
    } catch (error) {
      console.error('Error al editar marca', error);
    }
  };

  const editarMarcaClick = (marcaId, descripcion) => {
    setEditar(true);
    setEditMarcaId(marcaId);
    setNuevaMarca(descripcion);
    toggleCollapse(); 
  };

  const eliminarMarca = async () => {
    try {
      console.log('entra a eliminar');
      const fechaActual = new Date().toISOString(); 
      const marcaAEliminar = {
        marc_Id: elimMarcaId,
        usua_UsuarioEliminacion: 1,
        marc_FechaEliminacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Eliminar`, marcaAEliminar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log(response);
  
      listarMarcas();
      setConfirmarEliminar(false);
    } catch (error) {
      console.error('Error al eliminar marca', error);
    }
  };
  

  const eliminarMarcaClick = (marcaId) => {
    setElimMarcaId(marcaId);
    setConfirmarEliminar(true);
  };
  
  const cancelarEliminacion = () => {
    setElimMarcaId(null);
    setConfirmarEliminar(false);
  };
  

  const cancelar = () => {
    setNuevaMarca("");
    setCollapse(false);
  };

  useEffect(() => {
    listarMarcas();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarMarcaClick(row.marc_Id, row.marc_Descripcion)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate">
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarMarcaClick(row.marc_Id,row.marc_Descripcion)}>
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
                    <Form onSubmit={editarr ? editarMarca : insertarMarca}>
                        <FormGroup>
                          <Label for="marcaDescripcion">Marca</Label>
                          <Input
                            type="text"
                            name="marca"
                            id="marcaDescripcion"
                            value={nuevaMarca}
                            onChange={(e) => setNuevaMarca(e.target.value)}
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
      <SweetAlert
        title="Eliminar Marca"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarMarca}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar la marca?
      </SweetAlert>
    </Fragment>
  );
};

export default Marcas;
