import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlAPI = 'https://localhost:44380/api/UnidadMedidas'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const UnidadMedidas = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editUnidadMedidasId, setEditUnidadMedidasId] = useState(null); 
  const [nuevaUnidadMedidas, setNuevaUnidadMedidas] = useState("");
  const [elimUnidadMedidasId, setElimUnidadMedidasId] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarUnidadMedidas = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar UnidadMedidas', error);
    }
  };

  const insertarUnidadMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadMedidasAInsertar = {
        unme_Descripcion: values.UnidadMedidasDescripcion,
        unme_EsAduana: values.unme_EsAduana,
        usua_UsuarioCreacion: 1,
        unme_FechaCreacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Insertar`, UnidadMedidasAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarUnidadMedidas();
      resetForm();
      setCollapse(false);
      toast.success("UnidadMedidas insertada exitosamente!");

    } catch (error) {
      console.error('Error al insertar UnidadMedidas', error);
      toast.error("Error al insertar la UnidadMedidas.");
    }
  };

  const editarUnidadMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadMedidasAEditar = {
        unme_Id: editUnidadMedidasId, 
        unme_Descripcion: values.UnidadMedidasDescripcion,
        unme_EsAduana: values.unme_EsAduana,
        usua_UsuarioModificacion: 1, 
        unme_FechaModificacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Editar`, UnidadMedidasAEditar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarUnidadMedidas();
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditUnidadMedidasId(null); 
      toast.success("UnidadMedidas editada exitosamente!");

    } catch (error) {
      console.error('Error al editar UnidadMedidas', error);
      toast.error("Error al editar la UnidadMedidas.");
    }
  };

  const editarUnidadMedidasClick = (UnidadMedidasId, descripcion, esAduana) => {
    setEditar(true);
    setEditUnidadMedidasId(UnidadMedidasId);
    setNuevaUnidadMedidas(descripcion);
    setCollapse(true);
  };

  const eliminarUnidadMedidas = async () => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadMedidasAEliminar = {
        unme_Id: elimUnidadMedidasId,
        usua_UsuarioEliminacion: 1,
        unme_FechaEliminacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Eliminar`, UnidadMedidasAEliminar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
  
      listarUnidadMedidas();
      setConfirmarEliminar(false);
      toast.success("UnidadMedidas eliminada exitosamente!");

    } catch (error) {
      console.error('Error al eliminar UnidadMedidas', error);
      toast.error("Error al eliminar la UnidadMedidas.");
    }
  };

  const eliminarUnidadMedidasClick = (UnidadMedidasId) => {
    setElimUnidadMedidasId(UnidadMedidasId);
    setConfirmarEliminar(true);
  };

  const cancelarEliminacion = () => {
    setElimUnidadMedidasId(null);
    setConfirmarEliminar(false);
  };

  const cancelar = (resetForm) => {
    resetForm();
    setCollapse(false);
    setEditar(false);
    setEditUnidadMedidasId(null);
    setNuevaUnidadMedidas(""); 
  };

  useEffect(() => {
    listarUnidadMedidas();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarUnidadMedidasClick(row.unme_Id, row.unme_Descripcion, row.unme_EsAduana)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarUnidadMedidasClick(row.unme_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const columns = [
    {
      name: "ID",
      selector: row => row.unme_Id,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.unme_Descripcion,
      sortable: true,
    },
    {
      name: "Es Aduana",
      selector: row => (row.unme_EsAduana ? 'Sí' : 'No'),
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

  const validationSchema = Yup.object().shape({
    UnidadMedidasDescripcion: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "La descripción solo debe contener letras.")
      .required("El campo es requerido."),
  });

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="UnidadMedidas"
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
                      <Formik
                        initialValues={{ UnidadMedidasDescripcion: nuevaUnidadMedidas, unme_EsAduana: false }}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={editarr ? editarUnidadMedidas : insertarUnidadMedidas}
                      >
                        {({ handleSubmit, resetForm, values }) => (
                          <Form onSubmit={handleSubmit}>
                            <FormGroup>
                              <Label for="UnidadMedidasDescripcion">UnidadMedidas</Label>
                              <Col sm={6} style={{ padding: 0 }}>
                                <Field
                                  type="text"
                                  name="UnidadMedidasDescripcion"
                                  as={Input}
                                  id="UnidadMedidasDescripcion"
                                />
                                <ErrorMessage name="UnidadMedidasDescripcion" component="div" style={{ color: 'red' }} />
                              </Col>
                            </FormGroup>
                            <FormGroup check>
                              <Label check>
                                <Field
                                  type="checkbox"
                                  name="unme_EsAduana"
                                  checked={values.unme_EsAduana}
                                />{' '}
                                Es Aduana
                              </Label>
                            </FormGroup>
                            <Button className="mb-2 me-2 btn-shadow" type="submit" color="primary">
                              Enviar
                            </Button>
                            <Button className="mb-2 me-2 btn-shadow" type="button" color="secondary" onClick={() => cancelar(resetForm)}>
                              Cancelar
                            </Button>
                          </Form>
                        )}
                      </Formik>
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
        title="Eliminar UnidadMedidas"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarUnidadMedidas}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar la UnidadMedidas?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default UnidadMedidas;
