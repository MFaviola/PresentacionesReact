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

const urlAPI = 'https://localhost:44380/api/Paises'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Paises = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editPaisesId, setEditPaisesId] = useState(null); 
  const [nuevaPaises, setNuevaPaises] = useState({ pais_Codigo: "", pais_Nombre: "", pais_prefijo: "", pais_EsAduana: false });
  const [detallePaises, setDetallePaises] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarPaises = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar Paises', error);
    }
  };

  const insertarPaises = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const PaisesAInsertar = {
        pais_Codigo: values.pais_Codigo,
        pais_Nombre: values.pais_Nombre,
        pais_prefijo: values.pais_prefijo,
        pais_EsAduana: values.pais_EsAduana,
        usua_UsuarioCreacion: 1,
        pais_FechaCreacion: fechaActual
      };

      console.log('Datos enviados para insertar:', PaisesAInsertar);

      const response = await axios.post(`${urlAPI}/Insertar`, PaisesAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      await listarPaises();
      resetForm();
      setCollapse(false);
      toast.success("Paises insertado exitosamente!");

    } catch (error) {
      console.error('Error al insertar Paises:', error.response.data); // Mostrar el error específico
      toast.error("Error al insertar el Paises.");
    }
  };

  const editarPaises = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const PaisesAEditar = {
        pais_Codigo: editPaisesId,
        pais_Nombre: values.pais_Nombre,
        pais_prefijo: values.pais_prefijo,
        pais_EsAduana: values.pais_EsAduana,
        usua_UsuarioModificacion: 1,
        pais_FechaModificacion: fechaActual
      };

      console.log('Datos enviados para editar:', PaisesAEditar);

      const response = await axios.post(`${urlAPI}/Editar`, PaisesAEditar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      await listarPaises();
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditPaisesId(null);
      toast.success("Paises editado exitosamente!");

    } catch (error) {
      console.error('Error al editar Paises:', error.response.data); // Mostrar el error específico
      toast.error("Error al editar el Paises.");
    }
  };

  const editarPaisesClick = (PaisesId, nombre, prefijo, esAduana) => {
    setEditar(true);
    setEditPaisesId(PaisesId);
    setNuevaPaises({ pais_Codigo: PaisesId, pais_Nombre: nombre, pais_prefijo: prefijo, pais_EsAduana: esAduana });
    setCollapse(true);
    setDetallePaises(null);
  };
  const obtenerDetallePaises = async (PaisesId) => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const objeto = lista.find((list) => list.pais_Codigo === PaisesId);
      setDetallePaises(objeto);
      setEditar(false);
      setEditPaisesId(null);
      setCollapse(true);
    } catch (error) {
      console.error('Error al obtener detalles del país', error);
      toast.error("Error al obtener los detalles del país.");
    }
  };


  const cancelar = (resetForm) => {
    resetForm();
    setCollapse(false);
    setEditar(false);
    setEditPaisesId(null);
    setNuevaPaises({ pais_Codigo: "", pais_Nombre: "", pais_prefijo: "", pais_EsAduana: false });
    setDetallePaises(null);
  };

  const cancelarr = () => {
    setCollapse(false);
    setDetallePaises(null);
  };

  useEffect(() => {
    listarPaises();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarPaisesClick(row.pais_Codigo, row.pais_Nombre, row.pais_prefijo, row.pais_EsAduana)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetallePaises(row.pais_Codigo)}>
        Detalles
      </Button>
    </div>
  );

  const DetallesPaises = ({ detalle }) => {
    if (!detalle) return null;

    const { pais_Codigo, pais_Nombre, pais_prefijo, pais_EsAduana, usuarioCreacionNombre, pais_FechaCreacion, usuarioModificacionNombre, pais_FechaModificacion } = detalle;

    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];

    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: pais_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificacionNombre, fecha: pais_FechaModificacion }
    ];

    return (
      <div>
        <Row>
          <h5><b>Detalles</b></h5>
          <hr />
          <Col md={4}>
            <FormGroup>
              <Label><b>Código</b></Label>
              <p>{pais_Codigo}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Nombre</b></Label>
              <p>{pais_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Prefijo</b></Label>
              <p>{pais_prefijo}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Es Aduana</b></Label>
              <p>{pais_EsAduana ? "Sí" : "No"}</p>
            </FormGroup>
          </Col>
        </Row>
        <DataTable
          data={dataDetalle}
          columns={columnsDetalle}
          fixedHeader
          fixedHeaderScrollHeight="200px"
        />
        <hr />
        <Button className="mb-2 me-2 btn-shadow right" type="button" color="secondary" onClick={() => cancelarr()}>
          Volver
        </Button>
      </div>
    );
  };

  const columns = [
    {
      name: "Código",
      selector: row => row.pais_Codigo,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: row => row.pais_Nombre,
      sortable: true,
    },
    {
      name: "Prefijo",
      selector: row => row.pais_prefijo,
      sortable: true,
    },
    {
      name: "Es Aduana",
      selector: row => row.pais_EsAduana ? "Sí" : "No",
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
    pais_Codigo: Yup.string()
      .matches(/^[a-zA-Z]{2}$/, "El código solo debe contener dos letras.")
      .required("El campo es requerido."),
    pais_Nombre: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "El nombre solo debe contener letras.")
      .required("El campo es requerido."),
    pais_prefijo: Yup.string()
      .matches(/^\d{4}$/, "El prefijo debe contener exactamente 4 números.")
      .required("El campo es requerido."),
  });

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Paises"
              icon="pe-7s-flag icon-gradient bg-mixed-hopes"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse}>
                  <Card>
                    <CardBody>
                      {detallePaises ? (
                        <DetallesPaises detalle={detallePaises} />
                      ) : (
                        <Formik
                          initialValues={nuevaPaises}
                          enableReinitialize
                          validationSchema={validationSchema}
                          onSubmit={editarr ? editarPaises : insertarPaises}
                        >
                          {({ handleSubmit, resetForm, values, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="pais_Codigo">Código</Label>
                                  <Field
                                    type="text"
                                    name="pais_Codigo"
                                    as={Input}
                                    id="pais_Codigo"
                                  />
                                  <ErrorMessage name="pais_Codigo" component="div" style={{ color: 'red' }} />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="pais_Nombre">Nombre</Label>
                                  <Field
                                    type="text"
                                    name="pais_Nombre"
                                    as={Input}
                                    id="pais_Nombre"
                                  />
                                  <ErrorMessage name="pais_Nombre" component="div" style={{ color: 'red' }} />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="pais_prefijo">Prefijo</Label>
                                  <Field
                                    type="text"
                                    name="pais_prefijo"
                                    as={Input}
                                    id="pais_prefijo"
                                  />
                                  <ErrorMessage name="pais_prefijo" component="div" style={{ color: 'red' }} />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="pais_EsAduana">¿Es Aduana?</Label>
                                  <Col sm={6} style={{ padding: 0 }}>
                                  <Field
                                    type="checkbox"
                                    name="pais_EsAduana"
                                    as={Input}
                                    checked={values.pais_EsAduana}
                                    onChange={() => setFieldValue('pais_EsAduana', !values.pais_EsAduana)}
                                    id="pais_EsAduana"
                                  />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Button className="mb-2 me-2 btn-shadow" type="submit" color="primary">
                              Enviar
                            </Button>
                            <Button className="mb-2 me-2 btn-shadow" type="button" color="secondary" onClick={() => cancelar(resetForm)}>
                              Cancelar
                            </Button>
                          </Form>
                          
                          )}
                        </Formik>
                      )}
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
      <ToastContainer />
    </Fragment>
  );
};

export default Paises;
