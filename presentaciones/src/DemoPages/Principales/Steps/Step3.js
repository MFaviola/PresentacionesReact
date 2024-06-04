import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
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
  coin_CiudadRepresentante: Yup.number().required("La ciudad es requerida."),
  coin_AldeaRepresentante: Yup.number().required("La aldea es requerida."),
  coin_coloniaIdRepresentante: Yup.number().required("La colonia es requerida."),
  coin_NumeroLocaDepartRepresentante: Yup.string()
    .required("El número local del apartamento es requerido.")
    .matches(/^[a-zA-Z0-9]+$/, "El número local solo debe contener letras y números."),
  coin_PuntoReferenciaReprentante: Yup.string()
    .required("El punto de referencia es requerido.")
    .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."),
});

const WizardStep3 = ({ onNext, childFormikSubmit,ideditar }) => {
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [ultimoCoinId, setUltimoCoinId] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [registro, setRegistro] = useState(null);
  const [cargabdo, setcargabdo] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await listarProvincias();
        await listarComerciantes();
        if (ideditar) {
          const response = await axios.get(`${urlAPI}/Listar`, {
            headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
            }
          });
          const lista = response.data.data;
          const registroo = lista.find((list) => list.coin_Id === ideditar);
          console.log('fkfkf',registroo);
          setRegistro(registroo);

          const provinciaId = registroo.pvin_Id;
        const ciudadId = registroo.ciud_Id;
        await listarCiudades(provinciaId); await listarAldeas(ciudadId); await listarColonias(ciudadId);
        }
      } catch (error) {
        console.error('Error al obtener detalles del comerciante', error);
        toast.error("Error al obtener los detalles del comerciante.");
      } finally {
        setcargabdo(false);
      }
    };
  
    fetchData();
  }, [ideditar]);
  const listarProvincias = async () => {
    try {
      const response = await axios.get(`${urlProvincia}/Listar?pvin_EsAduana=false`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setDataProvincia(response.data.data || []);
    } catch (error) {
      toast.error("Error al listar las provincias.");
    }
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

  const handleProvinciaChange = async (event, setFieldValue) => {
    const provinciaId = event.target.value;
    setSelectedProvincia(provinciaId);
    setFieldValue('pvin_Id', provinciaId);
    await listarCiudades(provinciaId);
  };

  const handleCiudadChange = async (event, setFieldValue) => {
    const ciudadId = event.target.value;
    setSelectedCiudad(ciudadId);
    setFieldValue('coin_CiudadRepresentante', ciudadId);
    await listarAldeas(ciudadId);
    await listarColonias(ciudadId);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString(); 

    const ComercianteAInsertar = {
      coin_Id: ideditar||ultimoCoinId,
      coin_CiudadRepresentante: values.coin_CiudadRepresentante,
      coin_AldeaRepresentante: values.coin_AldeaRepresentante,
      coin_coloniaIdRepresentante: values.coin_coloniaIdRepresentante,
      coin_NumeroLocaDepartRepresentante: values.coin_NumeroLocaDepartRepresentante,
      coin_PuntoReferenciaReprentante: values.coin_PuntoReferenciaReprentante,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual,
    };
    console.log('insertar 3',ComercianteAInsertar);
    try {
      const response = await axios.post(`${urlAPI}/InsertarTap3`, ComercianteAInsertar, {
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
    <Row>
      {!cargabdo && (
        <Formik
          initialValues={{
            pvin_Id: registro ? registro.pvin_Id:"",
        coin_CiudadRepresentante: registro ? registro.coin_CiudadRepresentante:"",
        coin_AldeaRepresentante: registro ? registro.coin_AldeaRepresentante:"",
        coin_coloniaIdRepresentante: registro ? registro.coin_coloniaIdRepresentante:"",
        coin_NumeroLocaDepartRepresentante: registro ? registro.coin_NumeroLocaDepartRepresentante:"",
        coin_PuntoReferenciaReprentante:registro ? registro.coin_PuntoReferenciaReprentante: ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, setFieldValue }) => {
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
                    onChange={(e) => handleProvinciaChange(e, setFieldValue)}
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
                  <Label for="coin_CiudadRepresentante">Ciudad del representante</Label>
                  <Field
                    name="coin_CiudadRepresentante"
                    as="select"
                    className="form-control"
                    onChange={(e) => handleCiudadChange(e, setFieldValue)}
                  >
                    <option value="">Seleccione su ciudad</option>
                    {dataCiudad.map(ciudad => (
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
                  <Label for="coin_AldeaRepresentante">Aldea del representante</Label>
                  <Field
                    name="coin_AldeaRepresentante"
                    as="select"
                    className="form-control"
                  >
                    <option value="">Seleccione su aldea</option>
                    {dataAldea.map(aldea => (
                      <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="coin_AldeaRepresentante" component="div" className="text-danger" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="coin_coloniaIdRepresentante">Colonia del representante</Label>
                  <Field
                    name="coin_coloniaIdRepresentante"
                    as="select"
                    className="form-control"
                  >
                    <option value="">Seleccione su colonia</option>
                    {dataColonia.map(colonia => (
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
                  <Label for="coin_NumeroLocaDepartRepresentante">Número Local del Apartamento</Label>
                  <Field
                    name="coin_NumeroLocaDepartRepresentante"
                    as={Input}
                    className="form-control"
                    placeholder="Ingrese su número local..."
                  />
                  <ErrorMessage name="coin_NumeroLocaDepartRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="coin_PuntoReferenciaReprentante">Punto de Referencia</Label>
                  <Field
                    name="coin_PuntoReferenciaReprentante"
                    as={Input}
                    className="form-control"
                    placeholder="Ingrese su punto de referencia..."
                  />
                  <ErrorMessage name="coin_PuntoReferenciaReprentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <ToastContainer />
            </Form>
            );
          }}
        </Formik>
      )}
    </Row>
  );
};

export default WizardStep3;
