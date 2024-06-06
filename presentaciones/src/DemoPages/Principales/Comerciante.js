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
  Container,Collapse, FormGroup, Label,
  InputGroupText, InputGroup
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
import { Upload, Modal, Tooltip } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';
const urlOficina = 'https://localhost:44380/api/Oficinas'; 
const urlCivil = 'https://localhost:44380/api/EstadosCiviles'; 
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones'; 
const urlProvincia = 'https://localhost:44380/api/Provincias';
const urlCiudad = 'https://localhost:44380/api/Ciudades';
const urlAldea = 'https://localhost:44380/api/Aldea';
const urlColonia = 'https://localhost:44380/api/Colonias';
const urlDocumento = 'https://localhost:44380/api/DocumentosContratos';

const Comerciante = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimComercianteId, setElimComercianteId] = useState(null);
  const [elimPersId, setElimPersId] = useState(null);
  const [detalleComerciante, setDetalleComerciante] = useState(null);
  const [editarr, setEditar] = useState(false); 
const [editComercianteId, setEditComercianteId] = useState(null); 
const [editPersId, setEditPersId] = useState(null);
const [nueva1, setNueva1] = useState({
    pers_RTN: "",
    pers_Nombre:"",
    ofic_Id:"",
    escv_Id: "",
    ofpr_Id: "",
    pers_FormaRepresentacion: false,
    pers_escvRepresentante: "",
    pers_OfprRepresentante: ""
});
const [nueva2, setNueva2] = useState({
    pvin_Id: "",
    ciud_Id: "",
    alde_Id: "",
    colo_Id: "",
    coin_NumeroLocalApart: "",
    coin_PuntoReferencia: ""
});
const [nueva3, setNueva3] = useState({
    pvin_IdRepresentante: "",
    coin_CiudadRepresentante: "",
    coin_AldeaRepresentante: "",
    coin_coloniaIdRepresentante: "",
    coin_NumeroLocaDepartRepresentante: "",
    coin_PuntoReferenciaReprentante: ""
});
const [nueva4, setNueva4] = useState({
    coin_TelefonoCelular: "",
    coin_TelefonoFijo:"",
    coin_CorreoElectronico: "",
    coin_CorreoElectronicoAlternativo: ""
});
  const [activeTab, setActiveTab] = useState("1");
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataProvincia2, setDataProvincia2] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [dataCiudad2, setDataCiudad2] = useState([]);
  const [dataAldea2, setDataAldea2] = useState([]);
  const [dataColonia2, setDataColonia2] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [selectedProvincia2, setSelectedProvincia2] = useState("");
  const [selectedCiudad2, setSelectedCiudad2] = useState("");
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [dejarpasar, setdejarpasar] = useState(false);
  const [insertado, setInsertado] = useState(null);
  const [confirmacionCodigo, setConfirmacionCodigo] = useState('');
  const [enviarCodigo, setEnviarCodigo] = useState('');
  const [confirmacionCodigoAlternativo, setConfirmacionCodigoAlternativo] = useState('');
  const [enviarCodigoAlternativo, setEnviarCodigoAlternativo] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
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

  

  const cancelarEliminacion = () => {
    setElimComercianteId(null);
    setElimPersId(null);
    setConfirmarEliminar(false);
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
  const listarProvincias2 = async () => {
    const response = await axios.get(`${urlProvincia}/Listar?pvin_EsAduana=false`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataProvincia2(response.data.data|| []);
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

const listarCiudades2 = async (provinciaId2) => {
  try {
    const response = await axios.get(`${urlCiudad}/CiudadesFiltradaPorProvincias?pvin_Id=${provinciaId2}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataCiudad2(response.data.data || []);
  } catch (error) {
    toast.error("Error al listar las ciudades.");
  }
};

const listarAldeas2 = async (ciudadId2) => {
  try {
    const response = await axios.get(`${urlAldea}/FiltrarPorCiudades?alde_Id=${ciudadId2}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada,
      }
    });
    setDataAldea2(response.data || []);
  } catch (error) {
    toast.error("Error al listar las aldeas.");
  }
};

const listarColonias2 = async (ciudadId2) => {
  try {
    const response = await axios.get(`${urlColonia}/FiltrarPorCiudad?ciud_Id=${ciudadId2}`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setDataColonia2(response.data || []);
  } catch (error) {
    toast.error("Error al listar las colonias.");
  }
};


 

  const ProvinciaCambio = async (event, setFieldValue) => {
    const provinciaId = event.target.value;
    console.log(provinciaId);
    setSelectedProvincia(provinciaId);
    setFieldValue('pvin_Id', provinciaId);
    await listarCiudades(provinciaId);
  };

  const ProvinciaCambio2 = async (event, setFieldValue) => {
    const provinciaId2 = event.target.value;
    console.log(provinciaId2);
    setSelectedProvincia2(provinciaId2);
    setFieldValue('pvin_IdRepresentante', provinciaId2);
    await listarCiudades2(provinciaId2);
  };

  const CiudadCambio = async (event, setFieldValue) => {
    const ciudadId = event.target.value;
    console.log(ciudadId);
    setSelectedCiudad(ciudadId);
    setFieldValue('ciud_Id', ciudadId);
    await listarAldeas(ciudadId);
    await listarColonias(ciudadId);
  };
  const CiudadCambio2 = async (event, setFieldValue) => {
    const ciudadId2 = event.target.value;
    console.log(ciudadId2);
    setSelectedCiudad2(ciudadId2);
    setFieldValue('coin_CiudadRepresentante', ciudadId2);
    await listarAldeas2(ciudadId2);
    await listarColonias2(ciudadId2);
  };

  useEffect(() => {
    listarComerciantes();
   listarComerciantes2();
     listarOficinas();
     listarCiviles();
     listarOficios();
     listarProvincias();
     listarProvincias2();
  }, []);


  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarComercianteClick(row.coin_Id,row.pers_Id,row.pers_RTN
,row.pers_Nombre,row.ofic_Id,row.escv_Id,row.ofpr_Id,row.pers_FormaRepresentacion,row.pers_escvRepresentante,row.pers_OfprRepresentante,row.pvin_Id,row.ciud_Id,row.alde_Id,row.colo_Id,row.coin_NumeroLocalApart,row.coin_PuntoReferencia,row.pvin_IdRepresentante,row.coin_CiudadRepresentante,row.coin_AldeaRepresentante,row.coin_coloniaIdRepresentante,row.coin_NumeroLocaDepartRepresentante,row.coin_PuntoReferenciaReprentante,row.coin_TelefonoCelular,row.coin_TelefonoFijo,row.coin_CorreoElectronico,row.coin_CorreoElectronicoAlternativo)}>
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

  const editarComerciante = async (values, { setSubmitting }) => {
    dejarpasar(true);

    const fechaActual = new Date().toISOString();
    let ComercianteAEditar = {
      coin_Id: editComercianteId,
      pers_Id:editPersId,
      pers_RTN:values.pers_rtn,
      pers_Nombre:values.pers_Nombre,
      ofpr_Id:values.ofpr_Id,
      ofic_Id:values.ofic_Id,
      escv_Id:values.escv_Id,
      pers_escvRepresentante: values.pers_escvRepresentante,
      pers_OfprRepresentante: values.pers_OfprRepresentante,
      pers_FormaRepresentacion: values.pers_FormaRepresentacion,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual
    };
    console.log('editar1',ComercianteAEditar);


      try {
        const response = await axios.post(`${urlAPI}/Editar`, ComercianteAEditar, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });

        setActiveTab("2");
        setActiveTab("3");
        setActiveTab("4");
        setActiveTab("5");
        setShowPreviousBtn(true);
        dejarpasar(true);

        setShowNextBtn(true);
      } catch (error) {
        toast.error("Error al guardar los datos.");
      }
    setSubmitting(false);
  };


  const editarComercianteClick = (ComercianteId, PersId, rtn, nombre, oficid, escvid, ofprid, formarepre, persescv, persofpr, pvinid, ciudid, aldeid, coloid, numerolocal, puntorefe, pvinrepre, ciudadrepre, aldrearepre, coloniaidrepre, numerolocalrepre, puntoreferepre, celular, fijo, correo, correoalternativo) => {
    setEditar(true);
    setEditComercianteId(ComercianteId);
    setEditPersId(PersId);
    setNueva1({ pers_RTN: rtn, pers_Nombre: nombre, ofic_Id: oficid, escv_Id: escvid, ofpr_Id: ofprid, pers_FormaRepresentacion: formarepre, pers_escvRepresentante: persescv, pers_OfprRepresentante: persofpr });
    setNueva2({ pvin_Id: pvinid, ciud_Id: ciudid, alde_Id: aldeid, colo_Id: coloid, coin_NumeroLocalApart: numerolocal, coin_PuntoReferencia: puntorefe });
    setNueva3({ pvin_IdRepresentante: pvinrepre, coin_CiudadRepresentante: ciudadrepre, coin_AldeaRepresentante: aldrearepre, coin_coloniaIdRepresentante: coloniaidrepre, coin_NumeroLocaDepartRepresentante: numerolocalrepre, coin_PuntoReferenciaReprentante: puntoreferepre });
    setNueva4({ coin_TelefonoCelular: celular, coin_TelefonoFijo: fijo, coin_CorreoElectronico: correo, coin_CorreoElectronicoAlternativo: correoalternativo });
    setDetalleComerciante(null);
    setCollapse(true);
    setActiveTab("1");
};

  useEffect(() => {
    console.log("nueva1:", nueva1);
    console.log("nueva2:", nueva2);
    console.log("nueva3:", nueva3);
    console.log("nueva4:", nueva4);
  }, [nueva1, nueva2, nueva3, nueva4]);

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
    setEditar(false);
    setEditComercianteId(null);
    setEditPersId(null);
    setCollapse(true);
  } catch (error) {
    toast.error("Error al obtener los detalles del comerciante.");
  }
};

