import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Col, Row, Button } from 'reactstrap';
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
      toast.success("Datos insertados correctamente");
      onNext(); // Move to the next step
    } catch (error) {
      console.error('Error inserting data', error);
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      throw error; // Ensure error is caught by the caller
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemaStep4}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => {
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
                  <Field name="peju_CorreoElectronico" as={Input} />
                  <ErrorMessage name="peju_CorreoElectronico" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="peju_CorreoElectronicoAlternativo">Correo Electrónico Alternativo</Label>
                  <Field name="peju_CorreoElectronicoAlternativo" as={Input} />
                  <ErrorMessage name="peju_CorreoElectronicoAlternativo" component="div" style={{ color: 'red' }} />
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" color="primary">Guardar</Button>
            <ToastContainer />
          </Form>
        );
      }}
    </Formik>
  );
};

export default Tap4;
