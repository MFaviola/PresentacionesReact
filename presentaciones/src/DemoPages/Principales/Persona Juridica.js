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
import MultiStep from "./Wizard";

const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const PersonaJuridica = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimPersonaJuridicaId, setElimPersonaJuridicaId] = useState(null);
  const [pejuId, setPejuId] = useState(null);

  const [offices, setOffices] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [civilStatuses, setCivilStatuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [colonies, setColonies] = useState([]);
  const [repCities, setRepCities] = useState([]);
  const [repVillages, setRepVillages] = useState([]);
  const [repColonies, setRepColonies] = useState([]);

  useEffect(() => {
    listarPersonaJuridicas();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [officeResponse, occupationResponse, civilStatusResponse, cityResponse] = await Promise.all([
        axios.get(`${urlAPI}/Offices`, { headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada } }),
        axios.get(`${urlAPI}/Occupations`, { headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada } }),
        axios.get(`${urlAPI}/CivilStatuses`, { headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada } }),
        axios.get(`${urlAPI}/Cities`, { headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada } }),
      ]);
      setOffices(officeResponse.data);
      setOccupations(occupationResponse.data);
      setCivilStatuses(civilStatusResponse.data);
      setCities(cityResponse.data);
    } catch (error) {
      console.error('Error fetching dropdown data', error);
    }
  };

  const handleCityChange = async (cityId, setFieldValue) => {
    try {
      const response = await axios.get(`${urlAPI}/Villages`, { 
        headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada },
        params: { cityId }
      });
      setVillages(response.data);
      setFieldValue('alde_Id', '');
      setFieldValue('colo_Id', '');
      setColonies([]);
    } catch (error) {
      console.error('Error fetching villages', error);
    }
  };

  const handleVillageChange = async (villageId, setFieldValue) => {
    try {
      const response = await axios.get(`${urlAPI}/Colonies`, {
        headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada },
        params: { villageId }
      });
      setColonies(response.data);
      setFieldValue('colo_Id', '');
    } catch (error) {
      console.error('Error fetching colonies', error);
    }
  };

  const handleRepCityChange = async (cityId, setFieldValue) => {
    try {
      const response = await axios.get(`${urlAPI}/Villages`, { 
        headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada },
        params: { cityId }
      });
      setRepVillages(response.data);
      setFieldValue('peju_AldeaIdRepresentante', '');
      setFieldValue('peju_ColoniaRepresentante', '');
      setRepColonies([]);
    } catch (error) {
      console.error('Error fetching representative villages', error);
    }
  };

  const handleRepVillageChange = async (villageId, setFieldValue) => {
    try {
      const response = await axios.get(`${urlAPI}/Colonies`, {
        headers: { 'XApiKey': keyAPI, 'EncryptionKey': keyencriptada },
        params: { villageId }
      });
      setRepColonies(response.data);
      setFieldValue('peju_ColoniaRepresentante', '');
    } catch (error) {
      console.error('Error fetching representative colonies', error);
    }
  };

  const listarPersonaJuridicas = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
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
        peju_ContratoFinalizado: item.peju_ContratoFinalizado,
        peju_NumeroLocalApart: item.peju_NumeroLocalApart,
        usuarioCreacionNombre: item.usuarioCreacionNombre,
        peju_FechaCreacion: item.peju_FechaCreacion,
        usuarioModificaNombre: item.usuarioModificaNombre,
        peju_FechaModificacion: item.peju_FechaModificacion,
        peju_Estado: item.peju_Estado
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
      const response = await axios.post(`${urlAPI}/Eliminar`, PersonaJuridicaAEliminar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

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

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarPersonaJuridicaClick(row.peju_Id)}>
        Eliminar
      </Button>
    </div>
  );

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
      width: "150px",
    }
  ];

  const validationSchemaStep1 = Yup.object().shape({
    pers_RTN: Yup.string().required('RTN es requerido'),
    pers_Nombre: Yup.string().required('Nombre es requerido'),
    ofic_Id: Yup.number().required('ID de Oficina es requerido'),
    escv_Id: Yup.number().required('ID de Estado Civil es requerido'),
    ofpr_Id: Yup.number().required('ID de Oficio es requerido'),
  });

  const validationSchemaStep2 = Yup.object().shape({
    ciud_Id: Yup.number().required('ID de Ciudad es requerido'),
    alde_Id: Yup.number().nullable(),
    colo_Id: Yup.number().required('ID de Colonia es requerido'),
    peju_NumeroLocalApart: Yup.string().required('Número Local Apart es requerido'),
    peju_PuntoReferencia: Yup.string().required('Punto de Referencia es requerido'),
  });

  const validationSchemaStep3 = Yup.object().shape({
    peju_CiudadIdRepresentante: Yup.number().required('ID de Ciudad Representante es requerido'),
    peju_AldeaIdRepresentante: Yup.number().nullable(),
    peju_ColoniaRepresentante: Yup.number().required('ID de Colonia Representante es requerido'),
    peju_NumeroLocalRepresentante: Yup.string().required('Número Local Representante es requerido'),
    peju_PuntoReferenciaRepresentante: Yup.string().required('Punto de Referencia Representante es requerido'),
  });

  const validationSchemaStep4 = Yup.object().shape({
    peju_TelefonoEmpresa: Yup.string().required('Teléfono Empresa es requerido'),
    peju_TelefonoFijoRepresentanteLegal: Yup.string().required('Teléfono Fijo Representante Legal es requerido'),
    peju_TelefonoRepresentanteLegal: Yup.string().required('Teléfono Representante Legal es requerido'),
    peju_CorreoElectronico: Yup.string().email('Correo Electrónico no es válido').required('Correo Electrónico es requerido'),
    peju_CorreoElectronicoAlternativo: Yup.string().email('Correo Electrónico Alternativo no es válido').nullable(),
  });

  const insertarPersonaJuridica = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${urlAPI}/Insertar`, values, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setPejuId(response.data.peju_Id); // Capturamos el ID retornado
      toast.success("Datos personales insertados exitosamente!");
      setSubmitting(false);
    } catch (error) {
      console.error('Error al insertar datos personales', error);
      toast.error("Error al insertar datos personales.");
      setSubmitting(false);
    }
  };

  const insertarDireccion = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${urlAPI}/InsertarTap2`, { ...values, peju_Id: pejuId }, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      toast.success("Dirección insertada exitosamente!");
      setSubmitting(false);
    } catch (error) {
      console.error('Error al insertar dirección', error);
      toast.error("Error al insertar dirección.");
      setSubmitting(false);
    }
  };

  const insertarDireccion2 = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${urlAPI}/InsertarTap3`, { ...values, peju_Id: pejuId }, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      toast.success("Dirección 2 insertada exitosamente!");
      setSubmitting(false);
    } catch (error) {
      console.error('Error al insertar dirección 2', error);
      toast.error("Error al insertar dirección 2.");
      setSubmitting(false);
    }
  };

  const insertarContacto = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${urlAPI}/InsertarTap4`, { ...values, peju_Id: pejuId }, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      toast.success("Contacto insertado exitosamente!");
      setSubmitting(false);
    } catch (error) {
      console.error('Error al insertar contacto', error);
      toast.error("Error al insertar contacto.");
      setSubmitting(false);
    }
  };

  const Step1 = () => (
    <Formik
      initialValues={{
        pers_RTN: '',
        pers_Nombre: '',
        ofic_Id: '',
        escv_Id: '',
        ofpr_Id: '',
      }}
      validationSchema={validationSchemaStep1}
      onSubmit={insertarPersonaJuridica}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="pers_RTN">RTN</Label>
                <Field name="pers_RTN" as={Input} />
                <ErrorMessage name="pers_RTN" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="pers_Nombre">Nombre</Label>
                <Field name="pers_Nombre" as={Input} />
                <ErrorMessage name="pers_Nombre" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ofic_Id">Oficina</Label>
                <Field name="ofic_Id" as="select" className="form-control">
                  <option value="">Seleccione Oficina</option>
                  {offices.map(office => (
                    <option key={office.id} value={office.id}>{office.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="ofic_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="escv_Id">Estado Civil</Label>
                <Field name="escv_Id" as="select" className="form-control">
                  <option value="">Seleccione Estado Civil</option>
                  {civilStatuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="escv_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ofpr_Id">Oficio</Label>
                <Field name="ofpr_Id" as="select" className="form-control">
                  <option value="">Seleccione Oficio</option>
                  {occupations.map(occupation => (
                    <option key={occupation.id} value={occupation.id}>{occupation.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="ofpr_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary">Guardar</Button>
        </Form>
      )}
    </Formik>
  );

  const Step2 = () => (
    <Formik
      initialValues={{
        ciud_Id: '',
        alde_Id: '',
        colo_Id: '',
        peju_NumeroLocalApart: '',
        peju_PuntoReferencia: '',
      }}
      validationSchema={validationSchemaStep2}
      onSubmit={insertarDireccion}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ciud_Id">Ciudad</Label>
                <Field name="ciud_Id" as="select" className="form-control" onChange={(e) => handleCityChange(e.target.value, setFieldValue)}>
                  <option value="">Seleccione Ciudad</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="ciud_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="alde_Id">Aldea</Label>
                <Field name="alde_Id" as="select" className="form-control" onChange={(e) => handleVillageChange(e.target.value, setFieldValue)} disabled={!values.ciud_Id}>
                  <option value="">Seleccione Aldea</option>
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>{village.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="alde_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="colo_Id">Colonia</Label>
                <Field name="colo_Id" as="select" className="form-control" disabled={!values.alde_Id}>
                  <option value="">Seleccione Colonia</option>
                  {colonies.map(colony => (
                    <option key={colony.id} value={colony.id}>{colony.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="colo_Id" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_NumeroLocalApart">Número Local Apart</Label>
                <Field name="peju_NumeroLocalApart" as={Input} />
                <ErrorMessage name="peju_NumeroLocalApart" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_PuntoReferencia">Punto de Referencia</Label>
                <Field name="peju_PuntoReferencia" as={Input} />
                <ErrorMessage name="peju_PuntoReferencia" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary">Guardar</Button>
        </Form>
      )}
    </Formik>
  );

  const Step3 = () => (
    <Formik
      initialValues={{
        peju_CiudadIdRepresentante: '',
        peju_AldeaIdRepresentante: '',
        peju_ColoniaRepresentante: '',
        peju_NumeroLocalRepresentante: '',
        peju_PuntoReferenciaRepresentante: '',
      }}
      validationSchema={validationSchemaStep3}
      onSubmit={insertarDireccion2}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_CiudadIdRepresentante">Ciudad Representante</Label>
                <Field name="peju_CiudadIdRepresentante" as="select" className="form-control" onChange={(e) => handleRepCityChange(e.target.value, setFieldValue)}>
                  <option value="">Seleccione Ciudad Representante</option>
                  {repCities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="peju_CiudadIdRepresentante" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_AldeaIdRepresentante">Aldea Representante</Label>
                <Field name="peju_AldeaIdRepresentante" as="select" className="form-control" onChange={(e) => handleRepVillageChange(e.target.value, setFieldValue)} disabled={!values.peju_CiudadIdRepresentante}>
                  <option value="">Seleccione Aldea Representante</option>
                  {repVillages.map(village => (
                    <option key={village.id} value={village.id}>{village.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="peju_AldeaIdRepresentante" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_ColoniaRepresentante">Colonia Representante</Label>
                <Field name="peju_ColoniaRepresentante" as="select" className="form-control" disabled={!values.peju_AldeaIdRepresentante}>
                  <option value="">Seleccione Colonia Representante</option>
                  {repColonies.map(colony => (
                    <option key={colony.id} value={colony.id}>{colony.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="peju_ColoniaRepresentante" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_NumeroLocalRepresentante">Número Local Representante</Label>
                <Field name="peju_NumeroLocalRepresentante" as={Input} />
                <ErrorMessage name="peju_NumeroLocalRepresentante" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_PuntoReferenciaRepresentante">Punto de Referencia Representante</Label>
                <Field name="peju_PuntoReferenciaRepresentante" as={Input} />
                <ErrorMessage name="peju_PuntoReferenciaRepresentante" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary">Guardar</Button>
        </Form>
      )}
    </Formik>
  );

  const Step4 = () => (
    <Formik
      initialValues={{
        peju_TelefonoEmpresa: '',
        peju_TelefonoFijoRepresentanteLegal: '',
        peju_TelefonoRepresentanteLegal: '',
        peju_CorreoElectronico: '',
        peju_CorreoElectronicoAlternativo: '',
      }}
      validationSchema={validationSchemaStep4}
      onSubmit={insertarContacto}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoEmpresa">Teléfono Empresa</Label>
                <Field name="peju_TelefonoEmpresa" as={Input} />
                <ErrorMessage name="peju_TelefonoEmpresa" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoFijoRepresentanteLegal">Teléfono Fijo Representante Legal</Label>
                <Field name="peju_TelefonoFijoRepresentanteLegal" as={Input} />
                <ErrorMessage name="peju_TelefonoFijoRepresentanteLegal" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_TelefonoRepresentanteLegal">Teléfono Representante Legal</Label>
                <Field name="peju_TelefonoRepresentanteLegal" as={Input} />
                <ErrorMessage name="peju_TelefonoRepresentanteLegal" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_CorreoElectronico">Correo Electrónico</Label>
                <Field name="peju_CorreoElectronico" as={Input} />
                <ErrorMessage name="peju_CorreoElectronico" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="peju_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                <Field name="peju_CorreoElectronicoAlternativo" as={Input} />
                <ErrorMessage name="peju_CorreoElectronicoAlternativo" component="div" style={{ color: 'red' }} />
              </FormGroup>
            </Col>
          </Row>
          <Button type="submit" color="primary">Guardar</Button>
        </Form>
      )}
    </Formik>
  );

  const steps = [
    { name: "Datos Personales", component: <Step1 /> },
    { name: "Dirección 1", component: <Step2 /> },
    { name: "Dirección 2", component: <Step3 /> },
    { name: "Contacto", component: <Step4 /> },
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
                <Collapse isOpen={collapse}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <div className="forms-wizard-alt">
                        <MultiStep showNavigation={true} steps={steps} onCancel={() => setCollapse(false)} />
                      </div>
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