const cancelarr = () => {
  setCollapse(false);
  setDetalleComerciante(null);
  setEditComercianteId(null);
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

  const toggle = (tab) => {
    if (activeTab !== tab) {
      if (tab === "2" && !dejarpasar) {
        return;
      } else if (tab === "3" && !dejarpasar) {
        return;
      }else if (tab === "4" && !dejarpasar) {
        return;
      }else if (tab === "5" && !dejarpasar) {
        return;
      }else if (tab === "6" && !dejarpasar) {
        return;
      }
  
      setActiveTab(tab);
      setShowPreviousBtn(tab !== "1");
      setShowNextBtn(tab !== "6");
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

  const validationSchema3 = Yup.object().shape({
    pvin_IdRepresentante: Yup.number().required("La provincia es requerida."),
    coin_CiudadRepresentante: Yup.number().required("La ciudad es requerida."),
    coin_AldeaRepresentante: Yup.number().required("La aldea es requerida."),
    coin_coloniaIdRepresentante: Yup.number().required("La colonia es requerida."),
    coin_NumeroLocaDepartRepresentante: Yup.string()
      .required("El número local del apartamento es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El número local solo debe contener letras y números."),
    coin_PuntoReferenciaReprentante: Yup.string()
      .required("El punto de referencia es requerido.")
  });

  const validationSchema4 = Yup.object().shape({
    coin_TelefonoCelular: Yup.string()
      .matches(/^\d+$/, "El teléfono celular solo debe contener números.")
      .required("El teléfono celular es requerido."),
    coin_TelefonoFijo: Yup.string()
      .required("El teléfono fijo es requerido."),
    coin_CorreoElectronico: Yup.string()
      .email("El correo electrónico no es válido.")
      .required("El correo electrónico es requerido."),
    coin_CorreoElectronicoAlternativo: Yup.string()
      .email("El correo electrónico alternativo no es válido.")
      .required("El correo electrónico alternativo es requerido.")
  });

  const validationSchema5 = Yup.object().shape({
    doco_URLImagen: Yup.mixed().required('La imagen es requerida'),
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

  const submitTab1 = async (values, { setSubmitting }) => {
    console.log('entra');
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertarr = {};

    if (editarr) {
      let ComercianteAEditar = {
        coin_Id: editComercianteId,
        pers_Id:editPersId,
        pers_RTN:values.pers_rtn,
        pers_Nombre:values.pers_Nombre,
        ofpr_Id:values.ofpr_Id,
        ofic_Id:values.ofic_Id,
        escv_Id:values.escv_Id,
        pers_escvRepresentante: values.pers_escvRepresentante,
        pers_OfprRepresentante: values.pers_OfprRepresentante,
        pers_FormaRepresentacion: values.pers_FormaRepresentacion,
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual
      };
      console.log('editar1',ComercianteAEditar);
  
          const response = await axios.post(`${urlAPI}/Editar`, ComercianteAEditar, {
            headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
            }
          });
  
          setActiveTab("2");
          setActiveTab("3");
          setActiveTab("4");
          setActiveTab("5");
          setShowPreviousBtn(true);
          dejarpasar(true);
  
          setShowNextBtn(true);
  } else {
    ComercianteAInsertarr = {
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
      listarComerciantes2();

      setActiveTab("2");
      setShowPreviousBtn(true);
      dejarpasar(true);

      setShowNextBtn(true);
    } catch (error) {
    }
  } else {
    toast.error("El RTN no es válido.");
  }
  }
    setSubmitting(false);
  };

 

  const submitTab2 = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertar = {
      coin_Id: insertado,
      ciud_Id: values.ciud_Id,
      alde_Id: values.alde_Id,
      colo_Id: values.colo_Id,
      coin_NumeroLocalApart: values.coin_NumeroLocalApart,
      coin_PuntoReferencia: values.coin_PuntoReferencia,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual
    };
    console.log('insertar2',ComercianteAInsertar);


      try {
        const response = await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        setActiveTab("3");
        setShowPreviousBtn(true);
        dejarpasar(true);
        setShowNextBtn(true);
      } catch (error) {
      }
    setSubmitting(false);
  };
  
  const submitTab3 = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertar = {
      coin_Id: insertado,
      coin_CiudadRepresentante: values.coin_CiudadRepresentante,
      coin_AldeaRepresentante: values.coin_AldeaRepresentante,
      coin_coloniaIdRepresentante: values.coin_coloniaIdRepresentante,
      coin_NumeroLocaDepartRepresentante: values.coin_NumeroLocaDepartRepresentante,
      coin_PuntoReferenciaReprentante: values.coin_PuntoReferenciaReprentante,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual
    };
    console.log('insertar3',ComercianteAInsertar);


      try {
        const response = await axios.post(`${urlAPI}/InsertarTap3`, ComercianteAInsertar, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        setActiveTab("4");
        setShowPreviousBtn(true);
        dejarpasar(true);
        setShowNextBtn(true);
      } catch (error) {
      }
    setSubmitting(false);
  };
  
  const submitTab4 = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString();
    let ComercianteAInsertar = {
      coin_Id: insertado,
      coin_TelefonoCelular: values.coin_TelefonoCelular,
      coin_TelefonoFijo: values.coin_TelefonoFijo,
      coin_CorreoElectronico: values.coin_CorreoElectronico,
      coin_CorreoElectronicoAlternativo: values.coin_CorreoElectronicoAlternativo,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual
    };
    console.log('insertar4',ComercianteAInsertar);


      try {
        const response = await axios.post(`${urlAPI}/InsertarTap4`, ComercianteAInsertar, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        setActiveTab("5");
        setShowPreviousBtn(true);
        dejarpasar(true);
        setShowNextBtn(true);
      } catch (error) {
      }
    setSubmitting(false);
  };

  const codigoenviado = async (correo) => {
    const fechaActual = new Date().toISOString(); 

    const insertarcorreo = {
        coin_Id: insertado,
        coin_CorreoElectronico: correo,
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual,
        coin_TelefonoCelular: "",
        coin_TelefonoFijo: "",
        coin_CorreoElectronicoAlternativo: "",
    };
    console.log(insertarcorreo);

    try {
        await axios.post(`${urlAPI}/InsertarTap4`, insertarcorreo, {
            headers: {
                'XApiKey': keyAPI,
                'EncryptionKey': keyencriptada
            }
        });

        const response = await axios.get(`${urlAPI}/EnviarCodigo?correo=${correo}`, {
            headers: {
                'XApiKey': keyAPI,
                'EncryptionKey': keyencriptada
            }
        });

        console.log(response);

        toast.success("Código enviado con éxito!");
    } catch (error) {
        toast.error("Error al enviar el código.");
    }
};

  
const confirmarcodigo = async (codigo) => {
  try {
      const response = await axios.post(`${urlAPI}/ConfirmarCodigo?codigo=${codigo}`, {}, {
          headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
          }
      });

      if (response.data.message === "Exito") {
          toast.success("Correo confirmado con éxito!");
      } else {
          toast.error("Código incorrecto.");
      }
  } catch (error) {
      toast.error("Código incorrecto.");
  }
};

  const codigoenviadoalternativo = async (correoalternativo) => {
    const fechaActual = new Date().toISOString(); 

    const insertarcorreo = {
        coin_Id: insertado,
        coin_CorreoElectronico: "",
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual,
        coin_TelefonoCelular: "",
        coin_TelefonoFijo: "",
        coin_CorreoElectronicoAlternativo: correoalternativo,
    };
    console.log(insertarcorreo);

    try {
        await axios.post(`${urlAPI}/InsertarTap4`, insertarcorreo, {
            headers: {
                'XApiKey': keyAPI,
                'EncryptionKey': keyencriptada
            }
        });

        const response = await axios.get(`${urlAPI}/EnviarCodigo2?correo=${correoalternativo}`, {
            headers: {
                'XApiKey': keyAPI,
                'EncryptionKey': keyencriptada
            }
        });

        console.log(response);

        toast.success("Código enviado con éxito!");
    } catch (error) {
        toast.error("Error al enviar el código.");
    }
};

const handleImageChange = async (event, setFieldValue) => {
  const file = event.currentTarget.files[0];
  setFieldValue("doco_URLImagen", file);
  setPreviewImage(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post('https://api.imgbb.com/1/upload?key=55c70c0d0085c37a2b71725303f42f0e', formData);

    setImageUrl(response.data.data.url);
    setShowPreviousBtn(true);

    toast.success('Imagen subida correctamente');
  } catch (error) {
    toast.error('Error al subir la imagen. Asegúrese que sea un formato válido.');
  }
};

const handleSubmit = async (values, { setSubmitting }) => {
  if (!imageUrl) {
    toast.error("Primero sube una imagen válida.");
    setSubmitting(false);
    return;
  }

  const formData = {
    coin_Id: insertado,
    doco_URLImagen: imageUrl,
    usua_UsuarioCreacion: 1,
    doco_FechaCreacion: new Date().toISOString(),
  };

  try {
    const response = await axios.post(`${urlDocumento}/InsertarDocuComerciante`, formData, {

      headers: {
        'Content-Type': 'application/json',
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    console.log('Insert response: golaaaa', response.data);
    toast.success("Documento subido correctamente");
    setActiveTab("6");
        setShowPreviousBtn(true);
        dejarpasar(true);
        setShowNextBtn(true);
  } catch (error) {
    toast.error("Error al subir el documento.");
  }
  setSubmitting(false);

};

const handlePreview = () => {
  setPreviewVisible(true);
};

const handleCancel = () => setPreviewVisible(false);
  
const confirmarcodigoalternativo = async (codigoalternativo) => {
  try {
      const response = await axios.post(`${urlAPI}/ConfirmarCodigo2?codigo=${codigoalternativo}`, {}, {
          headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
          }
      });

      if (response.data.message === "Exito") {
          toast.success("Correo confirmado con éxito!");
      } else {
          toast.error("Código incorrecto.");
      }
  } catch (error) {
      toast.error("Código incorrecto.");
  }
};

const finalizar = async () => {
  await axios.post(`${urlAPI}/FinalizarContrato?coin_Id=${insertado}`, {}, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
  setCollapse(false);
  listarComerciantes();
  toast.success("Datos guardados con exito!");


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
                                          Datos Representante
                                        </div>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink href="#" className={classnames({ active: activeTab === "4" })} onClick={() => toggle("4")}>
                                        <div className="widget-number text-danger">Tab 4</div>
                                        <div className="tab-subheading">
                                          <span className="pe-2 opacity-6">
                                            <FontAwesomeIcon icon={faBullhorn} />
                                          </span>
                                          Contacto
                                        </div>
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink href="#" className={classnames({ active: activeTab === "5" })} onClick={() => toggle("5")}>
                                        <div className="widget-number text-danger">Tab 5</div>
                                        <div className="tab-subheading">
                                          <span className="pe-2 opacity-6">
                                            <FontAwesomeIcon icon={faBullhorn} />
                                          </span>
                                          Documentos
                                        </div>
                                      </NavLink>
                                    </NavItem>
                                    {!editarr && (
    <NavItem>
        <NavLink href="#" className={classnames({ active: activeTab === "6" })} onClick={() => toggle("6")}>
            <div className="widget-number text-danger">Tab 6</div>
            <div className="tab-subheading">
                <span className="pe-2 opacity-6">
                    <FontAwesomeIcon icon={faBullhorn} />
                </span>
                Guardar
            </div>
        </NavLink>
    </NavItem>
)}

                                  </Nav>
                                </CardHeader>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId="1">
                                    <CardBody>
                                    <Formik
  initialValues={{nueva1}}
  enableReinitialize
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
                            type="text"
                            name="pers_RTN"
                            as={Input}
                            id="pers_RTN"
                        />
            <ErrorMessage name="pers_RTN" component="div" className="text-danger" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="pers_Nombre">Nombre</Label>
            <Field
                type="text"
                name="pers_Nombre"
                as={Input}
                id="pers_Nombre"
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
      <hr></hr>
      {editarr && (
    <Button
        color="secondary"
        className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
        outline
        onClick={() => {
            setCollapse(false);
            listarComerciantes();
        }}
    >
        Volver al Inicio
    </Button>
)}


      <Button
        color="primary"
        className="btn-shadow btn-wide float-end btn-pill btn-hover-shine mb-2 me-2"
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
                                     initialValues={{nueva2}}
                                     enableReinitialize
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
                                       <hr></hr>
                                       <Button
                                         color="secondary"
                                         className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
                                         outline
                                         onClick={() => setActiveTab("1")}
                                       >
                                         Volver
                                       </Button>
                                       {editarr && (
    <Button
        color="secondary"
        className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
        outline
        onClick={() => {
            setCollapse(false);
            listarComerciantes();
        }}
    >
        Volver al Inicio
    </Button>
)}


                                       <Button
                                         color="primary"
                                         className="btn-shadow btn-wide float-end btn-pill btn-hover-shine mb-2 me-2"
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
                                    <Formik
                                     initialValues={{nueva3}}
                                     enableReinitialize
                                     validationSchema={validationSchema3}
                                     onSubmit={submitTab3}
                                   >
                                     {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                                       <Form onSubmit={handleSubmit}>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="pvin_IdRepresentante">Provincia Representante</Label>
                                             <Field
                                               name="pvin_IdRepresentante"
                                               as="select"
                                               className="form-control"
                                               onChange={(e) => ProvinciaCambio2(e, setFieldValue)}
                                             >
                                               <option value="">Seleccione la provincia</option>
                                               {dataProvincia2.map(provincia => (
                                                 <option key={provincia.pvin_Id} value={provincia.pvin_Id}>{provincia.pvin_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="pvin_IdRepresentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_CiudadRepresentante">Ciudad Representante</Label>
                                             <Field
                                               name="coin_CiudadRepresentante"
                                               as="select"
                                               className="form-control"
                                               onChange={(e) => CiudadCambio2(e, setFieldValue)}
                                             >
                                               <option value="">Seleccione la ciudad</option>
                                               {dataCiudad2.map(ciudad => (
                                                 <option key={ciudad.ciud_Id} value={ciudad.ciud_Id}>{ciudad.ciud_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="coin_CiudadRepresentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_AldeaRepresentante">Aldea Representante</Label>
                                             <Field
                                               name="coin_AldeaRepresentante"
                                               as="select"
                                               className="form-control"
                                             >
                                               <option value="">Seleccione la aldea</option>
                                               {dataAldea2.map(aldea => (
                                                 <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="coin_AldeaRepresentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_coloniaIdRepresentante">Colonia Representante</Label>
                                             <Field
                                               name="coin_coloniaIdRepresentante"
                                               as="select"
                                               className="form-control"
                                             >
                                               <option value="">Seleccione la colonia</option>
                                               {dataColonia2.map(colonia => (
                                                 <option key={colonia.colo_Id} value={colonia.colo_Id}>{colonia.colo_Nombre}</option>
                                               ))}
                                             </Field>
                                             <ErrorMessage name="coin_coloniaIdRepresentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_NumeroLocaDepartRepresentante">Número Local del Apartamento de Representante</Label>
                                             <Field
                                               name="coin_NumeroLocaDepartRepresentante"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese el número local.."
                                             />
                                             <ErrorMessage name="coin_NumeroLocaDepartRepresentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_PuntoReferenciaReprentante">Punto de Referencia de Representante</Label>
                                             <Field
                                               name="coin_PuntoReferenciaReprentante"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese el punto de referencia.."
                                             />
                                             <ErrorMessage name="coin_PuntoReferenciaReprentante" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <hr></hr>
                                       <Button
                                         color="secondary"
                                         className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
                                         outline
                                         onClick={() => setActiveTab("2")}
                                       >
                                         Volver
                                       </Button>
                                       {editarr && (
    <Button
        color="secondary"
        className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
        outline
        onClick={() => {
            setCollapse(false);
            listarComerciantes();
        }}
    >
        Volver al Inicio
    </Button>
)}

                                       <Button
                                         color="primary"
                                         className="btn-shadow btn-wide float-end btn-pill btn-hover-shine mb-2 me-2"
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
                                  <TabPane tabId="4">
                                    <CardBody>
                                    <Formik
                                     initialValues={{nueva4}}
                                     enableReinitialize
                                     validationSchema={validationSchema4}
                                     onSubmit={submitTab4}
                                   >
                                     {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                                       <Form onSubmit={handleSubmit}>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_TelefonoCelular">Teléfono Celular</Label>
                                             <Field
                                               name="coin_TelefonoCelular"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su teléfono celular..."
                                               />
                                             <ErrorMessage name="coin_TelefonoCelular" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_TelefonoFijo">Telefono Fijo</Label>
                                             <Field
                                               name="coin_TelefonoFijo"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su teléfono fijo.."
                                             />
                                             <ErrorMessage name="coin_TelefonoFijo" component="div" className="text-danger" />
                                           </FormGroup>
                                         </Col>
                                       </Row>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_CorreoElectronico">Correo Electrónico</Label>
                                             <InputGroup>
                                             <Field
                                               name="coin_CorreoElectronico"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su correo electrónico."
                                               onChange={(e) => {
                                                 setFieldValue('coin_CorreoElectronico', e.target.value);
                                                 setEnviarCodigo(e.target.value);
                                               }}
                                             />
                                             <InputGroupText>
                                             <Button className=" btn-shadow"  color="alternate" onClick={() => codigoenviado(enviarCodigo)}>Enviar código</Button>
                                            </InputGroupText>
                                            </InputGroup>
                                             <ErrorMessage name="coin_CorreoElectronico" component="div" className="text-danger" />
                                           <InputGroup className="mt-2">
                                            <Field
                                              name="codigoConfirmacion"
                                              as={Input}
                                              placeholder="Código de confirmación."
                                              onChange={(e) => setConfirmacionCodigo(e.target.value)}
                                            />
                                            <InputGroupText>
                                             <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigo(confirmacionCodigo)}>
                                              Confirmar Código
                                             </Button>
                                            </InputGroupText>
                                           </InputGroup>
                                           <ErrorMessage name="codigoConfirmacion" component="div" className="text-danger" />

                                           </FormGroup>

                                         </Col>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="coin_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                                             <InputGroup>
                                             <Field
                                               name="coin_CorreoElectronicoAlternativo"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su correo electrónico alternativo."
                                               onChange={(e) => {
                                                 setFieldValue('coin_CorreoElectronicoAlternativo', e.target.value);
                                                 setEnviarCodigoAlternativo(e.target.value);
                                               }}
                                             />
                                             <InputGroupText>
                                             <Button className=" btn-shadow"  color="alternate" onClick={() => codigoenviadoalternativo(enviarCodigoAlternativo)}>Enviar código</Button>
                                            </InputGroupText>
                                            </InputGroup>
                                             <ErrorMessage name="coin_CorreoElectronicoAlternativo" component="div" className="text-danger" />
                                           <InputGroup className="mt-2">
                                            <Field
                                              name="codigoConfirmacionAlternativo"
                                              as={Input}
                                              placeholder="Código de confirmación."
                                              onChange={(e) => setConfirmacionCodigoAlternativo(e.target.value)}
                                            />

                                            <InputGroupText>
                                             <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigoalternativo(confirmacionCodigoAlternativo)}>
                                              Confirmar Código
                                             </Button>
                                            </InputGroupText>
                                           </InputGroup>
                                          <ErrorMessage name="codigoConfirmacionAlternativo" component="div" className="text-danger" />

                                           </FormGroup>
                                         </Col>
                                       </Row>
                                      <hr></hr>
                                       <Button
                                         color="secondary"
                                         className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
                                         outline
                                         onClick={() => setActiveTab("3")}
                                       >
                                         Volver
                                       </Button>
    <Button
        color="secondary"
        className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
        outline
        onClick={() => {
            setCollapse(false);
            listarComerciantes();
        }}
    >
        Volver al Inicio
    </Button>

                                       <Button
                                         color="primary"
                                         className="btn-shadow btn-wide float-end btn-pill btn-hover-shine mb-2 me-2"
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
                                  <TabPane tabId="5">
                                    <CardBody>
                                    <Formik
                                       initialValues={{ doco_URLImagen: null }}
                                       validationSchema={validationSchema5}
                                       onSubmit={handleSubmit}
                                     >
                                     {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                                       <Form onSubmit={handleSubmit}>
                                       <Row>
                                         <Col md={6}>
                                           <FormGroup>
                                             <Label for="doco_URLImagen">Subir Imagen</Label>
                                             <Input
                                               type="file"
                                               name="doco_URLImagen"
                                               onChange={(event) => handleImageChange(event, setFieldValue)}
                                             />
                                             <ErrorMessage name="doco_URLImagen" component="div" className="text-danger" />
                                           </FormGroup>
                                           {previewImage && (
                                             <div>
                                               <img src={previewImage} alt="Vista previa" style={{ width: '100%', maxHeight: '300px' }} />
                                               <Tooltip title="Ver imagen">
                                                 <EyeOutlined
                                                   onClick={handlePreview}
                                                   style={{
                                                     position: 'absolute',
                                                     top: '50%',
                                                     left: '50%',
                                                     transform: 'translate(-50%, -50%)',
                                                     fontSize: '24px',
                                                     color: 'rgba(0, 0, 0, 1)',
                                                     cursor: 'pointer',
                                                     borderBlockColor:'rgba(255, 255, 255, 1)'
                                                   }}
                                                 />
                                               </Tooltip>
                                             </div>
                                           )}
                                            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                                                 <img alt="Vista previa" style={{ width: '100%' }} src={previewImage} />
                                               </Modal>
                                             </Col>
                                           </Row>
                                           <Button type="submit" color="primary" disabled={isSubmitting}>Subir</Button>
                                           <ToastContainer />
                                           <hr></hr>
                                           <Button
                                         color="secondary"
                                         className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
                                         outline
                                         onClick={() => setActiveTab("4")}
                                       >
                                         Volver
                                       </Button>
                                       {editarr && (
    <Button
        color="secondary"
        className="btn-shadow float-start btn-wide btn-pill mb-2 me-2"
        outline
        onClick={() => {
            setCollapse(false);
            listarComerciantes();
        }}
    >
        Volver al Inicio
    </Button>
)}

                                       <Button
                                         color="primary"
                                         className="btn-shadow btn-wide float-end btn-pill btn-hover-shine mb-2 me-2"
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
                                  <TabPane tabId="6">
                                  <div className="form-wizard-content">
                                  <div className="no-results">
                                    <div className="sa-icon sa-success animate">
                                      <span className="sa-line sa-tip animateSuccessTip" />
                                      <span className="sa-line sa-long animateSuccessLong" />
                                      <div className="sa-placeholder" />
                                      <div className="sa-fix" />
                                    </div>
                                    <div className="results-subtitle mt-4">Formulario listo!</div>
                                    <div className="results-title">
                                      Volver al Inicio
                                    </div>
                                    <div className="mt-3 mb-3" />
                                    <div className="text-center">
                                      <Button color="success" size="lg" className="btn-shadow btn-wide" onClick={finalizar}>
                                        Finalizar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
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

