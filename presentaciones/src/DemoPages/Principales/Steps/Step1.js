import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik,Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlOficina = 'https://localhost:44380/api/Oficinas'; 
const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const urlCivil = 'https://localhost:44380/api/EstadosCiviles'; 
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const WizardStep1 = ({ setIsStep1Valid,onNext }) => {
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
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
      setDataOficina(response.data.data);
    } catch (error) {
      toast.error("Error al listar las oficinas.");
    }
  };

  const sesionesaduana = 0;
  let esaduana = false;
  if(sesionesaduana)
    {
      esaduana = true;
    }
  const listarCiviles = async () => {
    try {
      const response = await axios.get(`${urlCivil}/Listar?escv_EsAduana=${esaduana}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
          'escv_EsAduana': 0
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

 

  const validationSchema = Yup.object().shape({
    pers_RTN: Yup.string()
      .required("El RTN es requerido.")
      .matches(/^\d{4}-\d{4}-\d{6}$/, "El RTN debe tener el formato 1234-5678-90123 y solo contener números y guiones."),
    pers_Nombre: Yup.string()
      .required("El nombre es requerido.")
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo debe contener letras y acentos."),
    ofic_Id: Yup.number().required("La oficina es requerida."),
    escv_Id: Yup.number().required("El estado civil es requerido."),
    ofpr_Id: Yup.number().required("El oficio es requerido."),
    pers_escvRepresentante: Yup.number().required("El estado civil del representante es requerido."),
    pers_OfprRepresentante: Yup.number().required("El oficio del representante es requerido."),
  });
  

  const handleFormChange = (values) => {
    setIsStep1Valid(validationSchema.isValidSync(values));
    setIsStep1Valid(true);

  };


  const handleSubmit = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString(); 
    handleFormChange(values);

    const ComercianteAInsertarr = {
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
    console.log('insertar 4', ComercianteAInsertarr);

    try {
      const response = await axios.post(`${urlAPI}/Insertar`, ComercianteAInsertarr, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log(response);

      if (ComercianteAInsertarr != null)
        setIsStep1Valid(true);      
      
      setSubmitting(false);
      onNext(); 
    } catch (error) {
      console.error('Error inserting data', error);
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      setIsStep1Valid(false);

      throw error; 
    }
  };
  return (
    <Formik
      initialValues={{
        pers_RTN: "",
        pers_Nombre: "",
        ofic_Id: "",
        escv_Id: "",
        ofpr_Id: "",
        pers_FormaRepresentacion: false,
        pers_escvRepresentante: "",
        pers_OfprRepresentante: ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit} onChange={() => handleFormChange(values)}>
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
                  <ErrorMessage name="pers_RTN" component="div" style={{ color: 'red' }} />
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
                  <ErrorMessage name="pers_Nombre" component="div" style={{ color: 'red' }} />
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
                <Col sm={6} style={{ padding: 0 }}>
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
                      {oficio.ofpr_Descripcion}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="pers_OfprRepresentante" component="div" className="text-danger" />
              </FormGroup>
            </Col>
          </Row>
          <ToastContainer />
        </Form>
      )}
    </Formik>
  );
};

export default WizardStep1;
