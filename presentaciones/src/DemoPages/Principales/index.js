import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// Principales

import Comerciante from "./Comerciante";
import PersonaJuridica from "./Personas Juridicas/Persona Juridica";



// Layout

import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";

// Theme Options

import ThemeOptions from "../../Layout/ThemeOptions/";

const Principales = ({ match }) => (
  <Fragment>
    <ThemeOptions />
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          <Route path={`${match.url}/comerciante`} component={Comerciante}/>
          <Route path={`${match.url}/personajuridica`} component={PersonaJuridica}/>

        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Principales;
