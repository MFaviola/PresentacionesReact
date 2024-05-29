import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlAPI = 'https://localhost:44380/api/Estilos'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Comerciante = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editEstilosId, setEditEstilosId] = useState(null); 
  const [nuevaEstilos, setNuevaEstilos] = useState("");
  const [elimEstilosId, setElimEstilosId] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [detalleEstilos, setDetalleEstilos] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarEstilos = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar Estilos', error);
    }
  };

  const insertarEstilos = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const EstilosAInsertar = {
        esti_Descripcion: values.esti_Descripcion,
        usua_UsuarioCreacion: 1,
        esti_FechaCreacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Insertar`, EstilosAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarEstilos();
      resetForm();
      setCollapse(false);
      toast.success("Estilos insertada exitosamente!");

    } catch (error) {
      console.error('Error al insertar Estilos', error);
      toast.error("Error al insertar la Estilos.");
    }
  };

  const editarEstilos = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const EstilosAEditar = {
        esti_Id: editEstilosId, 
        esti_Descripcion: values.esti_Descripcion,
        usua_UsuarioModificacion: 1, 
        esti_FechaModificacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Editar`, EstilosAEditar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarEstilos();
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditEstilosId(null); 
      toast.success("Estilos editado exitosamente!");

    } catch (error) {
      console.error('Error al editar Estilos', error);
      toast.error("Error al editar la Estilos.");
    }
  };

  const editarEstilosClick = (EstilosId, descripcion) => {
    setEditar(true);
    setEditEstilosId(EstilosId);
    setNuevaEstilos(descripcion);
    setDetalleEstilos(null);
    setCollapse(true);
  };

  const eliminarEstilos = async () => {
    try {
      const fechaActual = new Date().toISOString(); 
      const EstilosAEliminar = {
        esti_Id: elimEstilosId,
        usua_UsuarioEliminacion: 1,
        esti_FechaEliminacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Eliminar`, EstilosAEliminar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
  
      listarEstilos();
      setConfirmarEliminar(false);
      toast.success("Estilos eliminada exitosamente!");

    } catch (error) {
      console.error('Error al eliminar Estilos', error);
      toast.error("Error al eliminar la Estilos.");
    }
  };

  const eliminarEstilosClick = (EstilosId) => {
    setElimEstilosId(EstilosId);
    setConfirmarEliminar(true);
  };

  const obtenerDetalleEstilos = async (EstilosId) => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const objeto = lista.find((list) => list.esti_Id === EstilosId);
      setDetalleEstilos(objeto);
      setEditar(false);
      setEditEstilosId(null);
      setCollapse(true);
    } catch (error) {
      console.error('Error al obtener detalles de los estilos', error);
      toast.error("Error al obtener los detalles de los estilos.");
    }
  };

  const cancelarEliminacion = () => {
    setElimEstilosId(null);
    setConfirmarEliminar(false);
  };

  const cancelar = (resetForm) => {
    resetForm();
    setCollapse(false);
    setEditar(false);
    setEditEstilosId(null);
    setNuevaEstilos(""); 
    setDetalleEstilos(null);
  };

  const cancelarr = () => {
    setCollapse(false);
    setDetalleEstilos(null);
  };

  useEffect(() => {
    listarEstilos();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarEstilosClick(row.esti_Id, row.esti_Descripcion)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetalleEstilos(row.esti_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarEstilosClick(row.esti_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const DetallesEstilos = ({ detalle }) => {
    if (!detalle) return null;

    const { esti_Id, esti_Descripcion, usuarioCreacionNombre, esti_FechaCreacion, usuarioModificacionNombre, esti_FechaModificacion } = detalle;

    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];

    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: esti_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificacionNombre, fecha: esti_FechaModificacion }
    ];

    return (
      <div>
        <Row>
          <h5><b>Detalles</b></h5>
          <hr />
          <Col md={4}>
            <FormGroup>
              <Label><b>ID</b></Label>
              <p>{esti_Id}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Descripción</b></Label>
              <p>{esti_Descripcion}</p>
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
      selector: row => row.esti_Id,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.esti_Descripcion,
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
    esti_Descripcion: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "La descripción solo debe contener letras.")
      .required("El campo es requerido."),
  });

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Estilos"
              icon="pe-7s-scissors icon-gradient bg-amy-crisp"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse}>
                  <Card>
                    <CardBody>
                      {detalleEstilos ? (
                        <DetallesEstilos detalle={detalleEstilos} />
                      ) : (
                        <Formik
                          initialValues={{ esti_Descripcion: nuevaEstilos }}
                          enableReinitialize
                          validationSchema={validationSchema}
                          onSubmit={editarr ? editarEstilos : insertarEstilos}
                        >
                          {({ handleSubmit, resetForm }) => (
                            <Form onSubmit={handleSubmit}>
                              <FormGroup>
                                <Label for="esti_Descripcion">Estilos</Label>
                                <Col sm={6} style={{ padding: 0 }}>
                                  <Field
                                    type="text"
                                    name="esti_Descripcion"
                                    as={Input}
                                    id="esti_Descripcion"
                                  />
                                  <ErrorMessage name="esti_Descripcion" component="div" style={{ color: 'red' }} />
                                </Col>
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
        title="Eliminar Estilos"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarEstilos}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar la Estilos?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default Comerciante;
