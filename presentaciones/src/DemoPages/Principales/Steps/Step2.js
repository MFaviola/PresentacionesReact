import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const urlCiudad = 'https://localhost:44380/api/Ciudades'; 
const urlAldea = 'https://localhost:44380/api/Aldea'; 
const urlColonia = 'https://localhost:44380/api/Colonias'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const WizardStep2 = ({ setIsStep1Valid }) => {
  const [data, setData] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [nueva, setNueva] = useState({
    ciud_Id: "",
    alde_Id: "",
    colo_Id: "",
    coin_NumeroLocalApart: "",
    coin_PuntoReferencia: "",
  });

  useEffect(() => {
    listarCiudades();
    listarAldeas();
    listarColonias();
    setIsStep1Valid(false);

  }, []);

  const sesionesaduana = 0;
  let esaduana = false;
  if(sesionesaduana)
    {
      esaduana = true;
    }
  const listarCiudades = async () => {
    try {
      const response = await axios.get(`${urlCiudad}/Listar?ciud_EsAduana=${esaduana}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setDataCiudad(response.data.data);
    } catch (error) {
      toast.error("Error al listar las ciudades.");
    }
  };

  const listarAldeas = async () => {
    try {
      const response = await axios.get(`${urlAldea}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
        }
      });
      setDataAldea(response.data.data);
    } catch (error) {
      toast.error("Error al listar las aldeas.");
    }
  };

  const listarColonias = async () => {
    try {
      const response = await axios.get(`${urlColonia}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setDataColonia(response.data.data);
    } catch (error) {
      toast.error("Error al listar las colonias.");
    }
  };

  let tab1 = 0;

  const listarComerciantes = async () => {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
      const listaentera = response.data.data;
      const ultimoObjeto = listaentera[listaentera.length - 1];
      console.log(ultimoObjeto);
      tab1 = ultimoObjeto.coin_Id;
  };

  const insertarComerciante = async (values) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const ComercianteAInsertar = {
        coin_Id: tab1,
        ciud_Id: values.ciud_Id,
        alde_Id: values.alde_Id,
        colo_Id: values.colo_Id,
        coin_NumeroLocalApart: values.coin_NumeroLocalApart,
        coin_PuntoReferencia: hola,
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual,
      };
      console.log(ComercianteAInsertar);

      const response = await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log(response);

      toast.success("Insertado exitosamente!");
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
    ciud_Id: Yup.number().required("La oficina es requerida."),
    alde_Id: Yup.number().required("El estado civil es requerido."),
    colo_Id: Yup.number().required("El oficio es requerido."),
    coin_NumeroLocalApart: Yup.string().required("El estado civil del representante es requerido.")
    .matches(/^[a-zA-Z0-9]+$/, "El numero del local solo debe contener letras y números."), 
    coin_PuntoReferencia: Yup.string().required("El oficio del representante es requerido.")    
    .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."), 
  });

  const handleFormChange = (values) => {
    setIsStep1Valid(validationSchema.isValidSync(values));
  };

  let hola = "";
  const handleinsertarChange = (e, setFieldValue, values) => {
    hola= e.target.value;

    setFieldValue('coin_PuntoReferencia', e.target.value);
    handleFormChange(values);
   insertarComerciante(values);
   listarComerciantes();
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
                      <Label for="ciud_Id">Ciudad</Label>
                      <Input
                        type="select"
                        name="ciud_Id"
                        id="ciud_Id"
                        value={values.ciud_Id}
                        onChange={(e) => setFieldValue('ciud_Id', e.target.value)}>
                        <option value="">Seleccione su ciudad</option>
                        {dataCiudad.map((ciudad) => (
                          <option key={ciudad.ciud_Id} value={ciudad.ciud_Id}>{ciudad.ciud_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="ciud_Id" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="alde_Id">Aldea</Label>
                      <Input
                        type="select"
                        name="alde_Id"
                        id="alde_Id"
                        value={values.alde_Id}
                        onChange={(e) => setFieldValue('alde_Id', e.target.value)}>
                        <option value="">Seleccione su aldea</option>
                        {dataAldea.map((aldea) => (
                          <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="alde_Id" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="colo_Id">Colonia</Label>
                      <Input
                        type="select"
                        name="colo_Id"
                        id="colo_Id"
                        value={values.colo_Id}
                        onChange={(e) => setFieldValue('colo_Id', e.target.value)}>
                        <option value="">Seleccione su colonia</option>
                        {dataColonia.map((colonia) => (
                          <option key={colonia.colo_Id} value={colonia.colo_Id}>{colonia.colo_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="ciud_Id" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coin_NumeroLocalApart">Numero local del apartamento</Label>
                      <Input
                        type="text"
                        name="coin_NumeroLocalApart"
                        id="coin_NumeroLocalApart"
                        value={values.coin_NumeroLocalApart}
                        onChange={(e) => setFieldValue('coin_NumeroLocalApart', e.target.value)}
                        placeholder="Ingrese su numero local.."
                      />
                      <ErrorMessage name="coin_NumeroLocalApart" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="coin_PuntoReferencia">Punto de referencia</Label>
                      <Input
                        type="text"
                        name="coin_PuntoReferencia"
                        id="coin_PuntoReferencia"
                        value={values.coin_PuntoReferencia}
                        onBlur={(e) => handleinsertarChange(e, setFieldValue, values)}
                        placeholder="Ingrese su punto de referencia.."
                      />
                      <ErrorMessage name="coin_PuntoReferencia" component="div" style={{ color: 'red' }} />
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

export default WizardStep2;
