import React, { Fragment, useState, useEffect,useRef  } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MultiStep from "./Wizard";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
// import Step6 from "./Steps/Step6";

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Comerciante = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimComercianteId, setElimComercianteId] = useState(null);
  const [elimPersId, setElimPersId] = useState(null);
  const [detalleComerciante, setDetalleComerciante] = useState(null);
  const [editarComercianteId, setEditarComercianteId] = useState(null); 

  const toggleCollapse = () => setCollapse(!collapse);
  const wizardRef = useRef(null);

  const listarComerciantes = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
      console.log(response);
    } catch (error) {
      toast.error("Error al listar los comerciantes.");
    }
  };

  const eliminarComerciante = async () => {
    try {
      const params = new URLSearchParams({
        coin_Id: elimComercianteId,
        pers_Id: elimPersId,
      });
  
      const response = await axios.post(`${urlAPI}/Eliminar?${params.toString()}`, null, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
  
      listarComerciantes();
      setConfirmarEliminar(false);
      console.log(response);
      toast.success("Comerciante eliminado exitosamente!");
  
    } catch (error) {
      console.error('Error al eliminar Comerciante', error);
      toast.error("Error al eliminar el comerciante.");
    }
  };
  

  const eliminarComercianteClick = (ComercianteId, PersId) => {
    setElimComercianteId(ComercianteId);
    setElimPersId(PersId);
    setConfirmarEliminar(true);
  };

  const obtenerDetalleComerciante = async (ComercianteId) => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const objeto = lista.find((list) => list.coin_Id === ComercianteId);
      setDetalleComerciante(objeto);
      setCollapse(true);
    } catch (error) {
      console.error('Error al obtener detalles del comerciante', error);
      toast.error("Error al obtener los detalles del comerciante.");
    }
  };

  const cancelarEliminacion = () => {
    setElimComercianteId(null);
    setElimPersId(null);
    setConfirmarEliminar(false);
  };

  const cancelarr = () => {
    setCollapse(false);
    setDetalleComerciante(null);
    setEditarComercianteId(null); 
  };

  useEffect(() => {
    listarComerciantes();
  }, []);

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editar(row.coin_Id)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetalleComerciante(row.coin_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarComercianteClick(row.coin_Id, row.pers_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const editar = (coinid) => {
    setEditarComercianteId(coinid);
    setCollapse(true);
  };

  const DetallesComerciante = ({ detalle }) => {
    if (!detalle) return null;

    const {
      pers_RTN,
      pers_Nombre,
      coin_TelefonoCelular,
      coin_TelefonoFijo,
      coin_CorreoElectronico,
      alde_Nombre,
      escv_Nombre,
      ofic_Nombre,
      ofpr_Nombre,
      colo_Nombre,
      ciud_Nombre,
      pvin_Nombre,
      formaRepresentacionDesc,
      usuarioCreacionNombre,
      usuarioModificacionNombre,
      coin_FechaCreacion,
      coin_FechaModificacion
    } = detalle;

    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];

    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: coin_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificacionNombre, fecha: coin_FechaModificacion }
    ];

    return (
      <div>
        <Row>
          <h5><b>Detalles del Comerciante</b></h5>
          <hr />
          <Col md={4}>
            <FormGroup>
              <Label><b>RTN</b></Label>
              <p>{pers_RTN}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Nombre</b></Label>
              <p>{pers_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Estado Civil</b></Label>
              <p>{escv_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Oficina</b></Label>
              <p>{ofic_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Oficio</b></Label>
              <p>{ofpr_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Colonia</b></Label>
              <p>{colo_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Ciudad</b></Label>
              <p>{ciud_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Aldea</b></Label>
              <p>{alde_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Estado</b></Label>
              <p>{pvin_Nombre}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Forma de Representación</b></Label>
              <p>{formaRepresentacionDesc}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Teléfono Celular</b></Label>
              <p>{coin_TelefonoCelular}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Teléfono Fijo</b></Label>
              <p>{coin_TelefonoFijo}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Correo Electrónico</b></Label>
              <p>{coin_CorreoElectronico}</p>
            </FormGroup>
          </Col>
        </Row>
        <DataTable
          data={dataDetalle}
          columns={columnsDetalle}
          fixedHeader
          fixedHeaderScrollHeight="200px"
        />
        <hr/>
        <Button className="mb-2 me-2 btn-shadow" type="button" color="secondary" onClick={() => cancelarr()}>
          Volver
        </Button>
      </div>
    );
  };

  const columns = [
    {
      name: "RTN",
      selector: row => row.pers_RTN,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: row => row.pers_Nombre,
      sortable: true,
    },
    {
      name: "Correo Electronico",
      selector: row => row.coin_CorreoElectronico,
      sortable: true,
    },
    {
      name: "Telefono Celular",
      selector: row => row.coin_TelefonoCelular,
      sortable: true,
    },
    {
      name: "Oficio",
      selector: row => row.ofpr_Nombre,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => botonesAcciones(row),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "250px", 
    }
  ];

  const steps = [
    { name: "Datos Personales", component: <Step1 ideditar={editarComercianteId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Dirección", component: <Step2 ideditar={editarComercianteId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Dirección Representante", component: <Step3 ideditar={editarComercianteId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Contacto", component: <Step5 ideditar={editarComercianteId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Documentos", component: <Step6 ideditar={editarComercianteId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Finalizar", component: <Step4 /> },
  ];

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Comerciante Individual"
              icon="pe-7s-portfolio icon-gradient bg-sunny-morning"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse && !detalleComerciante}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <div className="forms-wizard-alt">
                      <MultiStep ref={wizardRef} showNavigation={true}  steps={steps} onCancel={() => {
                        setCollapse(false);
                        listarComerciantes();
                      }}/>
                      </div>
                    </CardBody>
                  </Card>
                </Collapse>
                <Collapse isOpen={detalleComerciante !== null}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <DetallesComerciante detalle={detalleComerciante} />
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
        title="Eliminar Comerciante"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarComerciante}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar el comerciante?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default Comerciante;
