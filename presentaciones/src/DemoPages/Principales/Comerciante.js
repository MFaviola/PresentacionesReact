import React, { Fragment, useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  Input,
  ButtonGroup,
  Container,Collapse, FormGroup, Label
} from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";
import { faCommentDots, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';
const urlOficina = 'https://localhost:44380/api/Oficinas'; 
const urlCivil = 'https://localhost:44380/api/EstadosCiviles'; 
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones'; 

const Comerciante = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimComercianteId, setElimComercianteId] = useState(null);
  const [elimPersId, setElimPersId] = useState(null);
  const [detalleComerciante, setDetalleComerciante] = useState(null);
  const [editarComercianteId, setEditarComercianteId] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [insertado, setInsertado] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarComerciantes = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
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
      toast.success("Comerciante eliminado exitosamente!");

    } catch (error) {
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

  
  const listarOficinas = async () => {
    try {
      const response = await axios.get(`${urlOficina}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setDataOficina(response.data.data);
    } catch (error) {
      toast.error("Error al listar las oficinas.");
    }
  };

  const listarCiviles = async () => {
    try {
      const response = await axios.get(`${urlCivil}/Listar?escv_EsAduana=false`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        }
      });
      setDataCivil(response.data.data);
    } catch (error) {
      toast.error("Error al listar los estados civiles.");
    }
  };

  const listarOficios = async () => {
    try {
      const response = await axios.get(`${urlOficios}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setDataOficios(response.data.data);
    } catch (error) {
      toast.error("Error al listar los oficios.");
    }
  };

  const listarProvincias = async () => {
    const response = await axios.get(`${urlProvincia}/Listar?pvin_EsAduana=false`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataProvincia(response.data.data|| []);
};

const listarCiudades = async (provinciaId) => {
  try {
    const response = await axios.get(`${urlCiudad}/CiudadesFiltradaPorProvincias?pvin_Id=${provinciaId}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataCiudad(response.data.data || []);
  } catch (error) {
    toast.error("Error al listar las ciudades.");
  }
};

const listarAldeas = async (ciudadId) => {
  try {
    const response = await axios.get(`${urlAldea}/FiltrarPorCiudades?alde_Id=${ciudadId}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada,
      }
    });
    setDataAldea(response.data || []);
  } catch (error) {
    toast.error("Error al listar las aldeas.");
  }
};

const listarColonias = async (ciudadId) => {
  try {
    const response = await axios.get(`${urlColonia}/FiltrarPorCiudad?ciud_Id=${ciudadId}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataColonia(response.data || []);
  } catch (error) {
    toast.error("Error al listar las colonias.");
  }
};

  useEffect(() => {
    listarComerciantes();
    listarComerciantes2();
     listarOficinas();
     listarCiviles();
     listarOficios();
     listarProvincias();
  }, []);

  const ProvinciaCambio = async (event, setFieldValue) => {
    const provinciaId = event.target.value;
    setSelectedProvincia(provinciaId);
    setFieldValue('pvin_Id', provinciaId);
    await listarCiudades(provinciaId);
  };

  const CiudadCambio = async (event, setFieldValue) => {
    const ciudadId = event.target.value;
    console.log(ciudadId);
    setSelectedCiudad(ciudadId);
    setFieldValue('ciud_Id', ciudadId);
    await listarAldeas(ciudadId);
    await listarColonias(ciudadId);
  };

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
        <hr />
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

  const toggle = (tab, values) => {
    if (activeTab !== tab) {
      if (tab === "2" && !values.pers_RTN) {
        toast.error("Debe completar y guardar los datos del Tab 1 antes de continuar.");
        return;
      }
      setActiveTab(tab);
      setShowPreviousBtn(tab !== "1");
      setShowNextBtn(tab !== "3");
    }
  };
  
  
  

  const validationSchema = Yup.object().shape({
    pers_RTN: Yup.string()
      .required("El RTN es requerido.")
      .matches(/^\d{4}-\d{4}-\d{6}$/, "El RTN debe tener el formato 1234-5678-901232 y solo contener números y guiones."),
    pers_Nombre: Yup.string()
      .required("El nombre es requerido.")
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo debe contener letras y acentos."),
    ofic_Id: Yup.number().required("La oficina es requerida."),
    escv_Id: Yup.number().required("El estado civil es requerido."),
    ofpr_Id: Yup.number().required("El oficio es requerido."),
    pers_escvRepresentante: Yup.number().required("El estado civil del representante es requerido."),
    pers_OfprRepresentante: Yup.number().required("El oficio del representante es requerido."),
  });

  const submitTab1 = async (values, { setSubmitting }) => {
    console.log('entra');
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertarr = {
      pers_RTN: values.pers_RTN,
      pers_Nombre: values.pers_Nombre,
      ofic_Id: values.ofic_Id,
      escv_Id: values.escv_Id,
      ofpr_Id: values.ofpr_Id,
      pers_FormaRepresentacion: values.pers_FormaRepresentacion,
      pers_escvRepresentante: values.pers_escvRepresentante,
      pers_OfprRepresentante: values.pers_OfprRepresentante,
      usua_UsuarioCreacion: 1,
      coin_FechaCreacion: fechaActual
    };
  
    const rtnvalidado = /^\d{4}-\d{4}-\d{6}$/.test(values.pers_RTN);
    console.log('comerciante insertado', ComercianteAInsertarr, 'rtn es valido?', rtnvalidado);
  
    if (rtnvalidado) {
      try {
        const response = await axios.post(`${urlAPI}/Insertar`, ComercianteAInsertarr, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        toast.success("Datos guardados correctamente.");
        setActiveTab("2");
        setShowPreviousBtn(true);
        setShowNextBtn(true);
      } catch (error) {
        toast.error("Error al guardar los datos.");
      }
    } else {
      toast.error("El RTN no es válido.");
    }
    setSubmitting(false);
  };

  const urlProvincia = 'https://localhost:44380/api/Provincias';
const urlCiudad = 'https://localhost:44380/api/Ciudades';
const urlAldea = 'https://localhost:44380/api/Aldea';
const urlColonia = 'https://localhost:44380/api/Colonias';

  const validationSchema2 = Yup.object().shape({
    pvin_Id: Yup.number().required("La provincia es requerida."),
    ciud_Id: Yup.number().required("La ciudad es requerida."),
    alde_Id: Yup.number().required("La aldea es requerida."),
    colo_Id: Yup.number().required("La colonia es requerida."),
    coin_NumeroLocalApart: Yup.string()
      .required("El número local del apartamento es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El número local solo debe contener letras y números."),
    coin_PuntoReferencia: Yup.string()
      .required("El punto de referencia es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."),
  });

  const listarComerciantes2 = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const ultimoObjeto = lista[lista.length - 1];
      setInsertado(ultimoObjeto.coin_Id);
    } catch (error) {
      toast.error("Error al listar los comerciantes.");
    }
  };
  

  const submitTab2 = async (values, { setSubmitting }) => {
    console.log('entra');
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertar = {
      coin_Id: insertado,
      ciud_Id: values.ciud_Id,
      alde_Id: values.alde_Id,
      colo_Id: values.colo_Id,
      coin_NumeroLocalApart: values.coin_NumeroLocalApart,
      coin_PuntoReferencia: values.coin_PuntoReferencia,
      usua_UsuarioCreacion: 1,
      coin_FechaCreacion: fechaActual
    };
    console.log('insertar2',ComercianteAInsertar);


      try {
        const response = await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        toast.success("Datos guardados correctamente.");
        setActiveTab("3");
        setShowPreviousBtn(true);
        setShowNextBtn(true);
      } catch (error) {
        toast.error("Error al guardar los datos.");
      }
    setSubmitting(false);
  };
  

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
                      <CSSTransition component="div" classNames="TabsAnimation" appear={true} timeout={0} enter={false} exit={false}>
                              <Card className="mb-3">
                                <CardHeader className="tabs-lg-alternate">
                                  <Nav justified>
                                    <NavItem>
                                      <NavLink href="#" className={classnames({ active: activeTab === "1" })} onClick={() => toggle("1")}>
                                        <div className="widget-number">Tab 1</div>
                                        <div className="tab-subheading">
                                          <span className="pe-2 opacity-6">
                                            <FontAwesomeIcon icon={faCommentDots} />
                                          </span>
                                          Datos Personales
                                        </div>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink href="#" className={classnames({ active: activeTab === "2" })} onClick={() => toggle("2")}>
                                        <div className="widget-number">Tab 2</div>
                                        <div className="tab-subheading">Dirección</div>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink href="#" className={classnames({ active: activeTab === "3" })} onClick={() => toggle("3")}>
                                        <div className="widget-number text-danger">Tab 3</div>
                                        <div className="tab-subheading">
                                          <span className="pe-2 opacity-6">
                                            <FontAwesomeIcon icon={faBullhorn} />
                                          </span>
                                          Contacto
                                        </div>
                                      </NavLink>
                                    </NavItem>
                                  </Nav>
                                </CardHeader>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId="1">
                                    <CardBody>
                                    <Formik
  initialValues={{
    pers_RTN: "",
    pers_Nombre: "",
    ofic_Id: "",
    escv_Id: "",
    ofpr_Id: "",
    pers_FormaRepresentacion: false,
    pers_escvRepresentante: "",
    pers_OfprRepresentante: ""
  }}
  validationSchema={validationSchema}
  onSubmit={submitTab1}
>
  {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_RTN">RTN</Label>
            <Field
              name="pers_RTN"
              as={Input}
              className="form-control"
              placeholder="Ingrese su RTN.."
            />
            <ErrorMessage name="pers_RTN" component="div" className="text-danger" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_Nombre">Nombre</Label>
            <Field
              name="pers_Nombre"
              as={Input}
              className="form-control"
              placeholder="Ingrese su nombre.."
            />
            <ErrorMessage name="pers_Nombre" component="div" className="text-danger" />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="ofic_Id">Oficina</Label>
            <Field
              name="ofic_Id"
              as="select"
              className="form-control"
            >
              <option value="">Seleccione su oficina</option>
              {dataOficina.map(oficina => (
                <option key={oficina.ofic_Id} value={oficina.ofic_Id}>{oficina.ofic_Nombre}</option>
              ))}
            </Field>
            <ErrorMessage name="ofic_Id" component="div" className="text-danger" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="escv_Id">Estado Civil</Label>
            <Field
              name="escv_Id"
              as="select"
              className="form-control"
            >
              <option value="">Seleccione su estado civil</option>
              {dataCivil.map(civil => (
                <option key={civil.escv_Id} value={civil.escv_Id}>
                  {civil.escv_Nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage name="escv_Id" component="div" className="text-danger" />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="ofpr_Id">Oficio</Label>
            <Field
              name="ofpr_Id"
              as="select"
              className="form-control"
            >
              <option value="">Seleccione su oficio</option>
              {dataOficios.map(oficio => (
                <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
                  {oficio.ofpr_Nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage name="ofpr_Id" component="div" className="text-danger" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_FormaRepresentacion">Forma de representacion</Label>
            <Col sm={12} style={{ padding: 0 }}>
              <Field
                type="checkbox"
                name="pers_FormaRepresentacion"
                as={Input}
                checked={values.pers_FormaRepresentacion}
                onChange={() => setFieldValue('pers_FormaRepresentacion', !values.pers_FormaRepresentacion)}
                id="pers_FormaRepresentacion"
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_escvRepresentante">Estado Civil Representante</Label>
            <Field
              name="pers_escvRepresentante"
              as="select"
              className="form-control"
            >
              <option value="">Seleccione el estado civil del representante</option>
              {dataCivil.map(civil => (
                <option key={civil.escv_Id} value={civil.escv_Id}>
                  {civil.escv_Nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage name="pers_escvRepresentante" component="div" className="text-danger" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_OfprRepresentante">Oficio Representante</Label>
            <Field
              name="pers_OfprRepresentante"
              as="select"
              className="form-control"
            >
              <option value="">Seleccione el oficio del representante</option>
              {dataOficios.map(oficio => (
                <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
                  {oficio.ofpr_Nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage name="pers_OfprRepresentante" component="div" className="text-danger" />
          </FormGroup>
        </Col>
      </Row>
      <Button
        color="primary"
        className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
        style={showNextBtn ? {} : { display: "none" }}
        onClick={() => handleSubmit()} 
        disabled={isSubmitting}
      >
        Siguiente
      </Button>

      <ToastContainer />
    </Form>
  )}
</Formik>

                                    </CardBody>
                                  </TabPane>
                                  <TabPane tabId="2">
                                    <CardBody>
                                    <Formik
                                     initialValues={{
                                      pvin_Id: "",
                                      ciud_Id: "",
                                      alde_Id: "",
                                      colo_Id: "",
                                      pvin_Id: "",
                                       coin_NumeroLocalApart: "",
                                       coin_PuntoReferencia: ""
                                     }}
                                     validationSchema={validationSchema2}
                                     onSubmit={submitTab2}
                                   >
                                     {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                                       <Form onSubmit={handleSubmit}>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="pvin_Id">Provincia</Label>
                                             <Field
                                               name="pvin_Id"
                                               as="select"
                                               className="form-control"
                                               onChange={(e) => ProvinciaCambio(e, setFieldValue)}
                                             >
                                               <option value="">Seleccione su provincia</option>
                                               {dataProvincia.map(provincia => (
                                                 <option key={provincia.pvin_Id} value={provincia.pvin_Id}>{provincia.pvin_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="pvin_Id" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="ciud_Id">Ciudad</Label>
                                             <Field
                                               name="ciud_Id"
                                               as="select"
                                               className="form-control"
                                               onChange={(e) => CiudadCambio(e, setFieldValue)}
                                             >
                                               <option value="">Seleccione su ciudad</option>
                                               {dataCiudad.map(ciudad => (
                                                 <option key={ciudad.ciud_Id} value={ciudad.ciud_Id}>{ciudad.ciud_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="ciud_Id" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="alde_Id">Aldea</Label>
                                             <Field
                                               name="alde_Id"
                                               as="select"
                                               className="form-control"
                                             >
                                               <option value="">Seleccione su aldea</option>
                                               {dataAldea.map(aldea => (
                                                 <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="alde_Id" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="colo_Id">Colonia</Label>
                                             <Field
                                               name="colo_Id"
                                               as="select"
                                               className="form-control"
                                             >
                                               <option value="">Seleccione su colonia</option>
                                               {dataColonia.map(colonia => (
                                                 <option key={colonia.colo_Id} value={colonia.colo_Id}>{colonia.colo_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="colo_Id" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_NumeroLocalApart">Número Local del Apartamento</Label>
                                             <Field
                                               name="coin_NumeroLocalApart"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su número local..."
                                             />
                                             <ErrorMessage name="coin_NumeroLocalApart" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_PuntoReferencia">Punto de Referencia</Label>
                                             <Field
                                               name="coin_PuntoReferencia"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su punto de referencia..."
                                             />
                                             <ErrorMessage name="coin_PuntoReferencia" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Button
                                         color="secondary"
                                         className="btn-shadow float-start btn-wide btn-pill"
                                         outline
                                         onClick={() => setActiveTab("1")}
                                       >
                                         Volver
                                       </Button>
                                       <Button
                                         color="primary"
                                         className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
                                         type="submit"
                                         disabled={isSubmitting}
                                       >
                                         Siguiente
                                       </Button>
                                       <ToastContainer />
                                     </Form>
                                     )}
                                   </Formik>

                                    </CardBody>
                                  </TabPane>
                                  <TabPane tabId="3">
                                    <CardBody>
                                      <p className="mb-0">
                                        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                      </p>
                                    </CardBody>
                                  </TabPane>
                                </TabContent>
                              </Card>
                      </CSSTransition>
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

