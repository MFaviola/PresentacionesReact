import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, FormGroup, Label } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../Layout/AppMain/PageTitle";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MultiStep from "./Wizard";
import Tap1 from './Tap 1';
import Tap2 from './Tap 2';
import Tap3 from './Tap 3';
import Tap4 from './Tap 4';
import personaJuridicaAPI from './PersonaJuridicaAPI';

const PersonaJuridica = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimPersonaJuridicaId, setElimPersonaJuridicaId] = useState(null);
  const [detallePersonaJuridica, setDetallePersonaJuridica] = useState(null);

  useEffect(() => {
    listarPersonaJuridicas();
  }, []);

  const listarPersonaJuridicas = async () => {
    try {
      const response = await personaJuridicaAPI.listarPersonaJuridicas();
      const filteredData = response.data.data.map(item => ({
        peju_Id: item.peju_Id,
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
      const fechaActual = new Date().toISOString();
      const PersonaJuridicaAEliminar = {
        PersonaJuridica_Id: elimPersonaJuridicaId,
        usua_UsuarioEliminacion: 1,
        PersonaJuridica_FechaEliminacion: fechaActual
      };
      await personaJuridicaAPI.eliminarPersonaJuridica(PersonaJuridicaAEliminar);

      listarPersonaJuridicas();
      setConfirmarEliminar(false);
      toast.success("PersonaJuridica eliminado exitosamente!");

    } catch (error) {
      console.error('Error al eliminar PersonaJuridica', error);
      toast.error("Error al eliminar el PersonaJuridica.");
    }
  };

  const eliminarPersonaJuridicaClick = (PersonaJuridicaId) => {
    setElimPersonaJuridicaId(PersonaJuridicaId);
    setConfirmarEliminar(true);
  };

  const cancelarEliminacion = () => {
    setElimPersonaJuridicaId(null);
    setConfirmarEliminar(false);
  };

  const toggleCollapse = () => setCollapse(!collapse);

  const obtenerDetallePersonaJuridica = (PersonaJuridicaId) => {
    const detalle = data.find(item => item.peju_Id === PersonaJuridicaId);
    setDetallePersonaJuridica(detalle);
    setCollapse(true);
  };

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => obtenerDetallePersonaJuridica(row.peju_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="secondary" >
        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarPersonaJuridicaClick(row.peju_Id)}>
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
      name: "Oficina",
      selector: row => row.ofic_Nombre,
      sortable: true,
    },
    {
      name: "Estado Civil",
      selector: row => row.escv_Nombre,
      sortable: true,
    },
    {
      name: "Oficio",
      selector: row => row.ofpr_Nombre,
      sortable: true,
    },
    {
      name: "Colonia Empresa",
      selector: row => row.coliniaEmpresa,
      sortable: true,
    },
    {
      name: "Ciudad Empresa",
      selector: row => row.ciudadEmpresa,
      sortable: true,
    },
    {
      name: "Provincia Empresa",
      selector: row => row.provinciaEmpresa,
      sortable: true,
    },
    {
      name: "Punto de Referencia",
      selector: row => row.peju_PuntoReferencia,
      sortable: true,
    },
    {
      name: "Colonia Representante",
      selector: row => row.coloniaRepresentante,
      sortable: true,
    },
    {
      name: "Ciudad Representante",
      selector: row => row.ciudadRepresentante,
      sortable: true,
    },
    {
      name: "Provincia Representante",
      selector: row => row.provinciaRepresentante,
      sortable: true,
    },
    {
      name: "Número Local Representante",
      selector: row => row.peju_NumeroLocalRepresentante,
      sortable: true,
    },
    {
      name: "Punto de Referencia Representante",
      selector: row => row.peju_PuntoReferenciaRepresentante,
      sortable: true,
    },
    {
      name: "Teléfono Empresa",
      selector: row => row.peju_TelefonoEmpresa,
      sortable: true,
    },
    {
      name: "Teléfono Fijo Representante Legal",
      selector: row => row.peju_TelefonoFijoRepresentanteLegal,
      sortable: true,
    },
    {
      name: "Teléfono Representante Legal",
      selector: row => row.peju_TelefonoRepresentanteLegal,
      sortable: true,
    },
    {
      name: "Correo Electrónico",
      selector: row => row.peju_CorreoElectronico,
      sortable: true,
    },
    {
      name: "Contrato Finalizado",
      selector: row => row.peju_ContratoFinalizado ? "Sí" : "No",
      sortable: true,
    },
    {
      name: "Número Local Apartamento",
      selector: row => row.peju_NumeroLocalApart,
      sortable: true,
    },
    {
      name: "Usuario Creación",
      selector: row => row.usuarioCreacionNombre,
      sortable: true,
    },
    {
      name: "Fecha Creación",
      selector: row => new Date(row.peju_FechaCreacion).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Usuario Modificación",
      selector: row => row.usuarioModificaNombre,
      sortable: true,
    },
    {
      name: "Fecha Modificación",
      selector: row => new Date(row.peju_FechaModificacion).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Estado",
      selector: row => row.peju_Estado ? "Activo" : "Inactivo",
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

  const insertarPersonaJuridica = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString();
    const valuesWithExtras = {
      ...values,
      usua_UsuarioCreacion: 1,
      peju_FechaCreacion: fechaActual
    };
    try {
      const response = await personaJuridicaAPI.insertarPersonaJuridica(valuesWithExtras);
      toast.success("Datos personales insertados exitosamente!");
      setSubmitting(false);
    } catch (error) {
      console.error('Error al insertar datos personales', error);
      toast.error("Error al insertar datos personales.");
      setSubmitting(false);
    }
  };

  const steps = [
    { name: "Datos Personales", component: <Tap1 initialValues={{ pers_RTN: '', pers_Nombre: '', ofic_Id: '', escv_Id: '', ofpr_Id: '' }} onNext={() => MultiStep.next()} onSubmit={insertarPersonaJuridica} /> },
    { name: "Dirección 1", component: <Tap2 initialValues={{ ciud_Id: '', alde_Id: '', colo_Id: '', peju_NumeroLocalApart: '', peju_PuntoReferencia: '' }} /> },
    { name: "Dirección 2", component: <Tap3 initialValues={{ peju_CiudadIdRepresentante: '', peju_AldeaIdRepresentante: '', peju_ColoniaRepresentante: '', peju_NumeroLocalRepresentante: '', peju_PuntoReferenciaRepresentante: '' }} /> },
    { name: "Contacto", component: <Tap4 initialValues={{ peju_TelefonoEmpresa: '', peju_TelefonoFijoRepresentanteLegal: '', peju_TelefonoRepresentanteLegal: '', peju_CorreoElectronico: '', peju_CorreoElectronicoAlternativo: '' }} /> },
  ];

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="PersonaJuridica Individual"
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
                        <MultiStep showNavigation={true} steps={steps} onCancel={() => setCollapse(false)} />
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
        title="Eliminar PersonaJuridica"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarPersonaJuridica}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar el PersonaJuridica?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default PersonaJuridica;
