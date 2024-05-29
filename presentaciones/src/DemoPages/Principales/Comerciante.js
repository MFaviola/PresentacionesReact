import React, { Fragment, Component } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Card,
  CardBody,
  Row,
  Col,
  Collapse,
  CardHeader,
  CardFooter,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from 'axios';


import MultiStep from "./Wizard";
import PageTitle from "../../Layout/AppMain/PageTitle";
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

export default class Comerciante extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      cSelected: [],
      dropdownOpen: false,
      collapse: false,
    };

    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  toggleCollapse() {
    this.setState((prevState) => ({
      collapse: !prevState.collapse,
    }));
  }
  
  // listarComerciantes() {
  //   const urlAPI = 'https://localhost:44380/api/Estilos'; 
  //   const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
  //   const keyencriptada = 'FZWv3nQTyHYyNvdx';
    
  //   try {
  //     const response =  axios.get(`${urlAPI}/Listar`, {
  //       headers: {
  //         'XApiKey': keyAPI,
  //         'EncryptionKey': keyencriptada
  //       }
  //     });
  //     setData(response.data.data);
  //   } catch (error) {
  //     console.error('Error al listar Estilos', error);
  //   }
  // }

  handleCancel() {
    this.setState({ collapse: false });
  }

  onMouseEnter() {
    this.setState({ dropdownOpen: true });
  }

  onMouseLeave() {
    this.setState({ dropdownOpen: false });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  render() {
    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition
            component="div"
            classNames="TabsAnimation"
            appear={true}
            timeout={1500}
            enter={false}
            exit={false}
          >
            <div>
              <PageTitle
                heading="Comerciante Individual"
                icon="pe-7s-portfolio icon-gradient bg-sunny-morning"
              />
              <Row>
                <Col md="12">
                  {!this.state.collapse && (
                    <Button
                      color="primary"
                      onClick={this.toggleCollapse}
                      className="mb-3"
                    >
                      Nuevo
                    </Button>
                  )}
                  <Collapse isOpen={this.state.collapse}>
                    <Card className="main-card mb-3">
                      <CardBody>
                        <div className="forms-wizard-alt">
                         <MultiStep showNavigation={true} steps={steps} onCancel={this.handleCancel} />
                        </div>
                      </CardBody>
                    </Card>
                  </Collapse>
                </Col>
              </Row>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}