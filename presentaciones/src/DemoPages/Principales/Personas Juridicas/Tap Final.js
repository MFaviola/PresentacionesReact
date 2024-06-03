import React, { Fragment } from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const TapFinal = () => {
  const history = useHistory();

  const handleFinish = () => {
    history.push("/"); 
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
          <div className="results-subtitle mt-4">¡Terminado!</div>
          <div className="results-title">
            ¡Has llegado al último paso del asistente!
          </div>
          <div className="mt-3 mb-3" />
          <div className="text-center">
            <Button
              color="success"
              size="lg"
              className="btn-shadow btn-wide"
              onClick={handleFinish}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TapFinal;
