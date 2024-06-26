import React, { Component } from "react";
import { Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const getNavStates = (indx, length) => {
  let styles = [];
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push("done");
    } else if (i === indx) {
      styles.push("doing");
    } else {
      styles.push("todo");
    }
  }
  return { current: indx, styles: styles };
};

const checkNavState = (currentStep, stepsLength) => {
  if (currentStep > 0 && currentStep < stepsLength - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true,
    };
  } else if (currentStep === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true,
    };
  } else {
    return {
      showPreviousBtn: true,
      showNextBtn: false,
    };
  }
};

export default class MultiStep extends Component {
  constructor(props) {
    super(props);
    this.childFormikSubmit = React.createRef();
    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: 0,
      navState: getNavStates(0, this.props.steps.length),
      isStep1Valid: false,
    };
  }

  setNavState = (next) => {
    this.setState({
      navState: getNavStates(next, this.props.steps.length),
    });
    if (next < this.props.steps.length) {
      this.setState({ compState: next });
    }
    this.setState(checkNavState(next, this.props.steps.length));
  };

  handleKeyDown = (evt) => {
    if (evt.which === 13) {
      this.next();
    }
  };

  handleOnClick = (evt) => {
    if (
      evt.currentTarget.value === this.props.steps.length - 1 &&
      this.state.compState === this.props.steps.length - 1
    ) {
      this.setNavState(this.props.steps.length);
    } else {
      this.setNavState(evt.currentTarget.value);
    }
  };

  next = async () => {
    try {
      await this.childFormikSubmit.current();
      this.setNavState(this.state.compState + 1);
    } catch (error) {
      toast.error("Los campos son obligatorios.");
    }
  };

  previous = () => {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  };

  getClassName = (className, i) => {
    return className + "-" + this.state.navState.styles[i];
  };

  renderSteps = () => {
    return this.props.steps.map((s, i) => (
      <li
        className={this.getClassName("form-wizard-step", i)}
        onClick={this.handleOnClick}
        key={i}
        value={i}
      >
        <em>{i + 1}</em>
        <span>{this.props.steps[i].name}</span>
      </li>
    ));
  };

  render() {
    const { steps } = this.props;
    const { compState } = this.state;

    return (
      <div onKeyDown={this.handleKeyDown}>
        <ol className="forms-wizard">{this.renderSteps()}</ol>
        {React.cloneElement(steps[compState].component, { childFormikSubmit: this.childFormikSubmit })}
        <div className="divider" />
        <div className="clearfix">
          <div style={this.props.showNavigation ? {} : { display: "none" }}>
            <Button color="secondary" className="btn-shadow float-start btn-wide btn-pill" outline
              style={this.state.showPreviousBtn ? {} : { display: "none" }} onClick={this.previous}>
              Volver
            </Button>
           
            <Button color="primary" className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
              style={this.state.showNextBtn ? {} : { display: "none" }} onClick={this.next}>
              Siguiente
            </Button>
            <Button color="light" className="mb-2 me-2 btn-shadow btn-wide float-end btn-pill btn-hover-shine"
              onClick={this.props.onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

MultiStep.defaultProps = {
  showNavigation: true,
};
