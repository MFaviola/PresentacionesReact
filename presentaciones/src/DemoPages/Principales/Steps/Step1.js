import React, { useEffect, useState, useRef } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const urlOficina = 'https://localhost:44380/api/Oficinas'; 
const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const urlCivil = 'https://localhost:44380/api/EstadosCiviles'; 
const urlOficios = 'https://localhost:44380/api/Oficio_Profesiones'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const validationSchema = Yup.object().shape({
  pers_RTN: Yup.string()
    .required("El RTN es requerido.")
    .matches(/^\d{4}-\d{4}-\d{6}$/, "El RTN debe tener el formato 1234-5678-901232 y solo contener números y guiones."),
  pers_Nombre: Yup.string()
    .required("El nombre es requerido.")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo debe contener letras y acentos."),
  ofic_Id: Yup.number().required("La oficina es requerida."),
  escv_Id: Yup.number().required("El estado civil es requerido."),
  ofpr_Id: Yup.number().required("El oficio es requerido."),
  pers_escvRepresentante: Yup.number().required("El estado civil del representante es requerido."),
  pers_OfprRepresentante: Yup.number().required("El oficio del representante es requerido."),
});

const WizardStep1 = ({ onNext, childFormikSubmit, ideditar }) => {
  const [dataOficina, setDataOficina] = useState([]);
  const [dataCivil, setDataCivil] = useState([]);
  const [dataOficios, setDataOficios] = useState([]);
  const [registro, setRegistro] = useState(null);
  const [cargando, setcargando] = useState(true);
  const seEnvioRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await listarOficinas();
        await listarCiviles();
        await listarOficios();
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
        setcargando(false);
      }
    };

    fetchData();
  }, [ideditar]);

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
      const response = await axios.get(`${urlCivil}/Listar?escv_EsAduana=false`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada,
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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (seEnvioRef.current) return false;
    seEnvioRef.current = true;

    try {
      const fechaActual = new Date().toISOString();
      let ComercianteAInsertarr = {};

      if (ideditar != null) {
        ComercianteAInsertarr = {
          coin_Id: ideditar,
          pers_RTN: values.pers_RTN,
          pers_Nombre: values.pers_Nombre,
          ofic_Id: values.ofic_Id,
          escv_Id: values.escv_Id,
          ofpr_Id: values.ofpr_Id,
          pers_FormaRepresentacion: values.pers_FormaRepresentacion,
          pers_escvRepresentante: values.pers_escvRepresentante,
          pers_OfprRepresentante: values.pers_OfprRepresentante,
          usua_UsuarioModificacion: 1,
          coin_FechaModificacion: fechaActual
        };
      } else {
        ComercianteAInsertarr = {
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
      }

      const rtnvalidado = /^\d{4}-\d{4}-\d{6}$/.test(values.pers_RTN);
      console.log('comerciante insertado', ComercianteAInsertarr, 'rtn es valido?', rtnvalidado);

      if (rtnvalidado) {
        const response = await axios.post(`${urlAPI}/Insertar`, ComercianteAInsertarr, {
          headers: {
            'XApiKey': keyAPI,
            'EncryptionKey': keyencriptada
          }
        });
        setSubmitting(false);
        toast.success("GUARDADO");
        seEnvioRef.current = false;
        return true;
      } else {
        toast.error("Inserte un RTN Valido");
        setSubmitting(false);
        seEnvioRef.current = false;
        return false;
      }
    } catch (error) {
      toast.error("Error al insertar datos.");
      setSubmitting(false);
      seEnvioRef.current = false;
      return false;
    }
  };

  return (
    <Row>
      {!cargando && (
        <Formik
          initialValues={{
            pers_RTN: registro ? registro.pers_RTN : "",
            pers_Nombre: registro ? registro.pers_Nombre : "",
            ofic_Id: registro ? registro.ofic_Id : "",
            escv_Id: registro ? registro.escv_Id : "",
            ofpr_Id: registro ? registro.ofpr_Id : "",
            pers_FormaRepresentacion: registro ? registro.pers_FormaRepresentacion : false,
            pers_escvRepresentante: registro ? registro.pers_escvRepresentante : "",
            pers_OfprRepresentante: registro ? registro.pers_OfprRepresentante : ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, values, setFieldValue }) => {
            if (childFormikSubmit) {
              childFormikSubmit.current = handleSubmit;
            }
            return (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_RTN">RTN</Label>
                      <Field
                        name="pers_RTN"
                        as={Input}
                        className="form-control"
                        placeholder="Ingrese su RTN.."
                      />
                      <ErrorMessage name="pers_RTN" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_Nombre">Nombre</Label>
                      <Field
                        name="pers_Nombre"
                        as={Input}
                        className="form-control"
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
                      <Field
                        name="ofic_Id"
                        as="select"
                        className="form-control"
                      >
                        <option value="">Seleccione su oficina</option>
                        {dataOficina.map(oficina => (
                          <option key={oficina.ofic_Id} value={oficina.ofic_Id}>{oficina.ofic_Nombre}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="ofic_Id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="escv_Id">Estado Civil</Label>
                      <Field
                        name="escv_Id"
                        as="select"
                        className="form-control"
                      >
                        <option value="">Seleccione su estado civil</option>
                        {dataCivil.map(civil => (
                          <option key={civil.escv_Id} value={civil.escv_Id}>
                            {civil.escv_Nombre}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="escv_Id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ofpr_Id">Oficio</Label>
                      <Field
                        name="ofpr_Id"
                        as="select"
                        className="form-control"
                      >
                        <option value="">Seleccione su oficio</option>
                        {dataOficios.map(oficio => (
                          <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
                            {oficio.ofpr_Nombre}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="ofpr_Id" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_FormaRepresentacion">Forma de representacion</Label>
                      <Col sm={12} style={{ padding: 0 }}>

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
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_escvRepresentante">Estado Civil Representante</Label>
                      <Field
                        name="pers_escvRepresentante"
                        as="select"
                        className="form-control"
                      >
                        <option value="">Seleccione el estado civil del representante</option>
                        {dataCivil.map(civil => (
                          <option key={civil.escv_Id} value={civil.escv_Id}>
                            {civil.escv_Nombre}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pers_escvRepresentante" component="div" className="text-danger" />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pers_OfprRepresentante">Oficio Representante</Label>
                      <Field
                        name="pers_OfprRepresentante"
                        as="select"
                        className="form-control"
                      >
                        <option value="">Seleccione el oficio del representante</option>
                        {dataOficios.map(oficio => (
                          <option key={oficio.ofpr_Id} value={oficio.ofpr_Id}>
                            {oficio.ofpr_Nombre}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pers_OfprRepresentante" component="div" className="text-danger" />
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

export default WizardStep1;
