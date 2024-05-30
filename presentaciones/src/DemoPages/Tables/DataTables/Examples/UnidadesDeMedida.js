import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Servicios from '../../../../Servicios/UnidadesDeMedidaServices';

console.log(Servicios); // Verifica qué se está importando

const UnidadesDeMedidas = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editUnidadesDeMedidasId, setEditUnidadesDeMedidasId] = useState(null); 
  const [nuevaUnidadesDeMedidas, setNuevaUnidadesDeMedidas] = useState({ unme_Descripcion: "", unme_EsAduana: false });
  const [elimUnidadesDeMedidasId, setElimUnidadesDeMedidasId] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [detalleUnidadesDeMedidas, setDetalleUnidadesDeMedidas] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarUnidadesDeMedidas = async () => {
    try {
      const response = await Servicios.listarUnidadesDeMedidas();
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Datos recibidos de la API:', data); // Verifica que es un array
      setData(data);
    } catch (error) {
      console.error('Error al listar UnidadesDeMedidas', error);
    }
  };

  const insertarUnidadesDeMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAInsertar = {
        unme_Descripcion: values.unme_Descripcion,
        unme_EsAduana: values.unme_EsAduana, 
        usua_UsuarioCreacion: 1,
        unme_FechaCreacion: fechaActual,
      };

      console.log('Datos enviados para insertar:', UnidadesDeMedidasAInsertar); 

      await Servicios.insertarUnidadesDeMedidas(UnidadesDeMedidasAInsertar);
      await listarUnidadesDeMedidas();
      resetForm();
      setCollapse(false);
      toast.success("UnidadesDeMedidas insertada exitosamente!");

    } catch (error) {
      console.error('Error al insertar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al insertar la UnidadesDeMedidas.");
    }
  };

  const editarUnidadesDeMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAEditar = {
        unme_Id: editUnidadesDeMedidasId, 
        unme_Descripcion: values.unme_Descripcion,
        unme_EsAduana: values.unme_EsAduana, 
        usua_UsuarioModificacion: 1, 
        unme_FechaModificacion: fechaActual,
      };

      console.log('Datos enviados para editar:', UnidadesDeMedidasAEditar); 

      await Servicios.editarUnidadesDeMedidas(UnidadesDeMedidasAEditar);
      await listarUnidadesDeMedidas();
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditUnidadesDeMedidasId(null); 
      toast.success("UnidadesDeMedidas editada exitosamente!");

    } catch (error) {
      console.error('Error al editar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al editar la UnidadesDeMedidas.");
    }
  };

  const editarUnidadesDeMedidasClick = (UnidadesDeMedidasId, descripcion, esAduana) => {
    setEditar(true);
    setEditUnidadesDeMedidasId(UnidadesDeMedidasId);
    setNuevaUnidadesDeMedidas({ unme_Descripcion: descripcion, unme_EsAduana: esAduana });
    setDetalleUnidadesDeMedidas(null);
    setCollapse(true);
  };

  const eliminarUnidadesDeMedidas = async () => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAEliminar = {
        unme_Id: elimUnidadesDeMedidasId,
        usua_UsuarioEliminacion: 1,
        unme_FechaEliminacion: fechaActual
      };

      await Servicios.eliminarUnidadesDeMedidas(UnidadesDeMedidasAEliminar);
      await listarUnidadesDeMedidas();
      setConfirmarEliminar(false);
      toast.success("UnidadesDeMedidas eliminada exitosamente!");

    } catch (error) {
      console.error('Error al eliminar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al eliminar la UnidadesDeMedidas.");
    }
  };

  const obtenerDetalleUnidadesDeMedidas = async (UnidadesDeMedidasId) => {
    try {
      const response = await Servicios.listarUnidadesDeMedidas();
      const lista = response.data;
      const objeto = lista.find((list) => list.unme_Id === UnidadesDeMedidasId);
      setDetalleUnidadesDeMedidas(objeto);
      setEditar(false);
      setEditUnidadesDeMedidasId(null);
      setCollapse(true);
    } catch (error) {
      console.error('Error al obtener detalles de la unidad de medida', error);
      toast.error("Error al obtener los detalles de la unidad de medida.");
    }
  };

  const eliminarUnidadesDeMedidasClick = (UnidadesDeMedidasId) => {
    setElimUnidadesDeMedidasId(UnidadesDeMedidasId);
    setConfirmarEliminar(true);
  };

  const cancelarEliminacion = () => {
    setElimUnidadesDeMedidasId(null);
    setConfirmarEliminar(false);
  };

  const cancelar = (resetForm) => {
    resetForm();
    setCollapse(false);
    setEditar(false);
    setEditUnidadesDeMedidasId(null);
    setNuevaUnidadesDeMedidas({ unme_Descripcion: "", unme_EsAduana: false });  
    setDetalleUnidadesDeMedidas(null);
  };

  const cancelarr = () => {
    setCollapse(false);
    setDetalleUnidadesDeMedidas(null);
  };

  useEffect(() => {
    listarUnidadesDeMedidas();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarUnidadesDeMedidasClick(row.unme_Id, row.unme_Descripcion, row.unme_EsAduana)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetalleUnidadesDeMedidas(row.unme_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarUnidadesDeMedidasClick(row.unme_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const DetallesUnidadesDeMedidas = ({ detalle }) => {
    if (!detalle) return null;

    const { unme_Id, unme_Descripcion, unme_EsAduana, usuarioCreacionNombre, unme_FechaCreacion, usuarioModificacionNombre, unme_FechaModificacion } = detalle;

    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];

    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: unme_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificacionNombre, fecha: unme_FechaModificacion }
    ];

    return (
      <div>
        <Row>
          <h5><b>Detalles</b></h5>
          <hr />
          <Col md={4}>
            <FormGroup>
              <Label><b>ID</b></Label>
              <p>{unme_Id}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Descripción</b></Label>
              <p>{unme_Descripcion}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Es Aduana</b></Label>
              <p>{unme_EsAduana ? "Sí" : "No"}</p>
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
      selector: row => row.unme_EsAduana ? "Sí" : "No",
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
    unme_Descripcion: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "La descripción solo debe contener letras.")
      .required("El campo es requerido."),
  });

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Unidades De Medidas"
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
                      {detalleUnidadesDeMedidas ? (
                        <DetallesUnidadesDeMedidas detalle={detalleUnidadesDeMedidas} />
                      ) : (
                        <Formik
                          initialValues={nuevaUnidadesDeMedidas}
                          enableReinitialize
                          validationSchema={validationSchema}
                          onSubmit={editarr ? editarUnidadesDeMedidas : insertarUnidadesDeMedidas}
                        >
                          {({ handleSubmit, resetForm, values, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                              <Row>
                              <Col md={6}>
                              <FormGroup>
                                <Label for="unme_Descripcion">Unidad de Medida</Label>
                                  <Field
                                    type="text"
                                    name="unme_Descripcion"
                                    as={Input}
                                    id="unme_Descripcion"
                                  />
                                  <ErrorMessage name="unme_Descripcion" component="div" style={{ color: 'red' }} />
                              </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="unme_EsAduana">¿Es Aduana?</Label>
                                  <Col sm={6} style={{ padding: 0 }}>
                                  <Field
                                    type="checkbox"
                                    name="unme_EsAduana"
                                    as={Input}
                                    checked={values.unme_EsAduana}
                                    onChange={() => setFieldValue('unme_EsAduana', !values.unme_EsAduana)}
                                    id="unme_EsAduana"
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
      <SweetAlert
        title="Eliminar UnidadesDeMedidas"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarUnidadesDeMedidas}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar la UnidadesDeMedidas?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default UnidadesDeMedidas;
