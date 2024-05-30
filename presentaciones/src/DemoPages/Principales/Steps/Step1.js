import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlOficina = 'https://localhost:44380/api/Oficinas'; 
const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const urlCivil = 'https://localhost:44380/api/EstadosCiviles'; 
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const WizardStep1 = ({ onNext }) => {
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [nueva, setNueva] = useState({ pers_RTN: "", pers_Nombre: "", ofic_Id: null, escv_Id: null, ofpr_Id: null, pers_FormaRepresentacion: false, pers_escvRepresentante: null, pers_OfprRepresentante: null });

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

  const listarCiviles = async () => {
    try {
      const response = await axios.get(`${urlCivil}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
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

  const insertarComerciante = async (values) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const ComercianteAInsertar = {
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

      console.log('Datos enviados para insertar:', ComercianteAInsertar);

      await axios.post(`${urlAPI}/Insertar`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      toast.success("Insertado exitosamente!");
      onNext(); // Llamar a la función onNext para avanzar al siguiente tab

    } catch (error) {
      toast.error("Error al insertar: ", error.response.data);
    }
  };

  const validationSchema = Yup.object().shape({
    pers_RTN: Yup.string()
      .required("El RTN es requerido."),
    pers_Nombre: Yup.string()
      .required("El nombre es requerido."),
    ofic_Id: Yup.number()
      .required("La oficina es requerida."),
    escv_Id: Yup.number()
      .required("El estado civil es requerido."),
    ofpr_Id: Yup.number()
      .required("El oficio es requerido."),
    pers_escvRepresentante: Yup.number()
      .required("El estado civil del representante es requerido."),
    pers_OfprRepresentante: Yup.number()
      .required("El oficio del representante es requerido."),
  });

  return (
    <Fragment>
      <div className="form-wizard-content">
        <Row>
          <Formik
            initialValues={nueva}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => insertarComerciante(values)}
          >
            {({ handleSubmit, values, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <Col md={6}>
                  <FormGroup>
                    <Label for="pers_RTN">RTN</Label>
                    <Input
                      type="text"
                      name="pers_RTN"
                      id="pers_RTN"
                      value={values.pers_RTN}
                      onChange={(e) => setFieldValue('pers_RTN', e.target.value)}
                      placeholder="Ingrese su RTN.."
                    />
                    <ErrorMessage name="pers_RTN" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="pers_Nombre">Nombre</Label>
                    <Input
                      type="text"
                      name="pers_Nombre"
                      id="pers_Nombre"
                      value={values.pers_Nombre}
                      onChange={(e) => setFieldValue('pers_Nombre', e.target.value)}
                      placeholder="Ingrese su nombre.."
                    />
                    <ErrorMessage name="pers_Nombre" component="div" className="text-danger" />
                  </FormGroup>
                </Col>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ofic_Id">Oficina</Label>
                      <Input
                        type="select"
                        name="ofic_Id"
                        id="ofic_Id"
                        value={values.ofic_Id}
                        onChange={(e) => setFieldValue('ofic_Id', e.target.value)}
                      >
                        <option value="">Seleccione su oficina</option>
                        {dataOficina.map((oficina) => (
                          <option key={oficina.ofic_Id} value={oficina.ofic_Id}>{oficina.ofic_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="ofic_Id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="escv_Id">Estado Civil</Label>
                      <Input
                        type="select"
                        name="escv_Id"
                        id="escv_Id"
                        value={values.escv_Id}
                        onChange={(e) => setFieldValue('escv_Id', e.target.value)}
                      >
                        <option value="">Seleccione su estado civil</option>
                        {dataCivil.map((civil) => (
                          <option key={civil.escv_Id} value={civil.escv_Id}>{civil.escv_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="escv_Id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="ofpr_Id">Oficio</Label>
                  <Input
                    type="select"
                    name="ofpr_Id"
                    id="ofpr_Id"
                    value={values.ofpr_Id}
                    onChange={(e) => setFieldValue('ofpr_Id', e.target.value)}
                  >
                    <option value="">Seleccione su oficio</option>
                    {dataOficios.map((oficio) => (
                      <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>{oficio.ofpr_Nombre}</option>
                    ))}
                  </Input>
                  <ErrorMessage name="ofpr_Id" component="div" className="text-danger" />
                </FormGroup>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_FormaRepresentacion">¿Forma Representación?</Label>
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
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_escvRepresentante">Estado Civil Representante</Label>
                      <Input
                        type="select"
                        name="pers_escvRepresentante"
                        id="pers_escvRepresentante"
                        value={values.pers_escvRepresentante}
                        onChange={(e) => setFieldValue('pers_escvRepresentante', e.target.value)}
                      >
                        <option value="">Seleccione el estado civil del representante</option>
                        {dataCivil.map((civil) => (
                          <option key={civil.escv_Id} value={civil.escv_Id}>{civil.escv_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="pers_escvRepresentante" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_OfprRepresentante">Oficio Representante</Label>
                      <Input
                        type="select"
                        name="pers_OfprRepresentante"
                        id="pers_OfprRepresentante"
                        value={values.pers_OfprRepresentante}
                        onChange={(e) => setFieldValue('pers_OfprRepresentante', e.target.value)}
                      >
                        <option value="">Seleccione el oficio del representante</option>
                        {dataOficios.map((oficio) => (
                          <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>{oficio.ofpr_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="pers_OfprRepresentante" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                {/* <Button type="submit" color="primary">Guardar y Siguiente</Button> */}
              </Form>
            )}
          </Formik>
        </Row>
      </div>
    </Fragment>
  );
};

export default WizardStep1;
