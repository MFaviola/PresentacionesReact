import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Col, Row, Button, InputGroup, InputGroupText } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep4 = Yup.object().shape({
  peju_TelefonoEmpresa: Yup.string().required('Teléfono Empresa es requerido'),
  peju_TelefonoFijoRepresentanteLegal: Yup.string().required('Teléfono Fijo Representante Legal es requerido'),
  peju_TelefonoRepresentanteLegal: Yup.string().required('Teléfono Representante Legal es requerido'),
  peju_CorreoElectronico: Yup.string().email('Correo Electrónico no es válido').required('Correo Electrónico es requerido'),
  peju_CorreoElectronicoAlternativo: Yup.string().email('Correo Electrónico Alternativo no es válido').nullable(),
});

const Tap4 = ({ initialValues, pejuId, onNext, childFormikSubmit }) => {
  const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
  const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  const keyencriptada = 'FZWv3nQTyHYyNvdx';

  const [confirmacionCodigo, setConfirmacionCodigo] = useState('');
  const [confirmacionCodigoAlternativo, setConfirmacionCodigoAlternativo] = useState('');
  const [enviarCodigo, setEnviarCodigo] = useState('');
  const [enviarCodigoAlternativo, setEnviarCodigoAlternativo] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const dataToSubmit = {
        ...values,
        peju_Id: pejuId,
        usua_UsuarioModificacion: 1,
        peju_FechaModificacion: fechaActual
      };

      const response = await axios.post(`${urlAPI}/InsertarTap4`, dataToSubmit, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      console.log('Insert response:', response.data);
      setSubmitting(false);
      onNext(); 
    } catch (error) {
      setSubmitting(false);
      throw error; 
    }
  };

  const codigoenviado = async (correo) => {
    const fechaActual = new Date().toISOString(); 

    const insertarcorreo = {
      peju_Id: 3,
      peju_CorreoElectronico: correo,
      usua_UsuarioModificacion: 1,
      peju_FechaModificacion: fechaActual,
      peju_TelefonoEmpresa:"",
      peju_TelefonoFijoRepresentanteLegal:"",
      peju_TelefonoRepresentanteLegal:"",
      peju_CorreoElectronicoAlternativo:""
    };
    console.log(insertarcorreo);

    try {
      await axios.post(`${urlAPI}/InsertarTap4`, insertarcorreo, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      const response = await axios.get(`${urlAPI}/EnviarCodigo?correo=${correo}`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      console.log(response);

      toast.success("Código enviado con éxito!");
    } catch (error) {
      toast.error("Error al enviar el código.");
    }
  };

  const confirmarcodigo = async (codigo) => {
    try {
      const response = await axios.post(`${urlAPI}/ConfirmarCodigo?codigo=${codigo}`, {}, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      if (response.data.message === "Exito") {
        toast.success("Correo confirmado con éxito!");
      } else {
        toast.error("Código incorrecto.");
      }
    } catch (error) {
      toast.error("Código incorrecto.");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemaStep4}
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
                  <Label for="peju_TelefonoEmpresa">Teléfono Empresa</Label>
                  <Field name="peju_TelefonoEmpresa" as={Input} />
                  <ErrorMessage name="peju_TelefonoEmpresa" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_TelefonoFijoRepresentanteLegal">Teléfono Fijo Representante Legal</Label>
                  <Field name="peju_TelefonoFijoRepresentanteLegal" as={Input} />
                  <ErrorMessage name="peju_TelefonoFijoRepresentanteLegal" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_TelefonoRepresentanteLegal">Teléfono Representante Legal</Label>
                  <Field name="peju_TelefonoRepresentanteLegal" as={Input} />
                  <ErrorMessage name="peju_TelefonoRepresentanteLegal" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_CorreoElectronico">Correo Electrónico</Label>
                  <InputGroup>
                    <Field
                      name="peju_CorreoElectronico"
                      as={Input}
                      onChange={(e) => {
                        setFieldValue('peju_CorreoElectronico', e.target.value);
                        setEnviarCodigo(e.target.value);
                      }}
                    />
                    <InputGroupText>
                      <Button color="secondary" onClick={() => codigoenviado(enviarCodigo)}>Enviar código</Button>
                    </InputGroupText>
                  </InputGroup>
                  <ErrorMessage name="peju_CorreoElectronico" component="div" style={{ color: 'red' }} />
                  <InputGroup className="mt-2">
                    <Field
                      name="codigoConfirmacion"
                      as={Input}
                      placeholder="Ingrese el código de confirmación..."
                      onChange={(e) => setConfirmacionCodigo(e.target.value)}
                    />
                    <InputGroupText>
                      <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigo(confirmacionCodigo)}>
                        Confirmar Código
                      </Button>
                    </InputGroupText>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                  <InputGroup>
                    <Field
                      name="peju_CorreoElectronicoAlternativo"
                      as={Input}
                      onChange={(e) => {
                        setFieldValue('peju_CorreoElectronicoAlternativo', e.target.value);
                        setEnviarCodigoAlternativo(e.target.value);
                      }}
                    />
                    <InputGroupText>
                      <Button color="secondary" onClick={() => codigoenviado(enviarCodigoAlternativo)}>Enviar código</Button>
                    </InputGroupText>
                  </InputGroup>
                  <ErrorMessage name="peju_CorreoElectronicoAlternativo" component="div" style={{ color: 'red' }} />
                  <InputGroup className="mt-2">
                    <Field
                      name="codigoConfirmacionAlternativo"
                      as={Input}
                      placeholder="Ingrese el código de confirmación alternativo..."
                      onChange={(e) => setConfirmacionCodigoAlternativo(e.target.value)}
                    />
                    <InputGroupText>
                      <Button className="btn-shadow" color="alternate" onClick={() => confirmarcodigo(confirmacionCodigoAlternativo)}>
                        Confirmar Código
                      </Button>
                    </InputGroupText>
                  </InputGroup>
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

export default Tap4;
