import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const WizardStep5 = ({ setIsStep5Valid, coinIdToEdit }) => {
  const [data, setData] = useState([]);
  const [nueva, setNueva] = useState({
    coin_TelefonoCelular: "",
    coin_TelefonoFijo: "",
  });
  const [registro, setRegistro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await listarComerciantes();
        if (coinIdToEdit) {
          const response = await axios.get(`${urlAPI}/Listar`, {
            headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
            }
          });
          const lista = response.data.data;
          const registroo = lista.find((list) => list.coin_Id === coinIdToEdit);
          setRegistro(registroo);
        }
      } catch (error) {
        console.error('Error al obtener detalles del comerciante', error);
        toast.error("Error al obtener los detalles del comerciante.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [coinIdToEdit]);

  const [tab3, setTab3] = useState(null);

  const listarComerciantes = async () => {
    const response = await axios.get(`${urlAPI}/Listar`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    setData(response.data.data);
    const listaentera = response.data.data;
    const ultimo = listaentera[listaentera.length - 1];
    setTab3(ultimo.coin_Id);
  };

  const [alternativo, setalternativo] = useState(null);

  const insertarComerciante = async (values) => {
    try {
      const fechaActual = new Date().toISOString();
      const ComercianteAInsertar = {
        coin_Id: coinIdToEdit || tab3,
        coin_TelefonoCelular: values.coin_TelefonoCelular,
        coin_TelefonoFijo: values.coin_TelefonoFijo,
        coin_CorreoElectronico: values.coin_CorreoElectronico,
        coin_CorreoElectronicoAlternativo: hola,
        usua_UsuarioModificacion: 1,
        coin_FechaModificacion: fechaActual,
      };
      console.log('insertar 4', ComercianteAInsertar);

      const response = await axios.post(`${urlAPI}/InsertarTap4`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      setIsStep5Valid(true);

    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Error al insertar: " + error.response.data);
      } else {
        console.log("Error al insertar: " + error.message);
      }
      setIsStep5Valid(false);
    }
  };

  const validationSchema = Yup.object().shape({
    coin_TelefonoCelular: Yup.string()
      .matches(/^\d+$/, "El teléfono celular solo debe contener números.")
      .required("El teléfono celular es requerido."),
    coin_TelefonoFijo: Yup.string()
      .matches(/^\d+$/, "El teléfono fijo solo debe contener números.")
      .required("El teléfono fijo es requerido."),
    coin_CorreoElectronico: Yup.string()
      .email("El correo electrónico no es válido.")
      .required("El correo electrónico es requerido."),
    coin_CorreoElectronicoAlternativo: Yup.string()
      .email("El correo electrónico alternativo no es válido.")
      .required("El correo electrónico alternativo es requerido.")
  });

  const handleFormChange = (values) => {
    setIsStep5Valid(validationSchema.isValidSync(values));
  };
  let hola = "";

  const handleinsertaraChange = (e, setFieldValue, values) => {
    hola= e.target.value;

    setFieldValue('coin_CorreoElectronicoAlternativo', e.target.value);
    handleFormChange(values);
    insertarComerciante(values);
  };

  return (
    <Fragment>
      <div className="form-wizard-content">
        <Row>
          {!isLoading && (
            <Formik
              initialValues={{
                coin_TelefonoCelular: registro ? registro.coin_TelefonoCelular : "",
                coin_TelefonoFijo: registro ? registro.coin_TelefonoFijo : "",
                coin_CorreoElectronico: registro ? registro.coin_CorreoElectronico : "",
                coin_CorreoElectronicoAlternativo: registro ? registro.coin_CorreoElectronicoAlternativo : ""
              }}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, values, setFieldValue }) => (
                <form onBlur={handleSubmit} onChange={() => handleFormChange(values)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="coin_TelefonoCelular">Telefono celular</Label>
                        <Input
                          type="text"
                          name="coin_TelefonoCelular"
                          id="coin_TelefonoCelular"
                          value={values.coin_TelefonoCelular}
                          onChange={(e) => setFieldValue('coin_TelefonoCelular', e.target.value)}
                          placeholder="Ingrese su telefono celular.."
                        />
                        <ErrorMessage name="coin_TelefonoCelular" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="coin_TelefonoFijo">Telefono fijo</Label>
                        <Input
                          type="text"
                          name="coin_TelefonoFijo"
                          id="coin_TelefonoFijo"
                          value={values.coin_TelefonoFijo}
                          onChange={(e) => setFieldValue('coin_TelefonoFijo', e.target.value)}
                          placeholder="Ingrese su telefono fijo.."
                        />
                        <ErrorMessage name="coin_TelefonoFijo" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col md={6}>
                      <FormGroup>
                        <Label for="coin_CorreoElectronico">Correo electronico</Label>
                        <Input
                          type="text"
                          name="coin_CorreoElectronico"
                          id="coin_CorreoElectronico"
                          value={values.coin_CorreoElectronico}
                          onChange={(e) => setFieldValue('coin_CorreoElectronico', e.target.value)}
                          placeholder="Ingrese su correo electronico.."
                        />
                        <ErrorMessage name="coin_CorreoElectronico" component="div" className="text-danger" />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="coin_CorreoElectronicoAlternativo">Correo electronico alternativo</Label>
                        <Input
                          type="text"
                          name="coin_CorreoElectronicoAlternativo"
                          id="coin_CorreoElectronicoAlternativo"
                          value={values.coin_CorreoElectronicoAlternativo}
                          onChange={(e) => handleinsertaraChange(e, setFieldValue, values)}
                          placeholder="Ingrese su correo electronico alternativo.."
                        />
                        <ErrorMessage name="coin_CorreoElectronicoAlternativo" component="div" style={{ color: 'red' }} />
                      </FormGroup>
                    </Col>
                  </Row>
                </form>
              )}
            </Formik>
          )}
          {isLoading && <div>Cargando datos del comerciante...</div>}
        </Row>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default WizardStep5;
