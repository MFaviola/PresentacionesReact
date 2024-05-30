// src/components/UnidadesDeMedidas.js
import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Servicios from '../../servicios'; // Asegúrate de que la ruta sea correcta

const UnidadesDeMedidas = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [editarr, setEditar] = useState(false); 
  const [editUnidadesDeMedidasId, setEditUnidadesDeMedidasId] = useState(null); 
  const [nuevaUnidadesDeMedidas, setNuevaUnidadesDeMedidas] = useState({ unme_Descripcion: "", unme_EsAduana: false });
  const [elimUnidadesDeMedidasId, setElimUnidadesDeMedidasId] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [detalleUnidadesDeMedidas, setDetalleUnidadesDeMedidas] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarUnidadesDeMedidas = async () => {
    try {
      const response = await Servicios.listarUnidadesDeMedidas();
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar UnidadesDeMedidas', error);
    }
  };

  const insertarUnidadesDeMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAInsertar = {
        unme_Descripcion: values.unme_Descripcion,
        unme_EsAduana: values.unme_EsAduana, 
        usua_UsuarioCreacion: 1,
        unme_FechaCreacion: fechaActual,
      };

      console.log('Datos enviados para insertar:', UnidadesDeMedidasAInsertar); 

      await Servicios.insertarUnidadesDeMedidas(UnidadesDeMedidasAInsertar);
      await listarUnidadesDeMedidas();
      resetForm();
      setCollapse(false);
      toast.success("UnidadesDeMedidas insertada exitosamente!");

    } catch (error) {
      console.error('Error al insertar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al insertar la UnidadesDeMedidas.");
    }
  };

  const editarUnidadesDeMedidas = async (values, { resetForm }) => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAEditar = {
        unme_Id: editUnidadesDeMedidasId, 
        unme_Descripcion: values.unme_Descripcion,
        unme_EsAduana: values.unme_EsAduana, 
        usua_UsuarioModificacion: 1, 
        unme_FechaModificacion: fechaActual,
      };

      console.log('Datos enviados para editar:', UnidadesDeMedidasAEditar); 

      await Servicios.editarUnidadesDeMedidas(UnidadesDeMedidasAEditar);
      await listarUnidadesDeMedidas();
      resetForm();
      setCollapse(false);
      setEditar(false);
      setEditUnidadesDeMedidasId(null); 
      toast.success("UnidadesDeMedidas editada exitosamente!");

    } catch (error) {
      console.error('Error al editar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al editar la UnidadesDeMedidas.");
    }
  };

  const eliminarUnidadesDeMedidas = async () => {
    try {
      const fechaActual = new Date().toISOString(); 
      const UnidadesDeMedidasAEliminar = {
        unme_Id: elimUnidadesDeMedidasId,
        usua_UsuarioEliminacion: 1,
        unme_FechaEliminacion: fechaActual
      };

      await Servicios.eliminarUnidadesDeMedidas(UnidadesDeMedidasAEliminar);
      await listarUnidadesDeMedidas();
      setConfirmarEliminar(false);
      toast.success("UnidadesDeMedidas eliminada exitosamente!");

    } catch (error) {
      console.error('Error al eliminar UnidadesDeMedidas:', error.response.data); 
      toast.error("Error al eliminar la UnidadesDeMedidas.");
    }
  };


  useEffect(() => {
    listarUnidadesDeMedidas();
  }, []);

  return (
    <Fragment>
      {/* Aquí va el resto de tu componente */}
    </Fragment>
  );
};

export default UnidadesDeMedidas;
