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

const WizardStep3 = ({ setIsStep3Valid }) => {
  const [data, setData] = useState([]);
  const [dataCiudad, setDataCiudad] = useState([]);
  const [dataAldea, setDataAldea] = useState([]);
  const [dataColonia, setDataColonia] = useState([]);
  const [nueva, setNueva] = useState({
    coin_CiudadRepresentante: "",
    coin_AldeaRepresentante: "",
    coin_coloniaIdRepresentante: "",
    coin_NumeroLocaDepartRepresentante: "",
    coin_PuntoReferenciaReprentante: "",
  });

  useEffect(() => {
    listarCiudades();
    listarAldeas();
    listarColonias();
   listarComerciantes();

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

  const [ultimoCoinId, setUltimoCoinId] = useState(null);

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
      setUltimoCoinId(ultimoObjeto.coin_Id); 
 };

  const insertarComerciante = async (values) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const ComercianteAInsertar = {
        coin_Id: ultimoCoinId,
        coin_CiudadRepresentante: values.coin_CiudadRepresentante,
        coin_AldeaRepresentante: values.coin_AldeaRepresentante,
        coin_coloniaIdRepresentante: values.coin_coloniaIdRepresentante,
        coin_NumeroLocaDepartRepresentante: values.coin_NumeroLocaDepartRepresentante,
        coin_PuntoReferenciaReprentante: hola,
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual,
      };
      console.log('insertar 3',ComercianteAInsertar);

      const response = await axios.post(`${urlAPI}/InsertarTap3`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      if(ComercianteAInsertar != null)
        setIsStep3Valid(true);

    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Error al insertar: " + error.response.data);
      } else {
        console.log("Error al insertar: " + error.message);
      }
      setIsStep3Valid(false);
    }
  };

  const validationSchema = Yup.object().shape({
    coin_CiudadRepresentante: Yup.number().required("La ciudad es requerida."),
    coin_AldeaRepresentante: Yup.number().required("La aldea es requerida."),
    coin_coloniaIdRepresentante: Yup.number().required("La colonia es requerida."),
    coin_NumeroLocaDepartRepresentante: Yup.string().required("El numero locar del representante es requerido.")
    .matches(/^[a-zA-Z0-9]+$/, "El numero del local solo debe contener letras y números."), 
    coin_PuntoReferenciaReprentante: Yup.string().required("El punto de referencia del representante es requerido.")    
    .matches(/^[a-zA-Z0-9]+$/, "El punto de referencia solo debe contener letras y números."), 
  });

  const handleFormChange = (values) => {
    setIsStep3Valid(validationSchema.isValidSync(values));
  };

  let hola = "";
  const handleinsertarChange = (e, setFieldValue, values) => {
    hola= e.target.value;

    setFieldValue('coin_PuntoReferenciaReprentante', e.target.value);
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
                      <Label for="coin_CiudadRepresentante">Ciudad del representante</Label>
                      <Input
                        type="select"
                        name="coin_CiudadRepresentante"
                        id="coin_CiudadRepresentante"
                        value={values.coin_CiudadRepresentante}
                        onChange={(e) => setFieldValue('coin_CiudadRepresentante', e.target.value)}>
                        <option value="">Seleccione la ciudad del representante</option>
                        {dataCiudad.map((ciudad) => (
                          <option key={ciudad.ciud_Id} value={ciudad.ciud_Id}>{ciudad.ciud_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="coin_CiudadRepresentante" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coin_AldeaRepresentante">Aldea del representante</Label>
                      <Input
                        type="select"
                        name="coin_AldeaRepresentante"
                        id="coin_AldeaRepresentante"
                        value={values.coin_AldeaRepresentante}
                        onChange={(e) => setFieldValue('coin_AldeaRepresentante', e.target.value)}>
                        <option value="">Seleccione la aldea del representante</option>
                        {dataAldea.map((aldea) => (
                          <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="coin_AldeaRepresentante" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="coin_coloniaIdRepresentante">Colonia del representante</Label>
                      <Input
                        type="select"
                        name="coin_coloniaIdRepresentante"
                        id="coin_coloniaIdRepresentante"
                        value={values.coin_coloniaIdRepresentante}
                        onChange={(e) => setFieldValue('coin_coloniaIdRepresentante', e.target.value)}>
                        <option value="">Seleccione la colonia del representante</option>
                        {dataColonia.map((colonia) => (
                          <option key={colonia.colo_Id} value={colonia.colo_Id}>{colonia.colo_Nombre}</option>
                        ))}
                      </Input>
                      <ErrorMessage name="coin_coloniaIdRepresentante" component="div" style={{ color: 'red' }} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coin_NumeroLocaDepartRepresentante">Numero local del representante</Label>
                      <Input
                        type="text"
                        name="coin_NumeroLocaDepartRepresentante"
                        id="coin_NumeroLocaDepartRepresentante"
                        value={values.coin_NumeroLocaDepartRepresentante}
                        onChange={(e) => setFieldValue('coin_NumeroLocaDepartRepresentante', e.target.value)}
                        placeholder="Ingrese el numero local del representante.."
                      />
                      <ErrorMessage name="coin_NumeroLocaDepartRepresentante" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="coin_PuntoReferenciaReprentante">Punto referencia representante</Label>
                      <Input
                        type="text"
                        name="coin_PuntoReferenciaReprentante"
                        id="coin_PuntoReferenciaReprentante"
                        value={values.coin_PuntoReferenciaReprentante}
                        onChange={(e) => handleinsertarChange(e, setFieldValue, values)}
                        placeholder="Ingrese el punto de referencia del representante.."
                      />
                      <ErrorMessage name="coin_PuntoReferenciaReprentante" component="div" style={{ color: 'red' }} />
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

export default WizardStep3;
