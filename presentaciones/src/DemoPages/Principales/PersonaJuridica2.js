import React, { Fragment, useState, useEffect } from "react";
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
  Button,
  Input,
  Container, Collapse, FormGroup, Label,InputGroupText,InputGroup
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
import Select from 'react-select';
import personaJuridicaAPI from '../Servicios/PersonaJuridicaAPI';

const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';
const urlOficina = 'https://localhost:44380/api/Oficinas';
const urlCivil = 'https://localhost:44380/api/EstadosCiviles';
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones';

const PersonaJuridica = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimPersonaJuridicaId, setElimPersonaJuridicaId] = useState(null);
  const [elimPersId, setElimPersId] = useState(null);
  const [detallePersonaJuridica, setDetallePersonaJuridica] = useState(null);
  const [editPersonaJuridicaId, setEditPersonaJuridicaId] = useState(null); 
  const [editPersId, setEditPersId] = useState(null); 
  const [activeTab, setActiveTab] = useState("1");
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataProvincia2, setDataProvincia2] = useState([]);
  const [dataCiudad2, setDataCiudad2] = useState([]);
  const [dataAldea2, setDataAldea2] = useState([]);
  const [dataColonia2, setDataColonia2] = useState([]);
  const [selectedProvincia2, setSelectedProvincia2] = useState("");

  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [insertado, setInsertado] = useState(null);
  const [dejarpasar, setdejarpasar] = useState(false);
  const [confirmacionCodigo, setConfirmacionCodigo] = useState('');
  const [enviarCodigo, setEnviarCodigo] = useState('');
  const [confirmacionCodigoAlternativo, setConfirmacionCodigoAlternativo] = useState('');
  const [enviarCodigoAlternativo, setEnviarCodigoAlternativo] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCiudad2, setSelectedCiudad2] = useState("");

  const toggleCollapse = () => setCollapse(!collapse);
  const [editarr, setEditar] = useState(false); 
  const [editPersonaId, setEditPersonaId] = useState(null); 
  const [nueva1, setNueva1] = useState({
    pers_RTN: "",
    pers_Nombre: "",
    ofic_Id: "",
    escv_Id: "",
    ofpr_Id: "",
});
const [nueva2, setNueva2] = useState({
  pvin_Id: "",
  ciud_Id: "",
  alde_Id: "",
  colo_Id: "",
  peju_NumeroLocalApart: "",
  peju_PuntoReferencia: ""
});
const [nueva3, setNueva3] = useState({
  pvin_Id: "",
  peju_CiudadIdRepresentante: "",
  peju_AldeaIdRepresentante: "",
  peju_ColoniaRepresentante: "",
  peju_NumeroLocalRepresentante: "",
  peju_PuntoReferenciaRepresentante: ""
});
const [nueva4, setNueva4] = useState({
  peju_TelefonoEmpresa: "",
  peju_TelefonoFijoRepresentanteLegal: "",
  peju_TelefonoRepresentanteLegal: "",
  peju_CorreoElectronico: "",
  peju_CorreoElectronicoAlternativo: ""
});

  // correo

  const PersonaJuridicaId=''
  
  
