import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Col, Row, Input } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
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
});

const Tap3 = ({ pejuId, childFormikSubmit, onNext }) => {
  const [aldeasOptions, setAldeasOptions] = useState([]);
  const [coloniasOptions, setColoniasOptions] = useState([]);
  const [ciudadesOptions, setCiudadesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const urlAPI = 'https://localhost:44380/api';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  useEffect(() => {
    // Initial fetch or other logic can be added here
  }, []);

  const buscarCiudades = async (inputValue) => {
    if (!inputValue || inputValue.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${urlAPI}/Ciudades/Listar?ciud_EsAduana=true&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map(ciudad => ({
          value: ciudad.ciud_Id,
          label: ciudad.ciud_Nombre
        }));
        setCiudadesOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar ciudades', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarAldeas = async (ciud_Id, inputValue) => {
    if (!ciud_Id || !inputValue || inputValue.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${urlAPI}/Aldea/FiltrarPorCiudades?alde_Id=${ciud_Id}&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map(aldea => ({
          value: aldea.alde_Id,
          label: aldea.alde_Nombre
        }));
        setAldeasOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar aldeas', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarColonias = async (ciud_Id, inputValue) => {
    if (!ciud_Id || !inputValue || inputValue.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${urlAPI}/Colonias/FiltrarPorCiudad?ciud_Id=${ciud_Id}&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map(colonia => ({
          value: colonia.colo_Id,
          label: colonia.colo_Nombre
        }));
        setColoniasOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar colonias', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = (selectedOption, setFieldValue) => {
    const ciud_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_CiudadIdRepresentante', ciud_Id);
    setFieldValue('peju_AldeaIdRepresentante', '');
    setFieldValue('peju_ColoniaRepresentante', '');
    setAldeasOptions([]);
    setColoniasOptions([]);
  };

  const handleVillageChange = (selectedOption, setFieldValue) => {
    const alde_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_AldeaIdRepresentante', alde_Id);
  };

  const handleColoniaChange = (selectedOption, setFieldValue) => {
    const colo_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_ColoniaRepresentante', colo_Id);
  };

  let seenvio = false;
  const handleSubmit = async (values, { setSubmitting }) => {
    if (seenvio) return;
     
      seenvio = true; 
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
      const fechaActual = new Date().toISOString();
      const dataToSubmit = {
        ...values,
        peju_Id: pejuId,
        usua_UsuarioModificacion: 1,
        peju_FechaModificacion: fechaActual
      };

      const response = await axios.post(`${urlAPI}/PersonaJuridica/InsertarTap3`, dataToSubmit, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log('Insert response:', response.data);
      setSubmitting(false);
    } catch (error) {
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={{
        peju_CiudadIdRepresentante: '',
        peju_AldeaIdRepresentante: '',
        peju_ColoniaRepresentante: '',
        peju_NumeroLocalRepresentante: '',
        peju_PuntoReferenciaRepresentante: ''
      }}
      validationSchema={validationSchemaStep3}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, setFieldValue, values }) => {
        if (childFormikSubmit) {
          childFormikSubmit.current = handleSubmit;
        }
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_CiudadIdRepresentante">Ciudad del Representante</Label>
                  <Select
                    id="peju_CiudadIdRepresentante"
                    name="peju_CiudadIdRepresentante"
                    options={ciudadesOptions}
                    onInputChange={(value) => {
                      if (value) {
                        buscarCiudades(value);
                      }
                    }}
                    onChange={(selectedOption) => handleCityChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Ciudad"
                    noOptionsMessage={() => "No hay opciones"}
                  />
                  <ErrorMessage name="peju_CiudadIdRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_AldeaIdRepresentante">Aldea del Representante</Label>
                  <Select
                    id="peju_AldeaIdRepresentante"
                    name="peju_AldeaIdRepresentante"
                    options={aldeasOptions}
                    onInputChange={(value) => {
                      if (value && values.peju_CiudadIdRepresentante) {
                        buscarAldeas(values.peju_CiudadIdRepresentante, value);
                      }
                    }}
                    onChange={(selectedOption) => handleVillageChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Aldea"
                    noOptionsMessage={() => "No hay opciones"}
                    isDisabled={!values.peju_CiudadIdRepresentante}
                  />
                  <ErrorMessage name="peju_AldeaIdRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_ColoniaRepresentante">Colonia del Representante</Label>
                  <Select
                    id="peju_ColoniaRepresentante"
                    name="peju_ColoniaRepresentante"
                    options={coloniasOptions}
                    onInputChange={(value) => {
                      if (value && values.peju_CiudadIdRepresentante) {
                        buscarColonias(values.peju_CiudadIdRepresentante, value);
                      }
                    }}
                    onChange={(selectedOption) => handleColoniaChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Colonia"
                    noOptionsMessage={() => "No hay opciones"}
                    isDisabled={!values.peju_CiudadIdRepresentante}
                  />
                  <ErrorMessage name="peju_ColoniaRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_NumeroLocalRepresentante">Número Local del Representante</Label>
                  <Field name="peju_NumeroLocalRepresentante" as={Input} />
                  <ErrorMessage name="peju_NumeroLocalRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_PuntoReferenciaRepresentante">Punto de Referencia del Representante</Label>
                  <Field name="peju_PuntoReferenciaRepresentante" as={Input} />
                  <ErrorMessage name="peju_PuntoReferenciaRepresentante" component="div" style={{ color: 'red' }} />
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

export default Tap3;
