import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// Tables

import DataTableFixedHeader from "./DataTables/Examples/FixedHeader";
import Marcas from "./DataTables/Examples/Marcas";
import Formasdepago from "./DataTables/Examples/Formas de Pago";
import UnidadesDeMedida from "./DataTables/Examples/UnidadesDeMedida";


// Layout

import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";

// Theme Options

import ThemeOptions from "../../Layout/ThemeOptions/";

const Tables = ({ match }) => (
  <Fragment>
    <ThemeOptions />
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          {/* Tables */}

          <Route path={`${match.url}/datatables-fixed-header`} component={DataTableFixedHeader}/>
          <Route path={`${match.url}/marcas`} component={Marcas}/>
          <Route path={`${match.url}/formasdepago`} component={Formasdepago}/>
          <Route path={`${match.url}/unidadesmedida`} component={UnidadesDeMedida}/>


        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Tables;
