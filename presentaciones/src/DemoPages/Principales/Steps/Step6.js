// import React, { useEffect, useState } from "react";
// import { Formik, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';


// const urlAPI = 'https://localhost:44380/api/ComercianteIndividual';
// const urlDocumento= 'https://localhost:44380/api/DocumentosContratos';
// const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
// const keyencriptada = 'FZWv3nQTyHYyNvdx';

// const validationSchemaStep5 = Yup.object().shape({
//   doco_URLImagen: Yup.mixed().required('La imagen es requerida'),
// });

// const WizardStep6 = ({ onNext, childFormikSubmit }) => {
//   const [ultimoCoinId, setUltimoCoinId] = useState(null);


//   useEffect(() => {
//     listarComerciantes();
//   }, []);

//   const listarComerciantes = async () => {
//     try {
//       const response = await axios.get(`${urlAPI}/Listar`, {
//         headers: {
//           'XApiKey': keyAPI,
//           'EncryptionKey': keyencriptada
//         }
//       });
//       const lista = response.data.data;
//       const ultimoObjeto = lista[lista.length - 1];
//       setUltimoCoinId(ultimoObjeto.coin_Id);
//     } catch (error) {
//       toast.error("Error al listar los comerciantes.");
//     }
//   };

//   const handleImageChange = (event, setFieldValue) => {
//     const file = event.currentTarget.files[0];
//     setFieldValue("doco_URLImagen", file);
//     setPreviewImage(URL.createObjectURL(file));
//   };

  
//   const handleSubmit = async (values, { setSubmitting }) => {
//     const formData = new FormData();
//     formData.append('peju_Id', pejuId);
//     formData.append('docoU_RLImagen', JSON.stringify({ documentos: [{ doco_URLImagen: values.doco_URLImagen.name }] }));
//     formData.append('usua_UsuarioCreacion', 1);
//     formData.append('doco_FechaCreacion', new Date().toISOString());

//     try {
//       const response = await axios.post(`${urlAPI}/InsertarTap2`, ComercianteAInsertar, {
//         headers: {
//           'XApiKey': keyAPI,
//           'EncryptionKey': keyencriptada
//         }
//       });
//       setSubmitting(false);
//     } catch (error) {
//       toast.error("Error al insertar datos.");
//       setSubmitting(false);
//       throw error;
//     }
//   };

//   return (
//     <Row>
//     <Formik
//       initialValues={{
//         pvin_Id: "",
//         ciud_Id: "",
//         alde_Id: "",
//         colo_Id: "",
//         coin_NumeroLocalApart:"",
//         coin_PuntoReferencia: ""
//       }}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({ handleSubmit, values, setFieldValue }) => {
//         if (childFormikSubmit) {
//           childFormikSubmit.current = handleSubmit;
//         }
//         return (
//           <Form onSubmit={handleSubmit}>
//             <Row>
//             <Col md={6}>
//                 <FormGroup>
//                   <Label for="pvin_Id">Provincia</Label>
//                   <Field
//                     name="pvin_Id"
//                     as="select"
//                     className="form-control"
//                     onChange={(e) => ProvinciaCambio(e, setFieldValue)}
//                   >
//                     <option value="">Seleccione su provincia</option>
//                     {dataProvincia.map(provincia => (
//                       <option key={provincia.pvin_Id} value={provincia.pvin_Id}>{provincia.pvin_Nombre}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="pvin_Id" component="div" className="text-danger" />
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="ciud_Id">Ciudad</Label>
//                   <Field
//                     name="ciud_Id"
//                     as="select"
//                     className="form-control"
//                     onChange={(e) => CiudadCambio(e, setFieldValue)}
//                   >
//                     <option value="">Seleccione su ciudad</option>
//                     {dataCiudad.map(ciudad => (
//                       <option key={ciudad.ciud_Id} value={ciudad.ciud_Id}>{ciudad.ciud_Nombre}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="ciud_Id" component="div" className="text-danger" />
//                 </FormGroup>
//               </Col>
             
//             </Row>
//             <Row>
//             <Col md={6}>
//                 <FormGroup>
//                   <Label for="alde_Id">Aldea</Label>
//                   <Field
//                     name="alde_Id"
//                     as="select"
//                     className="form-control"
//                   >
//                     <option value="">Seleccione su aldea</option>
//                     {dataAldea.map(aldea => (
//                       <option key={aldea.alde_Id} value={aldea.alde_Id}>{aldea.alde_Nombre}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="alde_Id" component="div" className="text-danger" />
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="colo_Id">Colonia</Label>
//                   <Field
//                     name="colo_Id"
//                     as="select"
//                     className="form-control"
//                   >
//                     <option value="">Seleccione su colonia</option>
//                     {dataColonia.map(colonia => (
//                       <option key={colonia.colo_Id} value={colonia.colo_Id}>{colonia.colo_Nombre}</option>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="colo_Id" component="div" className="text-danger" />
//                 </FormGroup>
//               </Col>
             
//             </Row>
//             <Row>
//             <Col md={6}>
//                 <FormGroup>
//                   <Label for="coin_NumeroLocalApart">Número Local del Apartamento</Label>
//                   <Field
//                     name="coin_NumeroLocalApart"
//                     as={Input}
//                     className="form-control"
//                     placeholder="Ingrese su número local..."
//                   />
//                   <ErrorMessage name="coin_NumeroLocalApart" component="div" className="text-danger"/>
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="coin_PuntoReferencia">Punto de Referencia</Label>
//                   <Field
//                     name="coin_PuntoReferencia"
//                     as={Input}
//                     className="form-control"
//                     placeholder="Ingrese su punto de referencia..."
//                   />
//                   <ErrorMessage name="coin_PuntoReferencia" component="div" className="text-danger" />
//                 </FormGroup>
//               </Col>
//             </Row>
//             <ToastContainer />
//             </Form>
//             );
//           }}
//         </Formik>
//     </Row>
//   );
// };

// export default WizardStep6;
