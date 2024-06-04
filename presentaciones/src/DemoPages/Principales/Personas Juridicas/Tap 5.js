import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchemaStep5 = Yup.object().shape({
  doco_URLImagen: Yup.mixed().required('La imagen es requerida'),
});

const Tap5 = ({ pejuId, onNext }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("doco_URLImagen", file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('peju_Id', pejuId);
    formData.append('docoU_RLImagen', JSON.stringify({ documentos: [{ doco_URLImagen: values.doco_URLImagen.name }] }));
    formData.append('usua_UsuarioCreacion', 1);
    formData.append('doco_FechaCreacion', new Date().toISOString());

    try {
      const response = await axios.post('https://localhost:44380/api/DocumentosContratos/InsertarDocuPersonaJuridica', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'XApiKey': '4b567cb1c6b24b51ab55248f8e66e5cc',
          'EncryptionKey': 'FZWv3nQTyHYyNvdx'
        }
      });
      console.log('Insert response:', response.data);
      setSubmitting(false);
      toast.success("Documento subido correctamente");
      onNext(); 
    } catch (error) {
      // console.error('Error uploading document', error);
      // toast.error("Error al subir el documento.");
      setSubmitting(false);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={{ doco_URLImagen: null }}
      validationSchema={validationSchemaStep5}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="doco_URLImagen">Subir Imagen</Label>
                <Input type="file" name="doco_URLImagen" onChange={(event) => handleImageChange(event, setFieldValue)} />
                <ErrorMessage name="doco_URLImagen" component="div" style={{ color: 'red' }} />
              </FormGroup>
              {previewImage && (
                <div>
                  <img src={previewImage} alt="Vista previa" style={{ width: '100%', maxHeight: '300px' }} />
                </div>
              )}
            </Col>
          </Row>
          {/* <Button type="submit" color="primary">Subir</Button> */}
          <ToastContainer />
        </Form>
      )}
    </Formik>
  );
};

export default Tap5;
