import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
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

const WizardStep1 = ({ setIsStep1Valid }) => {
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [nueva, setNueva] = useState({
    pers_RTN: "",
    pers_Nombre: "",
    ofic_Id: "",
    escv_Id: "",
    ofpr_Id: "",
    pers_FormaRepresentacion: false,
    pers_escvRepresentante: "",
    pers_OfprRepresentante: ""
  });

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
        pers_OfprRepresentante: hola,
        usua_UsuarioCreacion: 1,
        coin_FechaCreacion: fechaActual
      };

      const response = await axios.post(`${urlAPI}/Insertar`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      setIsStep1Valid(true);

    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Error al insertar: " + error.response.data);
      } else {
        console.log("Error al insertar: " + error.message);
      }
      setIsStep1Valid(false);
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
  };

  let hola = 0;
  const handleOfprRepresentanteChange = (e, setFieldValue, values) => {
    hola= e.target.value;

    setFieldValue('pers_OfprRepresentante', e.target.value);
    handleFormChange(values);
   insertarComerciante(values);
  };

  return (
    <Fragment>
      <div className="form-wizard-content">
        <Row>
          <Formik
            initialValues={nueva}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, setFieldValue }) => (
              <form onBlur={handleSubmit} onChange={() => handleFormChange(values)}>
              <Row>
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
                      <ErrorMessage name="pers_RTN" component="div" style={{ color: 'red' }} />
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
                </Row>
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
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_FormaRepresentacion">Representante</Label>
                      <Input
                        type="checkbox"
                        name="pers_FormaRepresentacion"
                        id="pers_FormaRepresentacion"
                        checked={values.pers_FormaRepresentacion}
                        onChange={(e) => setFieldValue('pers_FormaRepresentacion', e.target.checked)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="pers_escvRepresentante">Estado Civil del Representante</Label>
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
                    <Col md={6}>
                      <FormGroup>
                        <Label for="pers_OfprRepresentante">Oficio del Representante</Label>
                        <Input
                          type="select"
                          name="pers_OfprRepresentante"
                          id="pers_OfprRepresentante"
                          value={values.pers_OfprRepresentante}
                          onChange={(e) => handleOfprRepresentanteChange(e, setFieldValue, values)}
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
              </form>
            )}
          </Formik>
        </Row>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default WizardStep1;
