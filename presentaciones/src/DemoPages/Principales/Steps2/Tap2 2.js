import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Col, Row, Input } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep2 = Yup.object().shape({
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

const Tap2 = ({ pejuId, childFormikSubmit, onNext }) => {
  const [provinciasOptions, setProvinciasOptions] = useState([]);
  const [ciudadesOptions, setCiudadesOptions] = useState([]);
  const [aldeasOptions, setAldeasOptions] = useState([]);
  const [coloniasOptions, setColoniasOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [cargando, setCargando] = useState(true);

  const urlAPI = 'https://localhost:44380/api/ComercianteIndividual';
  const urlProvincia = 'https://localhost:44380/api/Provincias';
  const urlCiudad = 'https://localhost:44380/api/Ciudades';
  const urlAldea = 'https://localhost:44380/api/Aldea';
  const urlColonia = 'https://localhost:44380/api/Colonias';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  useEffect(() => {
    listarProvincias();
    listarComerciantes();
  }, []);

  const listarProvincias = async () => {
    try {
      const response = await axios.get(`${urlProvincia}/Listar?pvin_EsAduana=false`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setProvinciasOptions(response.data.data.map(provincia => ({
        value: provincia.pvin_Id,
        label: provincia.pvin_Nombre,
      })));
    } catch (error) {
      toast.error("Error al listar las provincias.");
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
      setRegistro(ultimoObjeto);
      setCargando(false);
    } catch (error) {
      toast.error("Error al listar los comerciantes.");
    }
  };

  const buscarCiudades = async (provinciaId, inputValue) => {
    if (!provinciaId || !inputValue || inputValue.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${urlCiudad}/CiudadesFiltradaPorProvincias?pvin_Id=${provinciaId}&search=${inputValue}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        },
      });
      setCiudadesOptions(response.data.data.map(ciudad => ({
        value: ciudad.ciud_Id,
        label: ciudad.ciud_Nombre,
      })));
    } catch (error) {
      toast.error("Error al buscar ciudades.");
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
      setAldeasOptions(response.data.map(aldea => ({
        value: aldea.alde_Id,
        label: aldea.alde_Nombre,
      })));
    } catch (error) {
      toast.error("Error al buscar aldeas.");
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
      setColoniasOptions(response.data.map(colonia => ({
        value: colonia.colo_Id,
        label: colonia.colo_Nombre,
      })));
    } catch (error) {
      toast.error("Error al buscar colonias.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinciaChange = (selectedOption, setFieldValue) => {
    const pvin_Id = selectedOption ? selectedOption.value : '';
    setFieldValue('pvin_Id', pvin_Id);
    setFieldValue('ciud_Id', '');
    setFieldValue('alde_Id', '');
    setFieldValue('colo_Id', '');
    setCiudadesOptions([]);
    setAldeasOptions([]);
    setColoniasOptions([]);
  };

  const handleCiudadChange = (selectedOption, setFieldValue) => {
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
    const fechaActual = new Date().toISOString();
    const ComercianteAInsertar = {
      ...values,
      coin_Id: pejuId,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual,
    };
    try {
      await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setSubmitting(false);
      onNext();
      toast.success("Datos guardados correctamente.");
    } catch (error) {
      toast.error("Error al insertar datos.");
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        pvin_Id: registro ? registro.pvin_Id : '',
        ciud_Id: registro ? registro.ciud_Id : '',
        alde_Id: registro ? registro.alde_Id : '',
        colo_Id: registro ? registro.colo_Id : '',
        coin_NumeroLocalApart: registro ? registro.coin_NumeroLocalApart : '',
        coin_PuntoReferencia: registro ? registro.coin_PuntoReferencia : '',
      }}
      validationSchema={validationSchemaStep2}
      onSubmit={handleSubmit}
      enableReinitialize
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
                  <Label for="pvin_Id">Provincia</Label>
                  <Select
                    id="pvin_Id"
                    name="pvin_Id"
                    options={provinciasOptions}
                    onChange={(selectedOption) => handleProvinciaChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Provincia"
                    noOptionsMessage={() => 'No hay opciones'}
                  />
                  <ErrorMessage name="pvin_Id" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="ciud_Id">Ciudad</Label>
                  <Select
                    id="ciud_Id"
                    name="ciud_Id"
                    options={ciudadesOptions}
                    onInputChange={(value) => {
                      if (value && values.pvin_Id) {
                        buscarCiudades(values.pvin_Id, value);
                      }
                    }}
                    onChange={(selectedOption) => handleCiudadChange(selectedOption, setFieldValue)}
                    isLoading={isLoading}
                    placeholder="Seleccione Ciudad"
                    noOptionsMessage={() => 'No hay opciones'}
                    isDisabled={!values.pvin_Id}
                  />
                  <ErrorMessage name="ciud_Id" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
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
            <ToastContainer />
          </Form>
        );
      }}
    </Formik>
  );
};

export default Tap2;
