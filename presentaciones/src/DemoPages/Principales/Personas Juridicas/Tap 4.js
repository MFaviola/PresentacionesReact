import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';

const validationSchemaStep4 = Yup.object().shape({
  peju_TelefonoEmpresa: Yup.string().required('Teléfono Empresa es requerido'),
  peju_TelefonoFijoRepresentanteLegal: Yup.string().required('Teléfono Fijo Representante Legal es requerido'),
  peju_TelefonoRepresentanteLegal: Yup.string().required('Teléfono Representante Legal es requerido'),
  peju_CorreoElectronico: Yup.string().email('Correo Electrónico no es válido').required('Correo Electrónico es requerido'),
  peju_CorreoElectronicoAlternativo: Yup.string().email('Correo Electrónico Alternativo no es válido').nullable(),
});

const Tap4 = ({ initialValues, onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchemaStep4}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => (
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
      </Form>
    )}
  </Formik>
);

export default Tap4;
