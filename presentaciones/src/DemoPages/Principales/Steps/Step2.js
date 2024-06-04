import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual';
const urlProvincia = 'https://localhost:44380/api/Provincias';
const urlCiudad = 'https://localhost:44380/api/Ciudades';
const urlAldea = 'https://localhost:44380/api/Aldea';
const urlColonia = 'https://localhost:44380/api/Colonias';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const validationSchema = Yup.object().shape({
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

const WizardStep2 = ({ onNext, childFormikSubmit }) => {
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [ultimoCoinId, setUltimoCoinId] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState("");
const [selectedCiudad, setSelectedCiudad] = useState("");


  useEffect(() => {
    listarProvincias();
    listarComerciantes();
  }, []);

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
  

  const listarComerciantes = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const lista = response.data.data;
      const ultimoObjeto = lista[lista.length - 1];
      setUltimoCoinId(ultimoObjeto.coin_Id);
    } catch (error) {
      toast.error("Error al listar los comerciantes.");
    }
  };

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
  
  const handleSubmit = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString(); 

    const ComercianteAInsertar = {
      coin_Id: ultimoCoinId,
      ciud_Id: values.ciud_Id,
      alde_Id: values.alde_Id,
      colo_Id: values.colo_Id,
      coin_NumeroLocalApart: values.coin_NumeroLocalApart,
      coin_PuntoReferencia: values.coin_PuntoReferencia,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual,
    };
    console.log('insertar2',ComercianteAInsertar);

    try {
      const response = await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setSubmitting(false);
      onNext();
    } catch (error) {
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={{
        pvin_Id: "",
        ciud_Id: "",
        alde_Id: "",
        colo_Id: "",
        coin_NumeroLocalApart: "",
        coin_PuntoReferencia: ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, values, setFieldValue }) => {
        if (childFormikSubmit) {
          childFormikSubmit.current = handleSubmit;
        }
        return (
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
                  <ErrorMessage name="coin_NumeroLocalApart" component="div" className="text-danger"/>
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
            <ToastContainer />
          </Form>
        );
      }}
    </Formik>
  );
};

export default WizardStep2;
