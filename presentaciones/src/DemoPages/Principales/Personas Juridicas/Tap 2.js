import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Col, Row, Input } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep2 = Yup.object().shape({
  ciud_Id: Yup.number().required('ID de Ciudad es requerido'),
  alde_Id: Yup.number().nullable(),
  colo_Id: Yup.number().required('ID de Colonia es requerido'),
  peju_NumeroLocalApart: Yup.string().required('Número Local Apart es requerido'),
  peju_PuntoReferencia: Yup.string().required('Punto de Referencia es requerido'),
});

const Tap2 = ({ pejuId, childFormikSubmit, onNext }) => {
  const [aldeasOptions, setAldeasOptions] = useState([]);
  const [coloniasOptions, setColoniasOptions] = useState([]);
  const [ciudadesOptions, setCiudadesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
  const urlCiudad = 'https://localhost:44380/api/Ciudades';
  const urlAldea = 'https://localhost:44380/api/Aldea';
  const urlColonia = 'https://localhost:44380/api/Colonias';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  useEffect(() => {}, []);

  const buscarCiudades = async (inputValue) => {
    if (!inputValue || inputValue.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${urlCiudad}/Listar?ciud_EsAduana=true&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((ciudad) => ({
          value: ciudad.ciud_Id,
          label: ciudad.ciud_Nombre,
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
      const response = await axios.get(`${urlAldea}/FiltrarPorCiudades?alde_Id=${ciud_Id}&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((aldea) => ({
          value: aldea.alde_Id,
          label: aldea.alde_Nombre,
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
      const response = await axios.get(`${urlColonia}/FiltrarPorCiudad?ciud_Id=${ciud_Id}&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((colonia) => ({
          value: colonia.colo_Id,
          label: colonia.colo_Nombre,
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
    setFieldValue('ciud_Id', ciud_Id);
    setFieldValue('alde_Id', '');
    setFieldValue('colo_Id', '');
    setAldeasOptions([]);
    setColoniasOptions([]);
  };

  const handleVillageChange = (selectedOption, setFieldValue) => {
    const alde_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('alde_Id', alde_Id);
  };

  const handleColoniaChange = (selectedOption, setFieldValue) => {
    const colo_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('colo_Id', colo_Id);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSubmit = {
        ...values,
        peju_Id: pejuId,
      };

      console.log('Submitting data to API:', dataToSubmit); 
      const response = await axios.post(`${urlAPI}/InsertarTap2`, dataToSubmit, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        },
      });
      console.log('API response:', response.data); 
      setSubmitting(false);
      // toast.success('Datos insertados correctamente');
      onNext(); 
    } catch (error) {
      console.error('Error inserting data', error);
      if (error.response) {
        console.error('Response data:', error.response.data); 
      }
      // toast.error('Error al insertar datos.');
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        ciud_Id: '',
        alde_Id: '',
        colo_Id: '',
        peju_NumeroLocalApart: '',
        peju_PuntoReferencia: '',
      }}
      validationSchema={validationSchemaStep2}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, setFieldValue, values }) => {
        if (childFormikSubmit) {
          childFormikSubmit.current = handleSubmit;
        }
        console.log('pejuId:', pejuId); 
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="ciud_Id">Ciudad</Label>
                  <Select
                    id="ciud_Id"
                    name="ciud_Id"
                    options={ciudadesOptions}
                    onInputChange={(value) => {
                      if (value) {
                        buscarCiudades(value);
                      }
                    }}
                    onChange={(selectedOption) => handleCityChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Ciudad"
                    noOptionsMessage={() => 'No hay opciones'}
                  />
                  <ErrorMessage name="ciud_Id" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="alde_Id">Aldea</Label>
                  <Select
                    id="alde_Id"
                    name="alde_Id"
                    options={aldeasOptions}
                    onInputChange={(value) => {
                      if (value && values.ciud_Id) {
                        buscarAldeas(values.ciud_Id, value);
                      }
                    }}
                    onChange={(selectedOption) => handleVillageChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Aldea"
                    noOptionsMessage={() => 'No hay opciones'}
                    isDisabled={!values.ciud_Id}
                  />
                  <ErrorMessage name="alde_Id" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="colo_Id">Colonia</Label>
                  <Select
                    id="colo_Id"
                    name="colo_Id"
                    options={coloniasOptions}
                    onInputChange={(value) => {
                      if (value && values.ciud_Id) {
                        buscarColonias(values.ciud_Id, value);
                      }
                    }}
                    onChange={(selectedOption) => handleColoniaChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Colonia"
                    noOptionsMessage={() => 'No hay opciones'}
                    isDisabled={!values.ciud_Id}
                  />
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
            <ToastContainer />
          </Form>
        );
      }}
    </Formik>
  );
};

export default Tap2;