const confirmarcodigo2 = async (codigo) => {
  try {
      const response = await axios.post(`${urlAPI}/ConfirmarCodigo2?codigo=${codigo}`, {}, {
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



  const codigoenviado = async (correo) => {
    const fechaActual = new Date().toISOString(); 

    const insertarcorreo = {
        peju_Id: insertado,
        peju_CorreoElectronico: correo,
        usua_UsuarioModificacion: 1,
        peju_FechaModificacion: fechaActual,
        peju_TelefonoCelular: "",
        peju_TelefonoFijo: "",
        peju_CorreoElectronicoAlternativo: "",
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

const codigoenviado2 = async (correo) => {
  const fechaActual = new Date().toISOString(); 

  const insertarcorreo = {
      peju_Id: insertado,
      peju_CorreoElectronicoAlternativo: correo,
      usua_UsuarioModificacion: 1,
      peju_FechaModificacion: fechaActual,
      peju_TelefonoCelular: "",
      peju_TelefonoFijo: "",
      peju_CorreoElectronicoAlternativo: "",
  };
  console.log(insertarcorreo);

  try {
      await axios.post(`${urlAPI}/InsertarTap4`, insertarcorreo, {
          headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
          }
      });

      const response = await axios.get(`${urlAPI}/EnviarCodigo2?correo=${correo}`, {
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
///////










///imagen///


const [imageUrl, setImageUrl] = useState('');
const [previewVisible, setPreviewVisible] = useState(false);



const handleImageChange = async (event, setFieldValue) => {
  const file = event.currentTarget.files[0];
  setFieldValue("doco_URLImagen", file);
  setPreviewImage(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=55c70c0d0085c37a2b71725303f42f0e`, formData);
    const url = response.data.data.url;
    setImageUrl(url);
    toast.success('Imagen subida correctamente');

  } catch (error) {
    
    toast.error('Error al subir la imagen. Asegúrese que sea un formato válido.');
  }
  
};








const submitTab5 = async (values, { setSubmitting }) => {
  
  console.log('entra');
  const fechaActual = new Date().toISOString();
  const imageUrlValue = imageUrl; 

  let PersonaJuridicaAInsertar = {
    peju_Id: insertado,
    doco_URLImagen: imageUrlValue,
    usua_UsuarioCreacion: 1,
    doco_FechaCreacion: fechaActual
  };
  console.log('insertar5', PersonaJuridicaAInsertar);
  console.log('url image de 1', imageUrlValue);

  try {
    const response = await axios.post(`https://localhost:44380/api/DocumentosContratos/InsertarDocuPersonaJuridica`, PersonaJuridicaAInsertar, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    toast.success("Datos guardados correctamente.");
    setActiveTab("6");
    setShowPreviousBtn(true);
    dejarpasar(true);
    setShowNextBtn(true);
  } catch (error) {
    toast.error("Error al guardar los datos.");
  }
  setSubmitting(false);
};

const handlePreview = () => {
  setPreviewVisible(true);
};

const handleCancel = () => setPreviewVisible(false);

const handleSubmit = async (values, { setSubmitting }) => {
  if (!imageUrl) {
    toast.error("Primero sube una imagen válida.");
    setSubmitting(false);
    return;
  }
}
const finalizar = async () => {
  await axios.post(`${urlAPI}/FinalizarContratoJuridica?peju_Id=${insertado}`, {}, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
  setCollapse(false);
  listarPersonaJuridicas();
  toast.success("Datos guardados con exito!");
};
  const listarPersonaJuridicas = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      toast.error("Error al listar los PersonaJuridicas.");
    }
  };

  const eliminarPersonaJuridica = async () => {
    try {
      const params = new URLSearchParams({
        peju_Id: elimPersonaJuridicaId,
        pers_Id: elimPersId,
      });

      const response = await axios.post(`${urlAPI}/EliminarJuridica?${params.toString()}`, null, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarPersonaJuridicas();
      setConfirmarEliminar(false);
      toast.success("PersonaJuridica eliminado exitosamente!");

    } catch (error) {
      toast.error("Error al eliminar el PersonaJuridica.");
    }
  };

  const eliminarPersonaJuridicaClick = (PersonaJuridicaId, PersId) => {
    setElimPersonaJuridicaId(PersonaJuridicaId);
    setElimPersId(PersId);
    setConfirmarEliminar(true);
  };

  const obtenerDetallePersonaJuridica = async (PersonaJuridicaId) => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const objeto = lista.find((list) => list.peju_Id === PersonaJuridicaId);
      setDetallePersonaJuridica(objeto);
      setCollapse(true);
    } catch (error) {
      toast.error("Error al obtener los detalles del PersonaJuridica.");
    }
  };

  const cancelarEliminacion = () => {
    setElimPersonaJuridicaId(null);
    setElimPersId(null);
    setConfirmarEliminar(false);
    setEditPersonaJuridicaId(null);

  };

  const cancelarr = () => {
    setCollapse(false);
    setDetallePersonaJuridica(null);
    setEditPersonaJuridicaId(null);
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
    setDataProvincia(response.data.data || []);
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
  useEffect(() => {
    listarPersonaJuridicas();
    listarPersonaJuridicas2();
    listarOficinas();
    listarCiviles();
    listarOficios();
    listarProvincias();
  }, []);

  const ProvinciaCambio = async (event, setFieldValue) => {
    const provinciaId = event.value;
    setSelectedProvincia(provinciaId);
    setFieldValue('pvin_Id', provinciaId);
    await listarCiudades(provinciaId);
  };
  const ProvinciaCambio2 = async (event, setFieldValue) => {
    const provinciaId2 = event.target.value;
    console.log(provinciaId2);
    setSelectedProvincia2(provinciaId2);
    setFieldValue('pvin_Id', provinciaId2);
    await listarCiudades2(provinciaId2);
  };

  const CiudadCambio = async (event, setFieldValue) => {
    const ciudadId = event.value;
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
    setFieldValue('peju_CiudadRepresentante', ciudadId2);
    await listarAldeas2(ciudadId2);
    await listarColonias2(ciudadId2);
  };
  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="primary" onClick={() => editarPersonaJuridicaClick(row.peju_Id, row.pers_RTN,row.pers_Nombre,row.ofic_Id,row.escv_Id,row.ofpr_Id,row.pvin_Id,row.ciud_Id,row.alde_Id,row.colo_Id,row.peju_NumeroLocalApart,row.peju_PuntoReferencia,row.pvin_IdRepresentante,row.peju_CiudadIdRepresentante,row.peju_AldeaRepresentante,row.peju_ColoniaRepresentante,row.peju_NumeroLocaDepartRepresentante,row.peju_PuntoReferenciaRepresentante,row.peju_TelefonoEmpresa,row.peju_TelefonoFijoRepresentanteLegal,row.peju_TelefonoRepresentanteLegal,row.peju_CorreoElectronico,row.peju_CorreoElectronicoAlternativo)}>


        Editar
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="alternate" onClick={() => obtenerDetallePersonaJuridica(row.peju_Id)}>
        Detalles
      </Button>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarPersonaJuridicaClick(row.peju_Id, row.pers_Id)}>
        Eliminar
      </Button>
    </div>
  );


  const editarPersonaJuridicaClick = async (PersonaJuridicaId, rtn,nombre,oficid,escvid,ofprid,pvinid,ciudid,aldeid,coloid,numerolocal,puntorefe,pvinrepre,ciudadrepre,aldrearepre,coloniaidrepre,numerolocalrepre,puntoreferepre,celular,fijo,telrepre,correo,correoalternativo) => {
    setEditar(true);
    setEditPersonaId(PersonaJuridicaId);
    setNueva1({ pers_RTN:rtn,pers_Nombre:nombre,ofic_Id:oficid,escv_Id:escvid,ofpr_Id:ofprid});
    setNueva2({ pvin_Id: pvinid,ciud_Id:ciudid,alde_Id:aldeid,colo_Id:coloid,peju_NumeroLocalApart:numerolocal,peju_PuntoReferencia:puntorefe});
    setNueva3({ pvin_IdRepresentante:pvinrepre,peju_CiudadIdRepresentante:ciudadrepre,peju_AldeaIdRepresentante:aldrearepre,peju_ColoniaRepresentante:coloniaidrepre,peju_NumeroLocalRepresentante:numerolocalrepre,peju_PuntoReferenciaRepresentante:puntoreferepre});
    setNueva4({ peju_TelefonoEmpresa:celular,peju_TelefonoFijoRepresentanteLegal:fijo,peju_TelefonoRepresentanteLegal:telrepre,peju_CorreoElectronico:correo,peju_CorreoElectronicoAlternativo:correoalternativo});
    
    await listarCiudades(pvinid);
    await listarAldeas(ciudid);
    await listarColonias(ciudid);
    await listarCiudades2(pvinrepre);
    await listarAldeas2(ciudadrepre);
    await listarColonias2(ciudadrepre);
    
    setCollapse(true);
    setActiveTab("1");
};


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
      peju_CiudadIdRepresentante,
      coloniaRepresentante,
      ciudadRepresentante,
      provinciaRepresentante,
      peju_NumeroLocalApart,
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
      name: "Correo Electrónico",
      selector: row => row.peju_CorreoElectronico,
      sortable: true,
    },

    {
      name: "Ciudad ",
      selector: row => row.ciudadEmpresa,
      sortable: true,
    },
    {
      name: "Provincia ",
      selector: row => row.provinciaEmpresa,
      sortable: true,
    },
  
  
    {
      name: "Colonia ",
      selector: row => row.coliniaEmpresa,
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
  });


  
  const submitTab1 = async (values, { setSubmitting }) => {
    console.log('entra');
    const fechaActual = new Date().toISOString();
    
    let PersonaJuridicaAInsertarr = {
      pers_RTN: values.pers_RTN,
      pers_Nombre: values.pers_Nombre,
      ofic_Id: values.ofic_Id,
      escv_Id: values.escv_Id,
      ofpr_Id: values.ofpr_Id,
      usua_UsuarioCreacion: 1,
      peju_FechaCreacion: fechaActual
    };
  
    if (editarr) {
      PersonaJuridicaAInsertarr.peju_Id = editPersonaJuridicaId;
      PersonaJuridicaAInsertarr.usua_UsuarioModificacion = 1;
      PersonaJuridicaAInsertarr.peju_FechaModificacion = fechaActual;
    }
  
    const rtnvalidado = /^\d{4}-\d{4}-\d{6}$/.test(values.pers_RTN);
    console.log('PersonaJuridica', PersonaJuridicaAInsertarr, 'rtn es valido?', rtnvalidado);
  
    if (rtnvalidado) {
      try {
        const response = await axios.post(`${urlAPI}/${editarr ? 'Editar' : 'Insertar'}`, PersonaJuridicaAInsertarr, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
  
        listarPersonaJuridicas2();
  
        setActiveTab("2");
        setShowPreviousBtn(true);
        setShowNextBtn(true);
  
        const fullId = response.data.data.messageStatus;  
        const peju_Id = fullId.split('.')[0];  
        PersonaJuridicaId(peju_Id); 
  
      } catch (error) {
        console.error(error);
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
    peju_NumeroLocalApart: Yup.string()
      .required("El número local del apartamento es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El número local solo debe contener letras y números."),
    peju_PuntoReferencia: Yup.string()
      .required("El punto de referencia es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."),
  });


 


  const validationSchemaStep3 = Yup.object().shape({
    pvin_Id: Yup.number().required("La provincia es requerida."),
    peju_CiudadIdRepresentante: Yup.number().required("La ciudad es requerida."),
    peju_AldeaIdRepresentante: Yup.number().required("La aldea es requerida."),
    peju_ColoniaRepresentante: Yup.number().required("La colonia es requerida."),
    peju_NumeroLocalRepresentante: Yup.string()
      .required("El número local del apartamento es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El número local solo debe contener letras y números."),
      peju_PuntoReferenciaRepresentante: Yup.string()
      .required("El punto de referencia es requerido.")
      .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."),
  });

  

  
  const validationSchemaStep4 = Yup.object().shape({
    peju_TelefonoEmpresa: Yup.string().required('Teléfono Empresa es requerido'),
    peju_TelefonoFijoRepresentanteLegal: Yup.string().required('Teléfono Fijo Representante Legal es requerido'),
    peju_TelefonoRepresentanteLegal: Yup.string().required('Teléfono Representante Legal es requerido'),
    peju_CorreoElectronico: Yup.string().email('Correo Electrónico no es válido').required('Correo Electrónico es requerido'),
    peju_CorreoElectronicoAlternativo: Yup.string().email('Correo Electrónico Alternativo no es válido').nullable(),
  });



  const validationSchemaStep5 = Yup.object().shape({
    doco_URLImagen: Yup.mixed().required('La imagen es requerida'),
  });





  const listarPersonaJuridicas2 = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      
      const lista = response.data.data;
      const ultimoObjeto = lista[lista.length - 1];
      setInsertado(ultimoObjeto.peju_Id);
    } catch (error) {
      toast.error("Error al listar los PersonaJuridicas.");
    }
  };

  const submitTab2 = async (values, { setSubmitting }) => {

    const fechaActual = new Date().toISOString();
    let PersonaJuridicaAInsertar = {
      peju_Id: insertado,
      ciud_Id: values.ciud_Id,
      alde_Id: values.alde_Id,
      colo_Id: values.colo_Id,
      peju_NumeroLocalApart: values.peju_NumeroLocalApart,
      peju_PuntoReferencia: values.peju_PuntoReferencia,
      
    };

    if (editarr) {
      PersonaJuridicaAInsertar.peju_Id = editPersonaJuridicaId;
    }
    console.log('insertar2', PersonaJuridicaAInsertar);

    try {
      const response = await axios.post(`${urlAPI}/InsertarTap2`, PersonaJuridicaAInsertar, {
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
    let PersonaJuridicaAInsertar = {
      peju_Id: insertado,
      peju_CiudadIdRepresentante: values.peju_CiudadIdRepresentante,
      peju_AldeaIdRepresentante: values.peju_AldeaIdRepresentante,
      peju_ColoniaRepresentante: values.peju_ColoniaRepresentante,
      peju_NumeroLocalRepresentante: values.peju_NumeroLocalRepresentante,
      peju_PuntoReferenciaRepresentante: values.peju_PuntoReferenciaRepresentante,
  
    };

    if (editarr) {
      PersonaJuridicaAInsertar.peju_Id = editPersonaJuridicaId;
    }
    console.log('insertar3',PersonaJuridicaAInsertar);

    try {
      const response = await axios.post(`${urlAPI}/InsertarTap3`, PersonaJuridicaAInsertar, {
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
    let PersonaJuridicaAInsertar = {
      peju_Id: insertado,
      peju_TelefonoEmpresa: values.peju_TelefonoEmpresa,
      peju_TelefonoFijoRepresentanteLegal: values.peju_TelefonoFijoRepresentanteLegal,
      peju_TelefonoRepresentanteLegal: values.peju_TelefonoRepresentanteLegal,
      peju_CorreoElectronico: values.peju_CorreoElectronico,
      peju_CorreoElectronicoAlternativo: values.peju_CorreoElectronicoAlternativo,
      usua_UsuarioCreacion: 1,
      peju_FechaCreacion: fechaActual
    };
    console.log('insertar4', PersonaJuridicaAInsertar);

    try {
      const response = await axios.post(`${urlAPI}/InsertarTap4`, PersonaJuridicaAInsertar, {
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



 





  

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="PersonaJuridica "
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
                      <CSSTransition component="div" classNames="TabsAnimation" appear={true} timeout={0} enter={false} exit={false}>
                        <Card className="mb-3">
                          <CardHeader className="tabs-lg-alternate">
                            <Nav justified>
                              <NavItem>
                                <NavLink href="#" className={classnames({ active: activeTab === "1" })} onClick={() => toggle("1")}>
                                  <div className="widget-number"> Datos Personales</div>
                                  <div className="tab-subheading">
                                    <span className="pe-2 opacity-6">
                                      <FontAwesomeIcon icon={faCommentDots} />
                                    </span>
                                    {/* Datos Personales */}
                                  </div>
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink href="#" className={classnames({ active: activeTab === "2" })} onClick={() => toggle("2")}>
                                  <div className="widget-number">Dirección</div>
                                  <div className="tab-subheading"></div>
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink href="#" className={classnames({ active: activeTab === "3" })} onClick={() => toggle("3")}>
                                  <div className="widget-number ">Dirección del Representante</div>
                                  <div className="tab-subheading">
                                    <span className="pe-2 opacity-6">
                                      <FontAwesomeIcon icon={faBullhorn} />
                                    </span>
                                    {/* Direccion  */}
                                  </div>
                                </NavLink>
                              </NavItem>




                              <NavItem>
                                <NavLink href="#" className={classnames({ active: activeTab === "4" })} onClick={() => toggle("4")}>
                                  <div className="widget-number text-danger">Tab 4 </div>
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
                                  <div className="widget-number text-danger">Tab 5 </div>
                                  <div className="tab-subheading">
                                    <span className="pe-2 opacity-6">
                                      <FontAwesomeIcon icon={faBullhorn} />
                                    </span>
                                    Subir Documetacion
                                  </div>
                                </NavLink>
                              </NavItem>
                              


                              <NavItem>
                                <NavLink href="#" className={classnames({ active: activeTab === "6" })} onClick={() => toggle("6")}>
                                  <div className="widget-number text-danger">Terminar</div>
                                  <div className="tab-subheading">
                                    <span className="pe-2 opacity-6">
                                      <FontAwesomeIcon icon={faBullhorn} />
                                    </span>
                                    Guardar
                                  </div>
                                </NavLink>
                              </NavItem>
                            </Nav>




                            
                          </CardHeader>





                          <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                              <CardBody>
                                <Formik
                                  initialValues={nueva1}
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
                                              component={Select}
                                              className="form-control"
                                              options={dataOficina.map(oficina => ({
                                                value: oficina.ofic_Id,
                                                label: oficina.ofic_Nombre
                                              }))}
                                              onChange={option => setFieldValue('ofic_Id', option.value)}
                                            />
                                            <ErrorMessage name="ofic_Id" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="escv_Id">Estado Civil</Label>
                                            <Field
                                              name="escv_Id"
                                              component={Select}
                                              className="form-control"
                                              options={dataCivil.map(civil => ({
                                                value: civil.escv_Id,
                                                label: civil.escv_Nombre
                                              }))}
                                              onChange={option => setFieldValue('escv_Id', option.value)}
                                            />
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
                                              component={Select}
                                              className="form-control"
                                              options={dataOficios.map(oficio => ({
                                                value: oficio.ofpr_Id,
                                                label: oficio.ofpr_Nombre
                                              }))}
                                              onChange={option => setFieldValue('ofpr_Id', option.value)}
                                            />
                                            <ErrorMessage name="ofpr_Id" component="div" className="text-danger" />
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



{/*  este es el tap 2 */}

                            <TabPane tabId="2">
                              <CardBody>
                                <Formik
                                  initialValues={{nueva2}}
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
                                              component={Select}
                                              className="form-control"
                                              options={dataProvincia.map(provincia => ({
                                                value: provincia.pvin_Id,
                                                label: provincia.pvin_Nombre
                                              }))}
                                              onChange={option => ProvinciaCambio(option, setFieldValue)}
                                            />
                                            <ErrorMessage name="pvin_Id" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="ciud_Id">Ciudad</Label>
                                            <Field
                                              name="ciud_Id"
                                              component={Select}
                                              className="form-control"
                                              options={dataCiudad.map(ciudad => ({
                                                value: ciudad.ciud_Id,
                                                label: ciudad.ciud_Nombre
                                              }))}
                                              onChange={option => CiudadCambio(option, setFieldValue)}
                                            />
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
                                              component={Select}
                                              className="form-control"
                                              options={dataAldea.map(aldea => ({
                                                value: aldea.alde_Id,
                                                label: aldea.alde_Nombre
                                              }))}
                                              onChange={option => setFieldValue('alde_Id', option.value)}
                                            />
                                            <ErrorMessage name="alde_Id" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="colo_Id">Colonia</Label>
                                            <Field
                                              name="colo_Id"
                                              component={Select}
                                              className="form-control"
                                              options={dataColonia.map(colonia => ({
                                                value: colonia.colo_Id,
                                                label: colonia.colo_Nombre
                                              }))}
                                              onChange={option => setFieldValue('colo_Id', option.value)}
                                            />
                                            <ErrorMessage name="colo_Id" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_NumeroLocalApart">Número Local del Apartamento</Label>
                                            <Field
                                              name="peju_NumeroLocalApart"
                                              as={Input}
                                              className="form-control"
                                              placeholder="Ingrese su número local..."
                                            />
                                            <ErrorMessage name="peju_NumeroLocalApart" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_PuntoReferencia">Punto de Referencia</Label>
                                            <Field
                                              name="peju_PuntoReferencia"
                                              as={Input}
                                              className="form-control"
                                              placeholder="Ingrese su punto de referencia..."
                                            />
                                            <ErrorMessage name="peju_PuntoReferencia" component="div" className="text-danger" />
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
                                <Formik
                                  initialValues={nueva3}
                                  validationSchema={validationSchemaStep3}
                                  onSubmit={submitTab3}
                                >
                                  {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                                    <Form onSubmit={handleSubmit}>
                                      <Row>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="pvin_Id">Provincia del Representante</Label>
                                            <Field
                                              name="pvin_Id"
                                              component={Select}
                                              className="form-control"
                                              options={dataProvincia.map(provincia => ({
                                                value: provincia.pvin_Id,
                                                label: provincia.pvin_Nombre
                                              }))}
                                              onChange={option => ProvinciaCambio(option, setFieldValue)}
                                            />
                                            <ErrorMessage name="pvin_Id" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_CiudadIdRepresentante">Ciudad del Representante</Label>
                                            <Field
                                              name="peju_CiudadIdRepresentante"
                                              component={Select}
                                              className="form-control"
                                              options={dataCiudad.map(ciudad => ({
                                                value: ciudad.ciud_Id,
                                                label: ciudad.ciud_Nombre
                                              }))}
                                              onChange={option => setFieldValue('peju_CiudadIdRepresentante', option.value)}
                                            />
                                            <ErrorMessage name="peju_CiudadIdRepresentante" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_AldeaIdRepresentante">Aldea del Representante </Label>
                                            <Field
                                              name="peju_AldeaIdRepresentante"
                                              component={Select}
                                              className="form-control"
                                              options={dataAldea.map(aldea => ({
                                                value: aldea.alde_Id,
                                                label: aldea.alde_Nombre
                                              }))}
                                              onChange={option => setFieldValue('peju_AldeaIdRepresentante', option.value)}
                                            />
                                            <ErrorMessage name="peju_AldeaIdRepresentante" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_ColoniaRepresentante ">Colonia del Representante</Label>
                                            <Field
                                              name="peju_ColoniaRepresentante"
                                              component={Select}
                                              className="form-control"
                                              options={dataColonia.map(colonia => ({
                                                value: colonia.colo_Id,
                                                label: colonia.colo_Nombre
                                              }))}
                                              onChange={option => setFieldValue('peju_ColoniaRepresentante', option.value)}
                                            />
                                            <ErrorMessage name="peju_ColoniaRepresentante " component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_NumeroLocalRepresentante">Número Local del Representane</Label>
                                            <Field
                                              name="peju_NumeroLocalRepresentante"
                                              as={Input}
                                              className="form-control"
                                              placeholder="Ingrese su número local..."
                                            />
                                            <ErrorMessage name="peju_NumeroLocalRepresentante" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                          <FormGroup>
                                            <Label for="peju_PuntoReferenciaRepresentante">Punto de Referencia del Representante</Label>
                                            <Field
                                              name="peju_PuntoReferenciaRepresentante"
                                              as={Input}
                                              className="form-control"
                                              placeholder="Ingrese su punto de referencia..."
                                            />
                                            <ErrorMessage name="peju_PuntoReferenciaRepresentante" component="div" className="text-danger" />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <Button
                                        color="secondary"
                                        className="btn-shadow float-start btn-wide btn-pill"
                                        outline
                                        onClick={() => setActiveTab("2")}
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







                            <TabPane tabId="4">
  <CardBody>
    <Formik
      initialValues={nueva4}
      validationSchema={validationSchemaStep4}
      onSubmit={submitTab4}
    >
      {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoRepresentanteLegal">Número de Telefono </Label>
                <Field
                  name="peju_TelefonoRepresentanteLegal"
                  as={Input}
                  className="form-control"
                  placeholder="Ingrese Numeo..."
                />
                <ErrorMessage name="peju_TelefonoRepresentanteLegal" component="div" className="text-danger" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoFijoRepresentanteLegal">Numero de telefono Fijo</Label>
                <Field
                  name="peju_TelefonoFijoRepresentanteLegal"
                  as={Input}
                  className="form-control"
                  placeholder="Ingrese el Numero..."
                />
                <ErrorMessage name="peju_TelefonoFijoRepresentanteLegal" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
          <Col md={6}>
                                           <FormGroup>
                                             <Label for="peju_CorreoElectronico">Correo Electrónico</Label>
                                             <InputGroup>
                                             <Field
                                               name="peju_CorreoElectronico"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su correo electrónico."
                                               onChange={(e) => {
                                                 setFieldValue('peju_CorreoElectronico', e.target.value);
                                                 setEnviarCodigo(e.target.value);
                                               }}
                                             />
                                             <InputGroupText>
                                             <Button className=" btn-shadow"  color="alternate" onClick={() => codigoenviado(enviarCodigo)}>Enviar código</Button>
                                            </InputGroupText>
                                            </InputGroup>
                                             <ErrorMessage name="peju_CorreoElectronico" component="div" className="text-danger" />
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
                                             <Label for="peju_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                                             <InputGroup>
                                             <Field
                                               name="peju_CorreoElectronicoAlternativo"
                                               as={Input}
                                               className="form-control"
                                               placeholder="Ingrese su correo electrónico alternativo."
                                               onChange={(e) => {
                                                 setFieldValue('peju_CorreoElectronicoAlternativo', e.target.value);
                                                 setEnviarCodigoAlternativo(e.target.value);
                                               }}
                                             />
                                             <InputGroupText>
                                             <Button className=" btn-shadow"  color="alternate" onClick={() => codigoenviado2(enviarCodigoAlternativo)}>Enviar código</Button>
                                            </InputGroupText>
                                            </InputGroup>
                                             <ErrorMessage name="peju_CorreoElectronicoAlternativo" component="div" className="text-danger" />
                                           <InputGroup className="mt-2">
                                            <Field
                                              name="codigoConfirmacionAlternativo"
                                              as={Input}
                                              placeholder="Código de confirmación."
                                              onChange={(e) => setConfirmacionCodigoAlternativo(e.target.value)}
                                            />

                                            <InputGroupText>
                                             <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigo2(confirmacionCodigoAlternativo)}>
                                              Confirmar Código
                                             </Button>
                                            </InputGroupText>
                                           </InputGroup>
                                          <ErrorMessage name="codigoConfirmacionAlternativo" component="div" className="text-danger" />

                                           </FormGroup>
                                         </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoEmpresa">Número de Telefono de la empresa</Label>
                <Field
                  name="peju_TelefonoEmpresa"
                  as={Input}
                  className="form-control"
                  placeholder="Ingrese Numero de telefono de la empresa"
                />
                <ErrorMessage name="peju_TelefonoEmpresa" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>
          <hr></hr>

          <Button
            color="secondary"
            className="btn-shadow float-start btn-wide btn-pill"
            outline
            onClick={() => setActiveTab("3")}
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










                            <TabPane tabId="5">
      <CardBody>
        <Formik
          initialValues={{ doco_URLImagen: '' }}
          validationSchema={validationSchemaStep5}
          onSubmit={submitTab5}
        >
          {({ setFieldValue, handleSubmit, isSubmitting }) => (
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
                    <ErrorMessage name="doco_URLImagen" component="div" style={{ color: 'red' }} />
                  </FormGroup>
                  {previewImage && (
                    <div>
                      <img src={previewImage} alt="Vista previa" style={{ width: '100%', maxHeight: '300px' }} />
                      {/* <Tooltip title="Ver imagen">
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
                      </Tooltip> */}
                    </div>
                  )}
                  {/* <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="Vista previa" style={{ width: '100%' }} src={previewImage} />
                  </Modal> */}
                </Col>
              </Row>
              {/* <Button type="submit" color="primary" disabled={isSubmitting}>Subir</Button> */}
              <ToastContainer />
              <hr></hr>

              <Button
            color="secondary"
            className="btn-shadow float-start btn-wide btn-pill"
            outline
            onClick={() => setActiveTab("4")}
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

{/* 
                            <TabPane tabId="3">
                              <CardBody>
                                <p className="mb-0">
                                  It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                              </CardBody>
                            </TabPane>



 */}


                                  <TabPane tabId="6">
                                  <div className="form-wizard-content">
                                  <div className="no-results">
                                    <div className="sa-icon sa-success animate">
                                      <span className="sa-line sa-tip animateSuccessTip" />
                                      <span className="sa-line sa-long animateSuccessLong" />
                                      <div className="sa-placeholder" />
                                      <div className="sa-fix" />
                                    </div>
                                    <div className="results-subtitle mt-4">Formulario terminado!</div>
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
