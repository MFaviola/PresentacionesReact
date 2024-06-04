import React, { Fragment, useEffect, useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";

const urlAPI = 'https://localhost:44380/api/ComercianteIndividual'; 
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const WizardStep4 = ({ onFinish }) => {
  const [id, setId] = useState(null);

  useEffect(() => {
    listarComerciantes();
  }, []);

  const listarComerciantes = async () => {
    const response = await axios.get(`${urlAPI}/Listar`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    const listaentera = response.data.data;
    const ultimo = listaentera[listaentera.length - 1];
    setId(ultimo.coin_Id); 
  };

  const handleFinish = async () => {
    await axios.post(`${urlAPI}/FinalizarContrato?coin_Id=${id}`, {}, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
    toast.success("Datos guardados con exito!");
    
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <Fragment>
      <div className="form-wizard-content">
        <div className="no-results">
          <div className="sa-icon sa-success animate">
            <span className="sa-line sa-tip animateSuccessTip" />
            <span className="sa-line sa-long animateSuccessLong" />
            <div className="sa-placeholder" />
            <div className="sa-fix" />
          </div>
          <div className="results-subtitle mt-4">Formulario listo!</div>
          <div className="results-title">
            Desea finalizar el formulario?
          </div>
          <div className="mt-3 mb-3" />
          <div className="text-center">
            <Button color="success" size="lg" className="btn-shadow btn-wide" onClick={handleFinish}>
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WizardStep4;
