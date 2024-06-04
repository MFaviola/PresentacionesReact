import React, { Fragment } from "react";
import { Route } from "react-router-dom";


import Comerciante from "./Comerciante";
import PersonaJuridica2 from "./PersonaJuridica";

import PersonaJuridica from "./Personas Juridicas/Persona Juridica";




import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";


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
          <Route path={`${match.url}/personajuridica2`} component={PersonaJuridica2}/>

        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Principales;
