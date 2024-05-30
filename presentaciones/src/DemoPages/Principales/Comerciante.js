import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col, Card, CardBody, Button, Collapse, Form, FormGroup, Label, Input } from "reactstrap";
import DataTable from 'react-data-table-component';
import PageTitle from "../../Layout/AppMain/PageTitle";
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MultiStep from "./Wizard";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";

const steps = [
  { name: "Datos Personales", component: <Step1 /> },
  { name: "Direccion", component: <Step2 /> },
  { name: "Direccion 2", component: <Step3 /> },
  { name: "A saber", component: <Step3 /> },
  { name: "Finish Wizard", component: <Step4 /> },
];

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const Comerciante = () => {
  const [data, setData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [elimComercianteId, setElimComercianteId] = useState(null);

  const toggleCollapse = () => setCollapse(!collapse);

  const listarComerciantes = async () => {
    try {
      const response = await axios.get(`${urlAPI}/Listar`, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error al listar Comerciantes', error);
      toast.error("Error al listar los comerciantes.");
    }
  };

  const eliminarComerciante = async () => {
    try {
      const fechaActual = new Date().toISOString(); 
      const ComercianteAEliminar = {
        comerciante_Id: elimComercianteId,
        usua_UsuarioEliminacion: 1,
        comerciante_FechaEliminacion: fechaActual
      };
      const response = await axios.post(`${urlAPI}/Eliminar`, ComercianteAEliminar, {
        headers: {
          'XApiKey': keyAPI,
          'EncryptionKey': keyencriptada
        }
      });

      listarComerciantes();
      setConfirmarEliminar(false);
      toast.success("Comerciante eliminado exitosamente!");

    } catch (error) {
      console.error('Error al eliminar Comerciante', error);
      toast.error("Error al eliminar el comerciante.");
    }
  };

  const eliminarComercianteClick = (ComercianteId) => {
    setElimComercianteId(ComercianteId);
    setConfirmarEliminar(true);
  };

  const cancelarEliminacion = () => {
    setElimComercianteId(null);
    setConfirmarEliminar(false);
  };

  useEffect(() => {
    listarComerciantes();
  }, []);

  const botonesAcciones = row => (
    <div>
      <Button className="mb-2 me-2 btn-shadow" color="danger" onClick={() => eliminarComercianteClick(row.comerciante_Id)}>
        Eliminar
      </Button>
    </div>
  );

  const columns = [
    {
      name: "RTN",
      selector: row => row.pers_RTN,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: row => row.pers_Nombre,
      sortable: true,
    },
    {
      name: "Correo Electronico",
      selector: row => row.coin_CorreoElectronico,
      sortable: true,
    },
    {
      name: "Telefono Celular",
      selector: row => row.coin_TelefonoCelular,
      sortable: true,
    },
    {
      name: "Oficio",
      selector: row => row.ofpr_Nombre,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => botonesAcciones(row),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px", 
    }
  ];

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" timeout={1500} enter={false} exit={false}>
          <div>
            <PageTitle
              heading="Comerciante Individual"
              icon="pe-7s-portfolio icon-gradient bg-sunny-morning"
            />
            <Row>
              <Col md="12">
                {!collapse && (
                  <Button color="primary" onClick={toggleCollapse} className="mb-3">Nuevo</Button>
                )}
                <Collapse isOpen={collapse}>
                  <Card className="main-card mb-3">
                    <CardBody>
                      <div className="forms-wizard-alt">
                        <MultiStep showNavigation={true} steps={steps} onCancel={() => setCollapse(false)} />
                      </div>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
              {!collapse && (
                <Col md="12">
                  <Card className="main-card mb-3">
                    <CardBody>
                      <DataTable
                        data={data}
                        columns={columns}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                      />
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <SweetAlert
        title="Eliminar Comerciante"
        show={confirmarEliminar}
        showCancel
        confirmBtnText="Eliminar"
        confirmBtnBsStyle="danger"
        cancelBtnText="Cancelar"
        onConfirm={eliminarComerciante}
        onCancel={cancelarEliminacion}>
        ¿Está seguro que desea eliminar el comerciante?
      </SweetAlert>
      <ToastContainer />
    </Fragment>
  );
};

export default Comerciante;
