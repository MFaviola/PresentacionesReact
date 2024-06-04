import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep1 = Yup.object().shape({
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

const Tap1 = ({ initialValues, onNext, setPersonaJuridicaId, childFormikSubmit }) => {
  const [Oficinas, setOficinas] = useState([]);
  const [Oficio_Profesiones, setOficio_Profesiones] = useState([]);
  const [EstadosCiviles, setEstadosCiviles] = useState([]);
  const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
  const urlOficina = 'https://localhost:44380/api/Oficinas';
  const urlCivil = 'https://localhost:44380/api/EstadosCiviles';
  const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  useEffect(() => {
    listarOficinas();
    listarCiviles();
    listarOficios();
  }, []);

  const listarOficinas = async () => {
    try {
      const response = await axios.get(`${urlOficina}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setOficinas(response.data.data);
    } catch (error) {
      toast.error("Error al listar las oficinas.");
    }
  };

  const listarCiviles = async () => {
    try {
      const response = await axios.get(`${urlCivil}/Listar?escv_EsAduana=true`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setEstadosCiviles(response.data.data);
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
      setOficio_Profesiones(response.data.data);
    } catch (error) {
      toast.error("Error al listar los oficios.");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString();
    const dataToSubmit = {
      ...values,
      usua_UsuarioCreacion: 1,
      peju_FechaCreacion: fechaActual
    };

    try {
      const response = await axios.post(`${urlAPI}/Insertar`, dataToSubmit, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      const fullId = response.data.data.messageStatus;
      const peju_Id = fullId.split('.')[0];
      setPersonaJuridicaId(peju_Id);
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
      initialValues={initialValues}
      validationSchema={validationSchemaStep1}
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
                    {Oficinas.map(oficina => (
                      <option key={oficina.ofic_Id} value={oficina.ofic_Id}>{oficina.ofic_Nombre}</option>
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
                    {EstadosCiviles.map(estadoCivil => (
                      <option key={estadoCivil.escv_Id} value={estadoCivil.escv_Id}>{estadoCivil.escv_Nombre}</option>
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
                    {Oficio_Profesiones.map(oficio => (
                      <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>{oficio.ofpr_Nombre}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="ofpr_Id" component="div" style={{ color: 'red' }} />
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

export default Tap1;
