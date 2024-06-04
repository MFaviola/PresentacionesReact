import React, { Fragment, useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, FormGroup, Label } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../Layout/AppMain/PageTitle";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MultiStep from "./Wizard";
import Tap1 from './Steps2/Tap2 1';
import Tap2 from './Steps2/Tap2 2';
import Tap3 from './Steps2/Tap2 3';
import Tap4 from './Steps2/Tap2 4';
import Tap5 from './Steps2/Tap2 5'; 
// import TapFinal from './Tap Final';
import personaJuridicaAPI from './PersonaJuridicaAPI';

const PersonaJuridica = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimPersonaJuridica, setElimPersonaJuridica] = useState({ peju_Id: null, pers_Id: null });
  const [detallePersonaJuridica, setDetallePersonaJuridica] = useState(null);
  const [pejuId, setPejuId] = useState(null);
  const [editarPersonaJuridicaId, setEditarPersonaJuridicaId] = useState(null);
  const wizardRef = useRef(null);

  useEffect(() => {
    listarPersonaJuridicas();
  }, []);

  const listarPersonaJuridicas = async () => {
    try {
      const response = await personaJuridicaAPI.listarPersonaJuridicas();
      const filteredData = response.data.data.map(item => ({
        peju_Id: item.peju_Id,
        pers_Id: item.pers_Id,  
        pers_RTN: item.pers_RTN,
        pers_Nombre: item.pers_Nombre,
        ofic_Nombre: item.ofic_Nombre,
        escv_Nombre: item.escv_Nombre,
        ofpr_Nombre: item.ofpr_Nombre,
        coliniaEmpresa: item.coliniaEmpresa,
        ciudadEmpresa: item.ciudadEmpresa,
        provinciaEmpresa: item.provinciaEmpresa,
        peju_PuntoReferencia: item.peju_PuntoReferencia,
        coloniaRepresentante: item.coloniaRepresentante,
        ciudadRepresentante: item.ciudadRepresentante,
        provinciaRepresentante: item.provinciaRepresentante,
        peju_NumeroLocalRepresentante: item.peju_NumeroLocalRepresentante,
        peju_PuntoReferenciaRepresentante: item.peju_PuntoReferenciaRepresentante,
        peju_TelefonoEmpresa: item.peju_TelefonoEmpresa,
        peju_TelefonoFijoRepresentanteLegal: item.peju_TelefonoFijoRepresentanteLegal,
        peju_TelefonoRepresentanteLegal: item.peju_TelefonoRepresentanteLegal,
        peju_CorreoElectronico: item.peju_CorreoElectronico,
        peju_ContratoFinalizado: item.peju_ContratoFinalizado ? "Sí" : "No",
        peju_NumeroLocalApart: item.peju_NumeroLocalApart,
        usuarioCreacionNombre: item.usuarioCreacionNombre,
        peju_FechaCreacion: item.peju_FechaCreacion,
        usuarioModificaNombre: item.usuarioModificaNombre,
        peju_FechaModificacion: item.peju_FechaModificacion,
        peju_Estado: item.peju_Estado ? "Activo" : "Inactivo",
      }));
      setData(filteredData);
    } catch (error) {
      console.error('Error al listar PersonaJuridicas', error);
      toast.error("Error al listar los PersonaJuridicas.");
    }
  };

  const eliminarPersonaJuridica = async () => {
    try {
      await personaJuridicaAPI.eliminarPersonaJuridica(elimPersonaJuridica.peju_Id, elimPersonaJuridica.pers_Id);
      listarPersonaJuridicas();
      setConfirmarEliminar(false);
      toast.success("Persona Jurídica eliminada exitosamente!");
    } catch (error) {
      console.error('Error al eliminar PersonaJuridica', error);
      toast.error("Error al eliminar la Persona Jurídica.");
    }
  };

  const eliminarPersonaJuridicaClick = (peju_Id, pers_Id) => {
    setElimPersonaJuridica({ peju_Id, pers_Id });
    setConfirmarEliminar(true);
  };

  const cancelarEliminacion = () => {
    setElimPersonaJuridica({ peju_Id: null, pers_Id: null });
    setConfirmarEliminar(false);
  };

  const toggleCollapse = () => setCollapse(!collapse);

  const obtenerDetallePersonaJuridica = (PersonaJuridicaId) => {
    const detalle = data.find(item => item.peju_Id === PersonaJuridicaId);
    setDetallePersonaJuridica(detalle);
    setCollapse(true);
  };

  const editar = (PersonaJuridicaId) => {
    setEditarPersonaJuridicaId(PersonaJuridicaId);
    setCollapse(true);
  };

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => obtenerDetallePersonaJuridica(row.peju_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="secondary" onClick={() => editar(row.peju_Id)}>
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarPersonaJuridicaClick(row.peju_Id, row.pers_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const DetallesPersonaJuridica = ({ detalle }) => {
    if (!detalle) return null;

    const {
      pers_RTN,
      pers_Nombre,
      peju_TelefonoEmpresa,
      peju_TelefonoFijoRepresentanteLegal,
      peju_TelefonoRepresentanteLegal,
      peju_CorreoElectronico,
      coliniaEmpresa,
      ciudadEmpresa,
      provinciaEmpresa,
      peju_PuntoReferencia,
      coloniaRepresentante,
      ciudadRepresentante,
      provinciaRepresentante,
      peju_NumeroLocalRepresentante,
      peju_PuntoReferenciaRepresentante,
      usuarioCreacionNombre,
      usuarioModificaNombre,
      peju_FechaCreacion,
      peju_FechaModificacion
    } = detalle;

    const columnsDetalle = [
      { name: 'Acción', selector: row => row.accion },
      { name: 'Usuario', selector: row => row.usuario },
      { name: 'Fecha', selector: row => row.fecha },
    ];

    const dataDetalle = [
      { accion: 'Creador', usuario: usuarioCreacionNombre, fecha: peju_FechaCreacion },
      { accion: 'Modificador', usuario: usuarioModificaNombre, fecha: peju_FechaModificacion }
    ];

    return (
      <div>
        <Row>
          <h5><b>Detalles de la Persona Jurídica</b></h5>
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
              <Label><b>Teléfono Empresa</b></Label>
              <p>{peju_TelefonoEmpresa}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Teléfono Fijo Representante Legal</b></Label>
              <p>{peju_TelefonoFijoRepresentanteLegal}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Teléfono Representante Legal</b></Label>
              <p>{peju_TelefonoRepresentanteLegal}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Correo Electrónico</b></Label>
              <p>{peju_CorreoElectronico}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Colonia Empresa</b></Label>
              <p>{coliniaEmpresa}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Ciudad Empresa</b></Label>
              <p>{ciudadEmpresa}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Provincia Empresa</b></Label>
              <p>{provinciaEmpresa}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Punto de Referencia Empresa</b></Label>
              <p>{peju_PuntoReferencia}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Colonia Representante</b></Label>
              <p>{coloniaRepresentante}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Ciudad Representante</b></Label>
              <p>{ciudadRepresentante}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Provincia Representante</b></Label>
              <p>{provinciaRepresentante}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Número Local Representante</b></Label>
              <p>{peju_NumeroLocalRepresentante}</p>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label><b>Punto de Referencia Representante</b></Label>
              <p>{peju_PuntoReferenciaRepresentante}</p>
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
        <Button className="mb-2 me-2 btn-shadow" type="button" color="secondary" onClick={() => {
          setCollapse(false);
          setDetallePersonaJuridica(null);
        }}>
          Volver
        </Button>
      </div>
    );
  };

  const columns = [
    { name: "RTN", selector: row => row.pers_RTN, sortable: true },
    { name: "Nombre", selector: row => row.pers_Nombre, sortable: true },
    { name: "Oficina", selector: row => row.ofic_Nombre, sortable: true },
    { name: "Estado Civil", selector: row => row.escv_Nombre, sortable: true },
    { name: "Oficio", selector: row => row.ofpr_Nombre, sortable: true },
    { name: "Colonia Empresa", selector: row => row.coliniaEmpresa, sortable: true },
    { name: "Ciudad Empresa", selector: row => row.ciudadEmpresa, sortable: true },
    { name: "Provincia Empresa", selector: row => row.provinciaEmpresa, sortable: true },
    { name: "Punto de Referencia", selector: row => row.peju_PuntoReferencia, sortable: true },
    { name: "Colonia Representante", selector: row => row.coloniaRepresentante, sortable: true },
    { name: "Ciudad Representante", selector: row => row.ciudadRepresentante, sortable: true },
    { name: "Provincia Representante", selector: row => row.provinciaRepresentante, sortable: true },
    { name: "Número Local Representante", selector: row => row.peju_NumeroLocalRepresentante, sortable: true },
    { name: "Punto de Referencia Representante", selector: row => row.peju_PuntoReferenciaRepresentante, sortable: true },
    { name: "Teléfono Empresa", selector: row => row.peju_TelefonoEmpresa, sortable: true },
    { name: "Teléfono Fijo Representante Legal", selector: row => row.peju_TelefonoFijoRepresentanteLegal, sortable: true },
    { name: "Teléfono Representante Legal", selector: row => row.peju_TelefonoRepresentanteLegal, sortable: true },
    { name: "Correo Electrónico", selector: row => row.peju_CorreoElectronico, sortable: true },
    { name: "Contrato Finalizado", selector: row => row.peju_ContratoFinalizado, sortable: true },
    { name: "Número Local Apartamento", selector: row => row.peju_NumeroLocalApart, sortable: true },
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
    { name: "Datos Personales", component: <Tap1 initialValues={{ pers_RTN: '', pers_Nombre: '', ofic_Id: '', escv_Id: '', ofpr_Id: '' }} onNext={() => wizardRef.current.next()} setPersonaJuridicaId={setPejuId} childFormikSubmit={React.createRef()} /> },
    { name: "Dirección 1", component: <Tap2 initialValues={{ ciud_Id: '', alde_Id: '', colo_Id: '', peju_NumeroLocalApart: '', peju_PuntoReferencia: '' }} pejuId={pejuId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Dirección 2", component: <Tap3 initialValues={{ peju_CiudadIdRepresentante: '', peju_AldeaIdRepresentante: '', peju_ColoniaRepresentante: '', peju_NumeroLocalRepresentante: '', peju_PuntoReferenciaRepresentante: '' }} pejuId={pejuId} childFormikSubmit={React.createRef()} onNext={() => wizardRef.current.next()} /> },
    { name: "Contacto", component: <Tap4 initialValues={{ peju_TelefonoEmpresa: '', peju_TelefonoFijoRepresentanteLegal: '', peju_TelefonoRepresentanteLegal: '', peju_CorreoElectronico: '', peju_CorreoElectronicoAlternativo: '' }} pejuId={pejuId} onNext={() => wizardRef.current.next()} /> },
    { name: "Subir Documentación", component: <Tap5 pejuId={pejuId} /> }, 
    // { name: "Finalización", component: <TapFinal /> },
  ];

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Persona Jurídica Individual"
              icon="pe-7s-portfolio icon-gradient bg-sunny-morning"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse && !detallePersonaJuridica}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <div className="forms-wizard-alt">
                        <MultiStep ref={wizardRef} showNavigation={true} steps={steps} onCancel={() => setCollapse(false)} />
                      </div>
                    </CardBody>
                  </Card>
                </Collapse>
                <Collapse isOpen={detallePersonaJuridica !== null}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <DetallesPersonaJuridica detalle={detallePersonaJuridica} />
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
        title="Eliminar Persona Jurídica"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarPersonaJuridica}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar la Persona Jurídica?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default PersonaJuridica;
