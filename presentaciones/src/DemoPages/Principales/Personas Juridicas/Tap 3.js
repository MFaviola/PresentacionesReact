import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep3 = Yup.object().shape({
  peju_CiudadIdRepresentante: Yup.number().required('ID de Ciudad Representante es requerido'),
  peju_AldeaIdRepresentante: Yup.number().nullable(),
  peju_ColoniaRepresentante: Yup.number().required('ID de Colonia Representante es requerido'),
  peju_NumeroLocalRepresentante: Yup.string().required('Número Local Representante es requerido'),
  peju_PuntoReferenciaRepresentante: Yup.string().required('Punto de Referencia Representante es requerido'),
});

const Tap3 = ({ initialValues, childFormikSubmit, onSubmit }) => {
  const [repCitiesOptions, setRepCitiesOptions] = useState([]);
  const [repVillagesOptions, setRepVillagesOptions] = useState([]);
  const [repColoniesOptions, setRepColoniesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const urlAPI = 'https://localhost:44380/api';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  const buscarRepCities = async (inputValue) => {
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
        setRepCitiesOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar ciudades', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarRepVillages = async (ciud_Id, inputValue) => {
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
        setRepVillagesOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar aldeas', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarRepColonies = async (ciud_Id, inputValue) => {
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
        setRepColoniesOptions(options);
      } else {
        console.error('La respuesta del API no contiene el formato esperado');
      }
    } catch (error) {
      console.error('Error al buscar colonias', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepCityChange = (selectedOption, setFieldValue) => {
    const peju_CiudadIdRepresentante = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_CiudadIdRepresentante', peju_CiudadIdRepresentante);
    setFieldValue('peju_AldeaIdRepresentante', '');
    setFieldValue('peju_ColoniaRepresentante', '');
    setRepVillagesOptions([]);
    setRepColoniesOptions([]);
  };

  const handleRepVillageChange = (selectedOption, setFieldValue) => {
    const peju_AldeaIdRepresentante = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_AldeaIdRepresentante', peju_AldeaIdRepresentante);
  };

  const handleRepColoniaChange = (selectedOption, setFieldValue) => {
    const peju_ColoniaRepresentante = selectedOption ? selectedOption.value : '';
    setFieldValue('peju_ColoniaRepresentante', peju_ColoniaRepresentante);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${urlAPI}/PersonaJuridica/InsertarTap3`, values, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log('Insert response:', response.data);
      setSubmitting(false);
      onSubmit(); // Call the onNext function to move to the next step
    } catch (error) {
      console.error('Error inserting data', error);
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      throw error; // Ensure error is caught by the caller
    }
  };

  return (
    <Formik
      initialValues={initialValues}
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
                  <Label for="peju_CiudadIdRepresentante">Ciudad Representante</Label>
                  <Select
                    id="peju_CiudadIdRepresentante"
                    name="peju_CiudadIdRepresentante"
                    options={repCitiesOptions}
                    onInputChange={(value) => {
                      if (value) {
                        buscarRepCities(value);
                      }
                    }}
                    onChange={(selectedOption) => handleRepCityChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Ciudad Representante"
                    noOptionsMessage={() => "No hay opciones"}
                  />
                  <ErrorMessage name="peju_CiudadIdRepresentante" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_AldeaIdRepresentante">Aldea Representante</Label>
                  <Select
                    id="peju_AldeaIdRepresentante"
                    name="peju_AldeaIdRepresentante"
                    options={repVillagesOptions}
                    onInputChange={(value) => {
                      if (value && values.peju_CiudadIdRepresentante) {
                        buscarRepVillages(values.peju_CiudadIdRepresentante, value);
                      }
                    }}
                    onChange={(selectedOption) => handleRepVillageChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Aldea Representante"
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
                  <Label for="peju_ColoniaRepresentante">Colonia Representante</Label>
                  <Select
                    id="peju_ColoniaRepresentante"
                    name="peju_ColoniaRepresentante"
                    options={repColoniesOptions}
                    onInputChange={(value) => {
                      if (value && values.peju_CiudadIdRepresentante) {
                        buscarRepColonies(values.peju_CiudadIdRepresentante, value);
                      }
                    }}
                    onChange={(selectedOption) => handleRepColoniaChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Colonia Representante"
                    noOptionsMessage={() => "No hay opciones"}
                    isDisabled={!values.peju_CiudadIdRepresentante}
                  />
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
            <ToastContainer />
          </Form>
        );
      }}
    </Formik>
  );
};

export default Tap3;
