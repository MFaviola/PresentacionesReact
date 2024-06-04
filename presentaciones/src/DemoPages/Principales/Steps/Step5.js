import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input, Form,Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

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

const WizardStep5 = ({ onNext, childFormikSubmit,ideditar }) => {
  const [data, setData] = useState([]);
  const [registro, setRegistro] = useState(null);
  const [cargabdo, setcargabdo] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await listarComerciantes();
        if (ideditar) {
          const response = await axios.get(`${urlAPI}/Listar`, {
            headers: {
              'XApiKey': keyAPI,
              'EncryptionKey': keyencriptada
            }
          });
          const lista = response.data.data;
          const registroo = lista.find((list) => list.coin_Id === ideditar);
          setRegistro(registroo);
        }
      } catch (error) {
        console.error('Error al obtener detalles del comerciante', error);
        toast.error("Error al obtener los detalles del comerciante.");
      } finally {
        setcargabdo(false);
      }
    };
  
    fetchData();
  }, [ideditar]);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    const fechaActual = new Date().toISOString(); 

    const ComercianteAInsertar = {
      coin_Id: ideditar || tab3,
      coin_TelefonoCelular: values.coin_TelefonoCelular,
      coin_TelefonoFijo: values.coin_TelefonoFijo,
      coin_CorreoElectronicoAlternativo: values.coin_CorreoElectronicoAlternativo,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual,
    };

    try {
      const response = await axios.post(`${urlAPI}/InsertarTap4`, ComercianteAInsertar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setSubmitting(false);
      onNext();
    } catch (error) {
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      throw error;
    }
  };

  const [confirmacionCodigo, setConfirmacionCodigo] = useState('');
  const [enviarCodigo, setEnviarCodigo] = useState('');


  const codigoenviado = (correo) => {
    const fechaActual = new Date().toISOString(); 

    const insertarcorreo = {
      coin_Id: tab3,
      coin_CorreoElectronico: correo,
      usua_UsuarioModificacion: 1,
      coin_FechaModificacion: fechaActual,
    };
    console.log(insertarcorreo);

      const response =  axios.post(`${urlAPI}/InsertarTap4`, insertarcorreo, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      const escorreo = insertarcorreo.coin_CorreoElectronico;
      console.log(escorreo);

      const responsee = axios.get(`${urlAPI}/EnviarCodigo?correo=${escorreo}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
  };
  
  const confirmarcodigo = (codigo) => {
    const fechaActual = new Date().toISOString(); 

      const response =  axios.post(`${urlAPI}/ConfirmarCodigo?codigo=${codigo}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      toast.success("Correo confirmado con exito!");
  };

  return (
    <Row>
      {!cargabdo && (
        <Formik
          initialValues={{
            coin_TelefonoCelular: registro ? registro.coin_TelefonoCelular : "",
            coin_TelefonoFijo: registro ? registro.coin_TelefonoFijo : "",
            coin_CorreoElectronico: registro ? registro.coin_CorreoElectronico : "",
            coin_CorreoElectronicoAlternativo: registro ? registro.coin_CorreoElectronicoAlternativo : ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, setFieldValue }) => {
            if (childFormikSubmit) {
              childFormikSubmit.current = handleSubmit;
            }
            return (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coin_TelefonoCelular">Teléfono Celular</Label>
                      <Field
                        name="coin_TelefonoCelular"
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese su teléfono celular..."
                      />
                      <ErrorMessage name="coin_TelefonoCelular" component="div"className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="coin_TelefonoFijo">Teléfono Fijo</Label>
                      <Field
                        name="coin_TelefonoFijo"
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese su teléfono fijo..."
                      />
                      <ErrorMessage name="coin_TelefonoFijo" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="coin_CorreoElectronico">Correo Electrónico</Label>
                      <Field
                        name="coin_CorreoElectronico"
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese su correo electrónico..."
                        onChange={(e) => setEnviarCodigo(e.target.value)}

                      />
                      <ErrorMessage name="coin_CorreoElectronico" component="div" className="text-danger"/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <br></br>
                    <Button className=" btn-shadow" color="alternate" onClick={() => codigoenviado(enviarCodigo)}>
                    Enviar codigo
                  </Button>
                    </FormGroup>
                  
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Codigo confirmacion</Label>
                      <Field
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese el codigo de confirmacion.."
                        onChange={(e) => setConfirmacionCodigo(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <br></br>
                      <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigo(confirmacionCodigo)}>
                        Confirmar Codigo
                      </Button>

                    </FormGroup>
                  
                  </Col>
                  
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="coin_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                      <Field
                        name="coin_CorreoElectronicoAlternativo"
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese su correo electrónico alternativo..."
                      />
                      <ErrorMessage name="coin_CorreoElectronicoAlternativo" component="div" className="text-danger"/>
                    </FormGroup>
                  </Col>
                </Row>
                <ToastContainer />
              </Form>
            );
          }}
        </Formik>
      )}
    </Row>
  );
};

export default WizardStep5;
