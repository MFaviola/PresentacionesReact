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
  const [detalleMarca, setDetalleMarca] = useState(null);

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

  const insertarMarca = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const MarcaAInsertar = {
        marc_Descripcion: values.marcaDescripcion,
        usua_UsuarioCreacion: 1,
        marc_FechaCreacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Insertar`, MarcaAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarMarcas();
      resetForm();
      setCollapse(false);
      toast.success("Marca insertada exitosamente!");

    } catch (error) {
      console.error('Error al insertar marca', error);
      toast.error("Error al insertar la marca.");
    }
  };

  const editarMarca = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const marcaAEditar = {
        marc_Id: editMarcaId, 
        marc_Descripcion: values.marcaDescripcion,
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
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditMarcaId(null); 
      toast.success("Marca editada exitosamente!");

    } catch (error) {
      console.error('Error al editar marca', error);
      toast.error("Error al editar la marca.");
    }
  };

  const editarMarcaClick = (marcaId, descripcion) => {
    setEditar(true);
    setEditMarcaId(marcaId);
    setNuevaMarca(descripcion);
    console.log(nuevaMarca,'aaaaa');
    setDetalleMarca(null);
    setCollapse(true);
  };

  const eliminarMarca = async () => {
    try {
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
  
      listarMarcas();
      setConfirmarEliminar(false);
      toast.success("Marca eliminada exitosamente!");

    } catch (error) {
      console.error('Error al eliminar marca', error);
      toast.error("Error al eliminar la marca.");
    }
  };

  const eliminarMarcaClick = (marcaId) => {
    setElimMarcaId(marcaId);
    setConfirmarEliminar(true);
  };

  const obtenerDetalleMarca = async (marcaId) => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const objeto = lista.find((list) => list.marc_Id === marcaId);
      setDetalleMarca(objeto);
      setEditar(false);
      setEditMarcaId(null);
      setCollapse(true);
    } catch (error) {
      console.error('Error al obtener detalles de la marca', error);
      toast.error("Error al obtener los detalles de la marca.");
    }
  };

  const cancelarEliminacion = () => {
    setElimMarcaId(null);
    setConfirmarEliminar(false);
  };

  const cancelar = (resetForm) => {
    resetForm();
    setCollapse(false);
    setEditar(false);
    setEditMarcaId(null);
    setNuevaMarca(""); 
    setDetalleMarca(null);
  };
  const cancelarr = () => {
    setCollapse(false);
    setDetalleMarca(null);
  };

  useEffect(() => {
    listarMarcas();
  }, []);

  const botonesacciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarMarcaClick(row.marc_Id, row.marc_Descripcion)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetalleMarca(row.marc_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarMarcaClick(row.marc_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const DetallesMarca = ({ detalle }) => {
    if (!detalle) return null;
    
    const { marc_Id, marc_Descripcion, usuarioCreacionNombre, marc_FechaCreacion, usuarioModificacionNombre, marc_FechaModificacion } = detalle;
    
    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];
    
    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: marc_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificacionNombre, fecha: marc_FechaModificacion }
    ];
    
    return (
      <div>
         
          <Row>
            <h5><b>Detalles</b></h5>
            <hr></hr>
            <Col md={4}>
              <FormGroup>
                <Label><b>ID</b></Label>
                <p>{marc_Id}</p>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label><b>Marca</b></Label>
                <p>{marc_Descripcion}</p>
              </FormGroup>
            </Col>
          </Row>
          <DataTable
            data={dataDetalle}
            columns={columnsDetalle}
            fixedHeader
            fixedHeaderScrollHeight="200px"
          />
          <hr></hr>
          <Button className="mb-2 me-2 btn-shadow right" type="button" color="secondary" onClick={() => cancelarr()}>
            Volver
          </Button>
      </div>
    );
  };

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

  const validationSchema = Yup.object().shape({
    marcaDescripcion: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "La descripción solo debe contener letras.")
      .required("El campo es requerido."),
  });

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
                    {detalleMarca ? (
                        <DetallesMarca detalle={detalleMarca} />
                      ) : (
                      <Formik
                        initialValues={{ marcaDescripcion: nuevaMarca }}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={editarr ? editarMarca : insertarMarca}
                      >
                        {({ handleSubmit, resetForm }) => (
                          <Form onSubmit={handleSubmit}>
                            <FormGroup>
                              <Label for="marcaDescripcion">Marca</Label>
                              <Col sm={6} style={{ padding: 0 }}>
                                <Field
                                  type="text"
                                  name="marcaDescripcion"
                                  as={Input}
                                  id="marcaDescripcion"
                                />
                                <ErrorMessage name="marcaDescripcion" component="div" style={{ color: 'red' }} />
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
      <ToastContainer />
    </Fragment>
  );
};

export default Marcas;
